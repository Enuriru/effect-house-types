const kBloomMetalVS = `
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float2 uv;
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
        out.uv = in.inTexCoord;
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    `;

const kExtractBrightFastModeMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 uv;
    };

    static inline __attribute__((always_inline))
    float4 DownsampleBox4Tap(thread const float2& texelSize, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 d = texelSize.xyxy * float4(-1.0, -1.0, 1.0, 1.0);
        float4 s = _MainTex.sample(_MainTexSmplr, (uv + d.xy));
        s += _MainTex.sample(_MainTexSmplr, (uv + d.zy));
        s += _MainTex.sample(_MainTexSmplr, (uv + d.xw));
        s += _MainTex.sample(_MainTexSmplr, (uv + d.zw));
        return s * 0.25;
    }

    static inline __attribute__((always_inline))
    float PixelBrightness(thread const float3& color, thread const float& useHSV)
    {
        float br = 0.0;
        if (useHSV > 0.5)
        {
            br = fast::max(color.x, color.y);
            br = fast::max(br, color.z);
        }
        else
        {
            br = dot(color, float3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
        }
        return br;
    }

    static inline __attribute__((always_inline))
    float4 QuadraticThreshold(thread float4& color, thread const float& threshold, thread const float3& curve, thread const float& useHSV)
    {
        float3 param = color.xyz;
        float param_1 = useHSV;
        float br = PixelBrightness(param, param_1);
        float rq = fast::clamp(br - curve.x, 0.0, curve.y);
        rq = (curve.z * rq) * rq;
        color *= (fast::max(rq, br - threshold) / fast::max(br, 9.9999997473787516355514526367188e-05));
        return color;
    }

    static inline __attribute__((always_inline))
    float4 Prefilter(thread float4& color, thread const float& useHSV, thread float4 u_clamp, thread float4 u_threshold)
    {
        color = fast::min(float4(u_clamp.x), color);
        float4 param = color;
        float param_1 = u_threshold.x;
        float3 param_2 = u_threshold.yzw;
        float param_3 = useHSV;
        float4 _169 = QuadraticThreshold(param, param_1, param_2, param_3);
        color = _169;
        return color;
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float4& u_clamp [[buffer(0)]], constant float4& u_threshold [[buffer(1)]], constant float2& u_texture_size [[buffer(2)]], constant float2& u_userprop [[buffer(3)]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> _BloomMask [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _BloomMaskSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 color = DownsampleBox4Tap(param, _MainTex, _MainTexSmplr, in.uv);
        float mask = 1.0;
        if (u_userprop.x > 0.5)
        {
            mask = _BloomMask.sample(_BloomMaskSmplr, in.uv).x;
        }
        color *= mask;
        color = fast::clamp(color, float4(0.0), float4(65504.0));
        float4 param_1 = color;
        float param_2 = u_userprop.y;
        float4 _210 = Prefilter(param_1, param_2, u_clamp, u_threshold);
        color = _210;
        out.gl_FragColor = color;
        return out;
    }
    `;

const kExtractBrightMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 uv;
    };

    static inline __attribute__((always_inline))
    float4 DownsampleBox13Tap(thread const float2& texelSize, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 A = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-1.0))));
        float4 B = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-1.0))));
        float4 C = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-1.0))));
        float4 D = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-0.5))));
        float4 E = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-0.5))));
        float4 F = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.0)));
        float4 G = _MainTex.sample(_MainTexSmplr, uv);
        float4 H = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.0)));
        float4 I = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.5)));
        float4 J = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.5)));
        float4 K = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 1.0)));
        float4 L = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 1.0)));
        float4 M = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 1.0)));
        float2 div = float2(0.125, 0.03125);
        float4 o = (((D + E) + I) + J) * div.x;
        o += ((((A + B) + G) + F) * div.y);
        o += ((((B + C) + H) + G) * div.y);
        o += ((((F + G) + L) + K) * div.y);
        o += ((((G + H) + M) + L) * div.y);
        return o;
    }

    static inline __attribute__((always_inline))
    float PixelBrightness(thread const float3& color, thread const float& useHSV)
    {
        float br = 0.0;
        if (useHSV < 0.5)
        {
            br = fast::max(color.x, color.y);
            br = fast::max(br, color.z);
        }
        else
        {
            br = dot(color, float3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
        }
        return br;
    }

    static inline __attribute__((always_inline))
    float4 QuadraticThreshold(thread float4& color, thread const float& threshold, thread const float3& curve, thread const float& useHSV)
    {
        float3 param = color.xyz;
        float param_1 = useHSV;
        float br = PixelBrightness(param, param_1);
        float rq = fast::clamp(br - curve.x, 0.0, curve.y);
        rq = (curve.z * rq) * rq;
        color *= (fast::max(rq, br - threshold) / fast::max(br, 9.9999997473787516355514526367188e-05));
        return color;
    }

    static inline __attribute__((always_inline))
    float4 Prefilter(thread float4& color, thread const float& useHSV, thread float4 u_clamp, thread float4 u_threshold)
    {
        color = fast::min(float4(u_clamp.x), color);
        float4 param = color;
        float param_1 = u_threshold.x;
        float3 param_2 = u_threshold.yzw;
        float param_3 = useHSV;
        float4 _283 = QuadraticThreshold(param, param_1, param_2, param_3);
        color = _283;
        return color;
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float4& u_clamp [[buffer(0)]], constant float4& u_threshold [[buffer(1)]], constant float2& u_texture_size [[buffer(2)]], constant float2& u_userprop [[buffer(3)]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> _BloomMask [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _BloomMaskSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 color = DownsampleBox13Tap(param, _MainTex, _MainTexSmplr, in.uv);
        float mask = 1.0;
        if (u_userprop.x > 0.5)
        {
            mask = _BloomMask.sample(_BloomMaskSmplr, in.uv).x;
        }
        color *= mask;
        color = fast::clamp(color, float4(0.0), float4(65504.0));
        float4 param_1 = color;
        float param_2 = u_userprop.y;
        float4 _324 = Prefilter(param_1, param_2, u_clamp, u_threshold);
        color = _324;
        out.gl_FragColor = color;
        return out;
    }
    `;

    const kDownSampleMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 uv;
    };

    static inline __attribute__((always_inline))
    float4 DownsampleBox13Tap(thread const float2& texelSize, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 A = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-1.0))));
        A = float4(pow(A.xyz, float3(1.5)), A.w);
        float4 B = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-1.0))));
        B = float4(pow(B.xyz, float3(1.5)), B.w);
        float4 C = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-1.0))));
        C = float4(pow(C.xyz, float3(1.5)), C.w);
        float4 D = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-0.5))));
        D = float4(pow(D.xyz, float3(1.5)), D.w);
        float4 E = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * (-0.5))));
        E = float4(pow(E.xyz, float3(1.5)), E.w);
        float4 F = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.0)));
        F = float4(pow(F.xyz, float3(1.5)), F.w);
        float4 G = _MainTex.sample(_MainTexSmplr, uv);
        G = float4(pow(G.xyz, float3(1.5)), G.w);
        float4 H = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.0)));
        H = float4(pow(H.xyz, float3(1.5)), H.w);
        float4 I = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.5)));
        I = float4(pow(I.xyz, float3(1.5)), I.w);
        float4 J = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 0.5)));
        J = float4(pow(J.xyz, float3(1.5)), J.w);
        float4 K = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 1.0)));
        K = float4(pow(K.xyz, float3(1.5)), K.w);
        float4 L = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 1.0)));
        L = float4(pow(L.xyz, float3(1.5)), L.w);
        float4 M = _MainTex.sample(_MainTexSmplr, (uv + (texelSize * 1.0)));
        M = float4(pow(M.xyz, float3(1.5)), M.w);
        float2 div = float2(0.125, 0.03125);
        float4 o = (((D + E) + I) + J) * div.x;
        o += ((((A + B) + G) + F) * div.y);
        o += ((((B + C) + H) + G) * div.y);
        o += ((((F + G) + L) + K) * div.y);
        o += ((((G + H) + M) + L) * div.y);
        return o;
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_texture_size [[buffer(0)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 color = DownsampleBox13Tap(param, _MainTex, _MainTexSmplr, in.uv);
        out.gl_FragColor = float4(pow(color.xyz, float3(0.666666686534881591796875)), color.w);
        return out;
    }
    `;

    const kDownSampleFastModeMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };
    
    struct main0_in
    {
        float2 uv;
    };
    
    static inline __attribute__((always_inline))
    float4 DownsampleBox4Tap(thread const float2& texelSize, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 d = texelSize.xyxy * float4(-1.0, -1.0, 1.0, 1.0);
        float4 c = _MainTex.sample(_MainTexSmplr, (uv + d.xy));
        float4 s = float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zy));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.xw));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zw));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        return s * 0.25;
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_texture_size [[buffer(0)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 color = DownsampleBox4Tap(param, _MainTex, _MainTexSmplr, in.uv);
        out.gl_FragColor = float4(pow(color.xyz, float3(0.666666686534881591796875)), color.w);
        return out;
    }
    `;

    const kUpSampleFastModeMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };
    
    struct main0_in
    {
        float2 uv;
    };
    
    static inline __attribute__((always_inline))
    float4 UpsampleBox(thread const float2& texelSize, thread const float4& sampleScale, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 d = (texelSize.xyxy * float4(-1.0, -1.0, 1.0, 1.0)) * (sampleScale * 0.5);
        float4 c = _MainTex.sample(_MainTexSmplr, (uv + d.xy));
        float4 s = float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zy));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.xw));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zw));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        return s * 0.25;
    }
    
    static inline __attribute__((always_inline))
    float4 Combine(thread const float4& bloom, thread float2& uv, thread texture2d<float> _BloomTex, thread const sampler _BloomTexSmplr)
    {
        float4 c = _BloomTex.sample(_BloomTexSmplr, uv);
        float4 s = float4(pow(c.xyz, float3(1.5)), c.w);
        return bloom + s;
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_texture_size [[buffer(0)]], constant float& u_sample_scale [[buffer(1)]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> _BloomTex [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _BloomTexSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 param_1 = float4(u_sample_scale);
        float4 color = UpsampleBox(param, param_1, _MainTex, _MainTexSmplr, in.uv);
        float4 param_2 = color;
        float4 c = Combine(param_2, in.uv, _BloomTex, _BloomTexSmplr);
        out.gl_FragColor = float4(pow(c.xyz, float3(0.666666686534881591796875)), c.w);
        return out;
    }
    `;

    const kUpSampleMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 uv;
    };

    static inline __attribute__((always_inline))
    float4 UpsampleTent(thread const float2& texelSize, thread const float4& sampleScale, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 d = (texelSize.xyxy * float4(1.0, 1.0, -1.0, 0.0)) * sampleScale;
        float4 c = _MainTex.sample(_MainTexSmplr, (uv - d.xy));
        float4 s = float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv - d.wy));
        s += (float4(pow(c.xyz, float3(1.5)), c.w) * 2.0);
        c = _MainTex.sample(_MainTexSmplr, (uv - d.zy));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zw));
        s += (float4(pow(c.xyz, float3(1.5)), c.w) * 2.0);
        c = _MainTex.sample(_MainTexSmplr, uv);
        s += (float4(pow(c.xyz, float3(1.5)), c.w) * 4.0);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.xw));
        s += (float4(pow(c.xyz, float3(1.5)), c.w) * 2.0);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zy));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.wy));
        s += (float4(pow(c.xyz, float3(1.5)), c.w) * 2.0);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.xy));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        return s * 0.0625;
    }

    static inline __attribute__((always_inline))
    float4 Combine(thread const float4& bloom, thread float2& uv, thread texture2d<float> _BloomTex, thread const sampler _BloomTexSmplr)
    {
        float4 c = _BloomTex.sample(_BloomTexSmplr, uv);
        float4 color = float4(pow(c.xyz, float3(1.5)), c.w);
        return bloom + color;
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_texture_size [[buffer(0)]], constant float& u_sample_scale [[buffer(1)]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> _BloomTex [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _BloomTexSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 param_1 = float4(u_sample_scale);
        float4 color = UpsampleTent(param, param_1, _MainTex, _MainTexSmplr, in.uv);
        float4 param_2 = color;
        float4 c = Combine(param_2, in.uv, _BloomTex, _BloomTexSmplr);
        out.gl_FragColor = float4(pow(c.xyz, float3(0.666666686534881591796875)), c.w);
        return out;
    }
    `;

    const kUpSampleFinalFastModeMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };
    
    struct main0_in
    {
        float2 uv;
    };
    
    static inline __attribute__((always_inline))
    float4 UpsampleBox(thread const float2& texelSize, thread const float4& sampleScale, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 d = (texelSize.xyxy * float4(-1.0, -1.0, 1.0, 1.0)) * (sampleScale * 0.5);
        float4 c = _MainTex.sample(_MainTexSmplr, (uv + d.xy));
        float4 s = float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zy));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.xw));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        c = _MainTex.sample(_MainTexSmplr, (uv + d.zw));
        s += float4(pow(c.xyz, float3(1.5)), c.w);
        return s * 0.25;
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_texture_size [[buffer(0)]], constant float& u_sample_scale [[buffer(1)]], constant float4& u_bloom_color [[buffer(2)]], constant float& u_intensity [[buffer(3)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 param_1 = float4(u_sample_scale);
        float4 color = UpsampleBox(param, param_1, _MainTex, _MainTexSmplr, in.uv);
        float3 _140 = (color.xyz * u_bloom_color.xyz) * u_intensity;
        color = float4(_140.x, _140.y, _140.z, color.w);
        color.w *= u_bloom_color.w;
        out.gl_FragColor = float4(pow(color.xyz, float3(0.666666686534881591796875)), color.w);
        return out;
    }
    `;

    const kUpSampleFinalMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };
    
    struct main0_in
    {
        float2 uv;
    };
    
    static inline __attribute__((always_inline))
    float4 UpsampleTent(thread const float2& texelSize, thread const float4& sampleScale, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float2& uv)
    {
        float4 d = (texelSize.xyxy * float4(1.0, 1.0, -1.0, 0.0)) * sampleScale;
        float4 s = pow(_MainTex.sample(_MainTexSmplr, (uv - d.xy)), float4(1.5));
        s += (pow(_MainTex.sample(_MainTexSmplr, (uv - d.wy)), float4(1.5)) * 2.0);
        s += pow(_MainTex.sample(_MainTexSmplr, (uv - d.zy)), float4(1.5));
        s += (pow(_MainTex.sample(_MainTexSmplr, (uv + d.zw)), float4(1.5)) * 2.0);
        s += (pow(_MainTex.sample(_MainTexSmplr, uv), float4(1.5)) * 4.0);
        s += (pow(_MainTex.sample(_MainTexSmplr, (uv + d.xw)), float4(1.5)) * 2.0);
        s += pow(_MainTex.sample(_MainTexSmplr, (uv + d.zy)), float4(1.5));
        s += (pow(_MainTex.sample(_MainTexSmplr, (uv + d.wy)), float4(1.5)) * 2.0);
        s += pow(_MainTex.sample(_MainTexSmplr, (uv + d.xy)), float4(1.5));
        return s * 0.0625;
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_texture_size [[buffer(0)]], constant float& u_sample_scale [[buffer(1)]], constant float4& u_bloom_color [[buffer(2)]], constant float& u_intensity [[buffer(3)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 param = float2(1.0 / u_texture_size.x, 1.0 / u_texture_size.y);
        float4 param_1 = float4(u_sample_scale);
        float4 color = UpsampleTent(param, param_1, _MainTex, _MainTexSmplr, in.uv);
        float3 _153 = (color.xyz * u_bloom_color.xyz) * u_intensity;
        color = float4(_153.x, _153.y, _153.z, color.w);
        color.w *= u_bloom_color.w;
        out.gl_FragColor = pow(color, float4(0.666666686534881591796875));
        return out;
    }
    `;

    const kBloomMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };
    
    struct main0_in
    {
        float2 uv;
    };
    
    static inline __attribute__((always_inline))
    float3 jodieReinhardTonemap(thread const float3& c)
    {
        float l = dot(c, float3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
        float3 tc = c / (c + float3(1.0));
        return mix(c / float3(l + 1.0), tc, tc);
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float& u_hdr [[buffer(0)]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> _PreviewTex [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _PreviewTexSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float4 bloomColor = _MainTex.sample(_MainTexSmplr, in.uv);
        float4 originColor = _PreviewTex.sample(_PreviewTexSmplr, in.uv);
        float4 color1 = originColor;
        float4 color2 = pow(bloomColor, float4(1.0));
        if (u_hdr > 0.0)
        {
            float3 param = color2.xyz;
            float3 _73 = jodieReinhardTonemap(param);
            color2 = float4(_73.x, _73.y, _73.z, color2.w);
        }
        out.gl_FragColor = float4((color2 + color1).xyz, color1.w);
        return out;
    }
    `;

exports.kBloomMetalVS = kBloomMetalVS
exports.kExtractBrightFastModeMetalFS = kExtractBrightFastModeMetalFS
exports.kExtractBrightMetalFS = kExtractBrightMetalFS
exports.kDownSampleFastModeMetalFS = kDownSampleFastModeMetalFS
exports.kDownSampleMetalFS = kDownSampleMetalFS
exports.kUpSampleFastModeMetalFS = kUpSampleFastModeMetalFS
exports.kUpSampleMetalFS = kUpSampleMetalFS
exports.kUpSampleFinalFastModeMetalFS = kUpSampleFinalFastModeMetalFS
exports.kUpSampleFinalMetalFS = kUpSampleFinalMetalFS
exports.kBloomMetalFS = kBloomMetalFS