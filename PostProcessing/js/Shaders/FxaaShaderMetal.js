const kFxaaMetalVS = `
    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float2 v_uv;
        float4 gl_Position [[position]];
    };
    
    struct main0_in
    {
        float3 inPosition [[attribute(0)]];
        float2 inTexCoord [[attribute(1)]];
    };
    
    vertex main0_out main0(main0_in in [[stage_in]])
    {
        main0_out out = {};
        out.gl_Position = float4(in.inPosition, 1.0);
        out.v_uv = in.inTexCoord;
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    `;

    const kFxaaMetalFS1 = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"
    #pragma clang diagnostic ignored "-Wmissing-braces"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    template<typename T, size_t Num>
    struct spvUnsafeArray
    {
        T elements[Num ? Num : 1];
        
        thread T& operator [] (size_t pos) thread
        {
            return elements[pos];
        }
        constexpr const thread T& operator [] (size_t pos) const thread
        {
            return elements[pos];
        }
        
        device T& operator [] (size_t pos) device
        {
            return elements[pos];
        }
        constexpr const device T& operator [] (size_t pos) const device
        {
            return elements[pos];
        }
        
        constexpr const constant T& operator [] (size_t pos) const constant
        {
            return elements[pos];
        }
        
        threadgroup T& operator [] (size_t pos) threadgroup
        {
            return elements[pos];
        }
        constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
        {
            return elements[pos];
        }
    };

    struct LuminanceData
    {
        float m;
        float n;
        float e;
        float s;
        float w;
        float highest;
        float lowest;
        float contrast;
        float ne;
        float nw;
        float se;
        float sw;
    };

    struct EdgeData
    {
        bool isHorizontal;
        float pixelStep;
        float oppositeLuminance;
        float gradient;
    };

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 v_uv;
    };

    static inline __attribute__((always_inline))
    float4 Sample(thread const float2& uv, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr)
    {
        float4 _63 = _MainTex.sample(_MainTexSmplr, uv);
        return _63;
    }

    static inline __attribute__((always_inline))
    float SampleLuminance(thread const float2& uv, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr)
    {
        float2 param = uv;
        return Sample(param, _MainTex, _MainTexSmplr).y;
    }

    static inline __attribute__((always_inline))
    float SampleLuminance(thread float2& uv, thread const float& uOffset, thread const float& vOffset, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float4 u_ScreenParams)
    {
        float2 texture_texelSize = u_ScreenParams.zw - float2(1.0);
        uv += (texture_texelSize * float2(uOffset, vOffset));
        float2 param = uv;
        return SampleLuminance(param, _MainTex, _MainTexSmplr);
    }

    static inline __attribute__((always_inline))
    LuminanceData SampleLuminanceNeighborhood(thread const float2& uv, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float4 u_ScreenParams)
    {
        float2 param = uv;
        LuminanceData l;
        l.m = SampleLuminance(param, _MainTex, _MainTexSmplr);
        float2 param_1 = uv;
        float param_2 = 0.0;
        float param_3 = 1.0;
        float _108 = SampleLuminance(param_1, param_2, param_3, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.n = _108;
        float2 param_4 = uv;
        float param_5 = 1.0;
        float param_6 = 0.0;
        float _115 = SampleLuminance(param_4, param_5, param_6, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.e = _115;
        float2 param_7 = uv;
        float param_8 = 0.0;
        float param_9 = -1.0;
        float _123 = SampleLuminance(param_7, param_8, param_9, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.s = _123;
        float2 param_10 = uv;
        float param_11 = -1.0;
        float param_12 = 0.0;
        float _130 = SampleLuminance(param_10, param_11, param_12, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.w = _130;
        float2 param_13 = uv;
        float param_14 = 1.0;
        float param_15 = 1.0;
        float _137 = SampleLuminance(param_13, param_14, param_15, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.ne = _137;
        float2 param_16 = uv;
        float param_17 = -1.0;
        float param_18 = 1.0;
        float _144 = SampleLuminance(param_16, param_17, param_18, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.nw = _144;
        float2 param_19 = uv;
        float param_20 = 1.0;
        float param_21 = -1.0;
        float _151 = SampleLuminance(param_19, param_20, param_21, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.se = _151;
        float2 param_22 = uv;
        float param_23 = -1.0;
        float param_24 = -1.0;
        float _158 = SampleLuminance(param_22, param_23, param_24, _MainTex, _MainTexSmplr, u_ScreenParams);
        l.sw = _158;
        l.highest = fast::max(fast::max(fast::max(fast::max(l.n, l.e), l.s), l.w), l.m);
        l.lowest = fast::min(fast::min(fast::min(fast::min(l.n, l.e), l.s), l.w), l.m);
        l.contrast = l.highest - l.lowest;
        return l;
    }

    static inline __attribute__((always_inline))
    bool ShouldSkipPixel(thread const LuminanceData& l)
    {
        float threshold = fast::max(0.031199999153614044189453125, 0.063000001013278961181640625 * l.highest);
        return l.contrast < threshold;
    }

    static inline __attribute__((always_inline))
    float DeterminPixelBlendFactor(thread const LuminanceData& l)
    {
        float f = 2.0 * (((l.n + l.e) + l.s) + l.w);
        f += (((l.ne + l.nw) + l.se) + l.sw);
        f *= 0.083333335816860198974609375;
        f = abs(f - l.m);
        f = fast::clamp(f / l.contrast, 0.0, 1.0);
        float blendFactor = smoothstep(0.0, 1.0, f);
        return (blendFactor * blendFactor) * 1.0;
    }

    static inline __attribute__((always_inline))
    EdgeData DeterminEdge(thread const LuminanceData& l, thread float4 u_ScreenParams)
    {
        float2 texture_texelSize = u_ScreenParams.zw - float2(1.0);
        float horizontal = ((abs((l.n + l.s) - (2.0 * l.m)) * 2.0) + abs((l.ne + l.se) - (2.0 * l.e))) + abs((l.nw + l.sw) - (2.0 * l.w));
        float vertical = ((abs((l.e + l.w) - (2.0 * l.m)) * 2.0) + abs((l.ne + l.nw) - (2.0 * l.n))) + abs((l.se + l.sw) - (2.0 * l.s));
        EdgeData e;
        if (horizontal >= vertical)
        {
            e.isHorizontal = true;
        }
        else
        {
            e.isHorizontal = false;
        }
        float _338;
        if (e.isHorizontal)
        {
            _338 = l.n;
        }
        else
        {
            _338 = l.e;
        }
        float pLuminance = _338;
        float _350;
        if (e.isHorizontal)
        {
            _350 = l.s;
        }
        else
        {
            _350 = l.w;
        }
        float nLuminance = _350;
        float pGradient = abs(pLuminance - l.m);
        float nGradient = abs(nLuminance - l.m);
        float _373;
        if (e.isHorizontal)
        {
            _373 = texture_texelSize.y;
        }
        else
        {
            _373 = texture_texelSize.x;
        }
        e.pixelStep = _373;
        if (pGradient < nGradient)
        {
            e.pixelStep = -e.pixelStep;
            e.oppositeLuminance = nLuminance;
            e.gradient = nGradient;
        }
        else
        {
            e.oppositeLuminance = pLuminance;
            e.gradient = pGradient;
        }
        return e;
    }

    static inline __attribute__((always_inline))
    float DeterminEdgeBlendFactor(thread const LuminanceData& l, thread const EdgeData& e, thread const float2& uv, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float4 u_ScreenParams)
    {
        spvUnsafeArray<float, 10> edgeSteps;
        edgeSteps[0] = 1.0;
        edgeSteps[1] = 1.5;
        edgeSteps[2] = 2.0;
        edgeSteps[3] = 2.0;
        edgeSteps[4] = 2.0;
        edgeSteps[5] = 2.0;
        edgeSteps[6] = 2.0;
        edgeSteps[7] = 2.0;
        edgeSteps[8] = 2.0;
        edgeSteps[9] = 4.0;
        float2 uvEdge = uv;
        float2 texture_texelSize = u_ScreenParams.zw - float2(1.0);
        float2 edgeStep;
        if (e.isHorizontal)
        {
            uvEdge.y += (e.pixelStep * 0.5);
            edgeStep = float2(texture_texelSize.x, 0.0);
        }
        else
        {
            uvEdge.x += (e.pixelStep * 0.5);
            edgeStep = float2(0.0, texture_texelSize.y);
        }
        float edgeLuminance = (l.m + e.oppositeLuminance) * 0.5;
        float gradientThreshold = e.gradient * 0.25;
        float2 puv = uvEdge + (edgeStep * edgeSteps[0]);
        float2 param = puv;
        float pLuminanceDelta = SampleLuminance(param, _MainTex, _MainTexSmplr) - edgeLuminance;
        bool pAtEnd = abs(pLuminanceDelta) >= gradientThreshold;
        for (int i = 1; (i < 10) && (!pAtEnd); i++)
        {
            puv += (edgeStep * edgeSteps[i]);
            float2 param_1 = puv;
            pLuminanceDelta = SampleLuminance(param_1, _MainTex, _MainTexSmplr) - edgeLuminance;
            pAtEnd = abs(pLuminanceDelta) >= gradientThreshold;
        }
        if (!pAtEnd)
        {
            puv += (edgeStep * 8.0);
        }
        float2 nuv = uvEdge - (edgeStep * edgeSteps[0]);
        float2 param_2 = nuv;
        float nLuminanceDelta = SampleLuminance(param_2, _MainTex, _MainTexSmplr) - edgeLuminance;
        bool nAtEnd = abs(nLuminanceDelta) >= gradientThreshold;
        for (int i_1 = 0; (i_1 < 10) && (!nAtEnd); i_1++)
        {
            nuv -= (edgeStep * edgeSteps[i_1]);
            float2 param_3 = nuv;
            nLuminanceDelta = SampleLuminance(param_3, _MainTex, _MainTexSmplr) - edgeLuminance;
            nAtEnd = abs(nLuminanceDelta) >= gradientThreshold;
        }
        if (!nAtEnd)
        {
            nuv -= (edgeStep * 8.0);
        }
        float pDistance;
        float nDistance;
        if (e.isHorizontal)
        {
            pDistance = puv.x - uv.x;
            nDistance = uv.x - nuv.x;
        }
        else
        {
            pDistance = puv.y - uv.y;
            nDistance = uv.y - nuv.y;
        }
        float shortestDistance;
        bool deltaSign;
        if (pDistance <= nDistance)
        {
            shortestDistance = pDistance;
            deltaSign = pLuminanceDelta >= 0.0;
        }
        else
        {
            shortestDistance = nDistance;
            deltaSign = nLuminanceDelta >= 0.0;
        }
        if (deltaSign == ((l.m - edgeLuminance) >= 0.0))
        {
            return 0.0;
        }
        return 0.5 - (shortestDistance / (pDistance + nDistance));
    }

    static inline __attribute__((always_inline))
    float4 ApplyFXAA(thread float2& uv, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float4 u_ScreenParams)
    {
        float2 param = uv;
        LuminanceData l = SampleLuminanceNeighborhood(param, _MainTex, _MainTexSmplr, u_ScreenParams);
        LuminanceData param_1 = l;
        if (ShouldSkipPixel(param_1))
        {
            float2 param_2 = uv;
            return Sample(param_2, _MainTex, _MainTexSmplr);
        }
        LuminanceData param_3 = l;
        float pixelBlend = DeterminPixelBlendFactor(param_3);
        LuminanceData param_4 = l;
        EdgeData e = DeterminEdge(param_4, u_ScreenParams);
        LuminanceData param_5 = l;
        EdgeData param_6 = e;
        float2 param_7 = uv;
        float edgeBlend = DeterminEdgeBlendFactor(param_5, param_6, param_7, _MainTex, _MainTexSmplr, u_ScreenParams);
        float finalBlend = fast::max(pixelBlend, edgeBlend);
        if (e.isHorizontal)
        {
            uv.y += (e.pixelStep * finalBlend);
        }
        else
        {
            uv.x += (e.pixelStep * finalBlend);
        }
        float2 param_8 = uv;
        return Sample(param_8, _MainTex, _MainTexSmplr);
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float4& u_ScreenParams [[buffer(0)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        if (u_ScreenParams.z < 1.0)
        {
            float2 param = in.v_uv;
            out.gl_FragColor = Sample(param, _MainTex, _MainTexSmplr);
            return out;
        }
        float2 param_1 = in.v_uv;
        float4 _728 = ApplyFXAA(param_1, _MainTex, _MainTexSmplr, u_ScreenParams);
        float4 color = _728;
        out.gl_FragColor = color;
        return out;
    }
    `;

exports.kFxaaMetalVS = kFxaaMetalVS
exports.kFxaaMetalFS1 = kFxaaMetalFS1