const kSSAOMetalVS = `
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

    const kSSAOMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 o_fragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 v_uv;
    };

    static inline __attribute__((always_inline))
    float SampleDepth0(thread const float2& screenPos, thread texture2d<float> u_depth_tex, thread const sampler u_depth_texSmplr)
    {
        return u_depth_tex.sample(u_depth_texSmplr, screenPos).x;
    }

    static inline __attribute__((always_inline))
    float linearEyeDepth(thread const float& z, thread float4 u_ProjectionParams)
    {
        float near = u_ProjectionParams.y;
        float far = u_ProjectionParams.z;
        float zc0 = (1.0 - (far / near)) / 2.0;
        float zc1 = (1.0 + (far / near)) / 2.0;
        float zc2 = zc0 / far;
        float zc3 = zc1 / far;
        return 1.0 / ((zc2 * z) + zc3);
    }

    static inline __attribute__((always_inline))
    float4 ConvertDepth(thread const float2& aUV, thread const float& sampledDepth, thread float4 u_ProjectionParams, thread float4 u_uv2view)
    {
        float param = sampledDepth;
        float viewDepth = -linearEyeDepth(param, u_ProjectionParams);
        return float4(((aUV * u_uv2view.xy) + u_uv2view.zw) * viewDepth, viewDepth, sampledDepth);
    }

    static inline __attribute__((always_inline))
    float ComputeDistanceFade(thread const float& _distance, thread float2 u_ao_fade_params)
    {
        return fast::clamp(fast::max(0.0, _distance - u_ao_fade_params.x) * u_ao_fade_params.y, 0.0, 1.0);
    }

    static inline __attribute__((always_inline))
    void GetFadeIntensity_Radius_Thickness(thread const float& linearDepth, thread float& oIntensity, thread float& oRadius, thread float& oThickness, thread float2 u_ao_fade_params, thread float4 u_ao_levels, thread float u_ao_radius, thread float u_ao_thickness, thread float4 u_ao_fade_values)
    {
        float param = linearDepth;
        float3 intensity_radius_thickness = mix(float3(u_ao_levels.w, u_ao_radius, u_ao_thickness), u_ao_fade_values.xyw, float3(ComputeDistanceFade(param, u_ao_fade_params)));
        oIntensity = intensity_radius_thickness.x;
        oRadius = intensity_radius_thickness.y;
        oThickness = intensity_radius_thickness.z;
    }

    static inline __attribute__((always_inline))
    float4 FetchPosition0(thread const float2& uv, thread float4 u_ProjectionParams, thread texture2d<float> u_depth_tex, thread const sampler u_depth_texSmplr, thread float4 u_uv2view)
    {
        float2 param = uv;
        float sampledDepth = SampleDepth0(param, u_depth_tex, u_depth_texSmplr);
        float2 param_1 = uv;
        float param_2 = sampledDepth;
        return ConvertDepth(param_1, param_2, u_ProjectionParams, u_uv2view);
    }

    static inline __attribute__((always_inline))
    float3 FetchNormal(thread const float2& uv, thread const int& normalSource, thread float4 u_ProjectionParams, thread texture2d<float> u_depth_tex, thread const sampler u_depth_texSmplr, thread float4 u_uv2view, thread float4 u_maintex_texel_size)
    {
        float2 param = uv;
        float3 c = FetchPosition0(param, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz;
        float2 param_1 = uv + (float2(1.0, 0.0) * u_maintex_texel_size.xy);
        float3 r = FetchPosition0(param_1, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz;
        float2 param_2 = uv + (float2(-1.0, 0.0) * u_maintex_texel_size.xy);
        float3 l = FetchPosition0(param_2, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz;
        float2 param_3 = uv + (float2(0.0, 1.0) * u_maintex_texel_size.xy);
        float3 t = FetchPosition0(param_3, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz;
        float2 param_4 = uv + (float2(0.0, -1.0) * u_maintex_texel_size.xy);
        float3 b = FetchPosition0(param_4, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz;
        float3 vr = r - c;
        float3 vl = c - l;
        float3 vt = t - c;
        float3 vb = c - b;
        float3 min_horiz = select(vl, vr, bool3(dot(vr, vr) < dot(vl, vl)));
        float3 min_vert = select(vb, vt, bool3(dot(vt, vt) < dot(vb, vb)));
        float3 normalScreenSpace = normalize(cross(min_horiz, min_vert));
        return float3(normalScreenSpace.x, normalScreenSpace.y, normalScreenSpace.z);
    }

    static inline __attribute__((always_inline))
    float JimenezNoise(thread const float2& xyPixelPos)
    {
        return fract(52.98291778564453125 * fract(dot(xyPixelPos, float2(0.067110560834407806396484375, 0.005837149918079376220703125))));
    }

    static inline __attribute__((always_inline))
    void GetSpatialDirections_Offsets_JimenezNoise(thread const float2& screenPos, thread const float2& textureSizeZW, thread float& oNoiseSpatialOffsets, thread float& oNoiseSpatialDirections)
    {
        float2 xyPixelPos = ceil(screenPos * textureSizeZW);
        oNoiseSpatialOffsets = (0.25 * fract((xyPixelPos.y - xyPixelPos.x) / 4.0)) * 4.0;
        float2 param = xyPixelPos;
        oNoiseSpatialDirections = JimenezNoise(param);
    }

    static inline __attribute__((always_inline))
    float2 SampleSteps(thread const float& stepCount, thread const float2& screenPos, thread const float2& slideDir_x_texelSize, thread const float& stepRadius, thread const float& initialRayStep, thread const float& twoOverSquaredRadius, thread const float& thickness, thread const float3& vpos, thread const float3& vdir, thread float4 u_ProjectionParams, thread texture2d<float> u_depth_tex, thread const sampler u_depth_texSmplr, thread float4 u_uv2view)
    {
        float2 h = float2(-1.0);
        float2 uvOffset = slideDir_x_texelSize * fast::max(stepRadius * (0.0 + initialRayStep), 1.0);
        float4 uv = float4(screenPos, screenPos) + float4(uvOffset, -uvOffset);
        float2 param = uv.xy;
        float3 ds = FetchPosition0(param, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_1 = uv.zw;
        float3 dt = FetchPosition0(param_1, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt = float2(dot(ds, ds), dot(dt, dt));
        float2 rLength = rsqrt(dsdt + float2(9.9999997473787516355514526367188e-05));
        float2 H = float2(dot(ds, vdir), dot(dt, vdir)) * rLength;
        float2 attn = fast::clamp(dsdt * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H = mix(H, h, attn);
        bool _459 = H.x > h.x;
        bool _467;
        if (_459)
        {
            _467 = H.y > h.y;
        }
        else
        {
            _467 = _459;
        }
        float2 _468;
        if (_467)
        {
            _468 = H;
        }
        else
        {
            _468 = mix(H, h, float2(thickness));
        }
        h = _468;
        float2 uvOffset_1 = slideDir_x_texelSize * fast::max(stepRadius * (1.0 + initialRayStep), 2.0);
        float4 uv_1 = float4(screenPos, screenPos) + float4(uvOffset_1, -uvOffset_1);
        float2 param_2 = uv_1.xy;
        float3 ds_1 = FetchPosition0(param_2, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_3 = uv_1.zw;
        float3 dt_1 = FetchPosition0(param_3, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_1 = float2(dot(ds_1, ds_1), dot(dt_1, dt_1));
        float2 rLength_1 = rsqrt(dsdt_1 + float2(9.9999997473787516355514526367188e-05));
        float2 H_1 = float2(dot(ds_1, vdir), dot(dt_1, vdir)) * rLength_1;
        float2 attn_1 = fast::clamp(dsdt_1 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_1 = mix(H_1, h, attn_1);
        bool _559 = H_1.x > h.x;
        bool _567;
        if (_559)
        {
            _567 = H_1.y > h.y;
        }
        else
        {
            _567 = _559;
        }
        float2 _568;
        if (_567)
        {
            _568 = H_1;
        }
        else
        {
            _568 = mix(H_1, h, float2(thickness));
        }
        h = _568;
        float2 uvOffset_2 = slideDir_x_texelSize * fast::max(stepRadius * (2.0 + initialRayStep), 3.0);
        float4 uv_2 = float4(screenPos, screenPos) + float4(uvOffset_2, -uvOffset_2);
        float2 param_4 = uv_2.xy;
        float3 ds_2 = FetchPosition0(param_4, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_5 = uv_2.zw;
        float3 dt_2 = FetchPosition0(param_5, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_2 = float2(dot(ds_2, ds_2), dot(dt_2, dt_2));
        float2 rLength_2 = rsqrt(dsdt_2 + float2(9.9999997473787516355514526367188e-05));
        float2 H_2 = float2(dot(ds_2, vdir), dot(dt_2, vdir)) * rLength_2;
        float2 attn_2 = fast::clamp(dsdt_2 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_2 = mix(H_2, h, attn_2);
        bool _660 = H_2.x > h.x;
        bool _668;
        if (_660)
        {
            _668 = H_2.y > h.y;
        }
        else
        {
            _668 = _660;
        }
        float2 _669;
        if (_668)
        {
            _669 = H_2;
        }
        else
        {
            _669 = mix(H_2, h, float2(thickness));
        }
        h = _669;
        float2 uvOffset_3 = slideDir_x_texelSize * fast::max(stepRadius * (3.0 + initialRayStep), 4.0);
        float4 uv_3 = float4(screenPos, screenPos) + float4(uvOffset_3, -uvOffset_3);
        float2 param_6 = uv_3.xy;
        float3 ds_3 = FetchPosition0(param_6, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_7 = uv_3.zw;
        float3 dt_3 = FetchPosition0(param_7, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_3 = float2(dot(ds_3, ds_3), dot(dt_3, dt_3));
        float2 rLength_3 = rsqrt(dsdt_3 + float2(9.9999997473787516355514526367188e-05));
        float2 H_3 = float2(dot(ds_3, vdir), dot(dt_3, vdir)) * rLength_3;
        float2 attn_3 = fast::clamp(dsdt_3 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_3 = mix(H_3, h, attn_3);
        bool _760 = H_3.x > h.x;
        bool _768;
        if (_760)
        {
            _768 = H_3.y > h.y;
        }
        else
        {
            _768 = _760;
        }
        float2 _769;
        if (_768)
        {
            _769 = H_3;
        }
        else
        {
            _769 = mix(H_3, h, float2(thickness));
        }
        h = _769;
        float2 uvOffset_4 = slideDir_x_texelSize * fast::max(stepRadius * (4.0 + initialRayStep), 5.0);
        float4 uv_4 = float4(screenPos, screenPos) + float4(uvOffset_4, -uvOffset_4);
        float2 param_8 = uv_4.xy;
        float3 ds_4 = FetchPosition0(param_8, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_9 = uv_4.zw;
        float3 dt_4 = FetchPosition0(param_9, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_4 = float2(dot(ds_4, ds_4), dot(dt_4, dt_4));
        float2 rLength_4 = rsqrt(dsdt_4 + float2(9.9999997473787516355514526367188e-05));
        float2 H_4 = float2(dot(ds_4, vdir), dot(dt_4, vdir)) * rLength_4;
        float2 attn_4 = fast::clamp(dsdt_4 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_4 = mix(H_4, h, attn_4);
        bool _861 = H_4.x > h.x;
        bool _869;
        if (_861)
        {
            _869 = H_4.y > h.y;
        }
        else
        {
            _869 = _861;
        }
        float2 _870;
        if (_869)
        {
            _870 = H_4;
        }
        else
        {
            _870 = mix(H_4, h, float2(thickness));
        }
        h = _870;
        float2 uvOffset_5 = slideDir_x_texelSize * fast::max(stepRadius * (5.0 + initialRayStep), 6.0);
        float4 uv_5 = float4(screenPos, screenPos) + float4(uvOffset_5, -uvOffset_5);
        float2 param_10 = uv_5.xy;
        float3 ds_5 = FetchPosition0(param_10, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_11 = uv_5.zw;
        float3 dt_5 = FetchPosition0(param_11, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_5 = float2(dot(ds_5, ds_5), dot(dt_5, dt_5));
        float2 rLength_5 = rsqrt(dsdt_5 + float2(9.9999997473787516355514526367188e-05));
        float2 H_5 = float2(dot(ds_5, vdir), dot(dt_5, vdir)) * rLength_5;
        float2 attn_5 = fast::clamp(dsdt_5 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_5 = mix(H_5, h, attn_5);
        bool _962 = H_5.x > h.x;
        bool _970;
        if (_962)
        {
            _970 = H_5.y > h.y;
        }
        else
        {
            _970 = _962;
        }
        float2 _971;
        if (_970)
        {
            _971 = H_5;
        }
        else
        {
            _971 = mix(H_5, h, float2(thickness));
        }
        h = _971;
        float2 uvOffset_6 = slideDir_x_texelSize * fast::max(stepRadius * (6.0 + initialRayStep), 7.0);
        float4 uv_6 = float4(screenPos, screenPos) + float4(uvOffset_6, -uvOffset_6);
        float2 param_12 = uv_6.xy;
        float3 ds_6 = FetchPosition0(param_12, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_13 = uv_6.zw;
        float3 dt_6 = FetchPosition0(param_13, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_6 = float2(dot(ds_6, ds_6), dot(dt_6, dt_6));
        float2 rLength_6 = rsqrt(dsdt_6 + float2(9.9999997473787516355514526367188e-05));
        float2 H_6 = float2(dot(ds_6, vdir), dot(dt_6, vdir)) * rLength_6;
        float2 attn_6 = fast::clamp(dsdt_6 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_6 = mix(H_6, h, attn_6);
        bool _1063 = H_6.x > h.x;
        bool _1071;
        if (_1063)
        {
            _1071 = H_6.y > h.y;
        }
        else
        {
            _1071 = _1063;
        }
        float2 _1072;
        if (_1071)
        {
            _1072 = H_6;
        }
        else
        {
            _1072 = mix(H_6, h, float2(thickness));
        }
        h = _1072;
        float2 uvOffset_7 = slideDir_x_texelSize * fast::max(stepRadius * (7.0 + initialRayStep), 8.0);
        float4 uv_7 = float4(screenPos, screenPos) + float4(uvOffset_7, -uvOffset_7);
        float2 param_14 = uv_7.xy;
        float3 ds_7 = FetchPosition0(param_14, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 param_15 = uv_7.zw;
        float3 dt_7 = FetchPosition0(param_15, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view).xyz - vpos;
        float2 dsdt_7 = float2(dot(ds_7, ds_7), dot(dt_7, dt_7));
        float2 rLength_7 = rsqrt(dsdt_7 + float2(9.9999997473787516355514526367188e-05));
        float2 H_7 = float2(dot(ds_7, vdir), dot(dt_7, vdir)) * rLength_7;
        float2 attn_7 = fast::clamp(dsdt_7 * float2(twoOverSquaredRadius).xx, float2(0.0), float2(1.0));
        H_7 = mix(H_7, h, attn_7);
        bool _1164 = H_7.x > h.x;
        bool _1172;
        if (_1164)
        {
            _1172 = H_7.y > h.y;
        }
        else
        {
            _1172 = _1164;
        }
        float2 _1173;
        if (_1172)
        {
            _1173 = H_7;
        }
        else
        {
            _1173 = mix(H_7, h, float2(thickness));
        }
        h = _1173;
        return h;
    }

    static inline __attribute__((always_inline))
    float linear01Depth(thread const float& z, thread float4 u_ProjectionParams)
    {
        float near = u_ProjectionParams.y;
        float far = u_ProjectionParams.z;
        float zc0 = (1.0 - (far / near)) / 2.0;
        float zc1 = (1.0 + (far / near)) / 2.0;
        return 1.0 / ((zc0 * z) + zc1);
    }

    static inline __attribute__((always_inline))
    void GetGTAO(thread const float2& uv, thread const bool& useDynamicDepthMips, thread const float& directionCount, thread const float& stepCount, thread const int& normalSource, thread float& oOutDepth, thread float4& oOutRGBA, thread float4 u_ProjectionParams, thread texture2d<float> u_depth_tex, thread const sampler u_depth_texSmplr, thread float4 u_uv2view, thread float2 u_ao_fade_params, thread float4 u_ao_levels, thread float u_ao_radius, thread float u_ao_thickness, thread float4 u_ao_fade_values, thread float4 u_maintex_texel_size, thread float u_ao_half_proj_scale, thread float u_ao_bias, thread float u_one_over_depthscale)
    {
        float2 screenPos = uv;
        float2 depthUVoffset = float2(0.25) * u_maintex_texel_size.xy;
        float2 sampleUVDepth = screenPos - depthUVoffset;
        float2 param = uv;
        float sampledDepth = SampleDepth0(param, u_depth_tex, u_depth_texSmplr);
        float2 param_1 = sampleUVDepth;
        float param_2 = sampledDepth;
        float4 vpos = ConvertDepth(param_1, param_2, u_ProjectionParams, u_uv2view);
        float param_3 = vpos.z;
        float param_4;
        float param_5;
        float param_6;
        GetFadeIntensity_Radius_Thickness(param_3, param_4, param_5, param_6, u_ao_fade_params, u_ao_levels, u_ao_radius, u_ao_thickness, u_ao_fade_values);
        float intensity = param_4;
        float radius = param_5;
        float thickness = param_6;
        if ((sampledDepth >= 0.999998986721038818359375) || (intensity < 9.9999997473787516355514526367188e-05))
        {
            oOutDepth = 65504.0;
            oOutRGBA = float4(1.0);
            return;
        }
        float2 param_7 = sampleUVDepth;
        int param_8 = normalSource;
        float3 vnormal = FetchNormal(param_7, param_8, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view, u_maintex_texel_size);
        float3 vdir = float3(0.0) - normalize(vpos.xyz);
        float vdirXYDot = dot(vdir.xy, vdir.xy);
        float radiusToScreen = radius * u_ao_half_proj_scale;
        float screenRadius = fast::max(fast::min((-radiusToScreen) / vpos.z, 512.0), stepCount + 0.0);
        float twoOverSquaredRadius = 2.0 / (radius * radius);
        float stepRadius = screenRadius / (stepCount + 1.0);
        float2 param_9 = screenPos;
        float2 param_10 = u_maintex_texel_size.zw;
        float param_11;
        float param_12;
        GetSpatialDirections_Offsets_JimenezNoise(param_9, param_10, param_11, param_12);
        float noiseSpatialOffsets = param_11;
        float noiseSpatialDirections = param_12;
        float initialRayStep = fract(noiseSpatialOffsets);
        float piOverDirectionCount = 3.1415927410125732421875 / (0.0 + directionCount);
        float noiseSpatialDirections_x_piOver_directionCount = noiseSpatialDirections * piOverDirectionCount;
        float occlusionAcc = 0.0;
        float angle = (0.0 * piOverDirectionCount) + noiseSpatialDirections_x_piOver_directionCount;
        float2 cos_sin = float2(cos(angle), sin(angle));
        float3 sliceDir = float3(cos_sin, 0.0);
        float wallDarkeningCorrection = dot(vnormal, cross(vdir, sliceDir)) * vdirXYDot;
        wallDarkeningCorrection *= wallDarkeningCorrection;
        float2 slideDir_x_texelSize = sliceDir.xy * u_maintex_texel_size.xy;
        float param_13 = stepCount;
        float2 param_14 = screenPos;
        float2 param_15 = slideDir_x_texelSize;
        float param_16 = stepRadius;
        float param_17 = initialRayStep;
        float param_18 = twoOverSquaredRadius;
        float param_19 = thickness;
        float3 param_20 = vpos.xyz;
        float3 param_21 = vdir;
        float2 h = SampleSteps(param_13, param_14, param_15, param_16, param_17, param_18, param_19, param_20, param_21, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view);
        float3 normalSlicePlane = normalize(cross(sliceDir, vdir));
        float3 tangent = cross(vdir, normalSlicePlane);
        float3 normalProjected = vnormal - (normalSlicePlane * dot(vnormal, normalSlicePlane));
        float projLength = length(normalProjected) + 9.9999997473787516355514526367188e-05;
        float cos_gamma = fast::clamp(dot(normalProjected, vdir) / projLength, -1.0, 1.0);
        float gamma = (-sign(dot(normalProjected, tangent))) * acos(cos_gamma);
        h = acos(fast::clamp(h, float2(-1.0), float2(1.0)));
        h.x = gamma + fast::max((-h.x) - gamma, -1.57079637050628662109375);
        h.y = gamma + fast::min(h.y - gamma, 1.57079637050628662109375);
        float sin_gamma = sin(gamma);
        float2 h2 = h * 2.0;
        float2 innerIntegral = ((-cos(h2 - float2(gamma))) + float2(cos_gamma)) + (h2 * sin_gamma);
        occlusionAcc += (((projLength + wallDarkeningCorrection) * 0.25) * ((innerIntegral.x + innerIntegral.y) + u_ao_bias));
        float angle_1 = (1.0 * piOverDirectionCount) + noiseSpatialDirections_x_piOver_directionCount;
        float2 cos_sin_1 = float2(cos(angle_1), sin(angle_1));
        float3 sliceDir_1 = float3(cos_sin_1, 0.0);
        float wallDarkeningCorrection_1 = dot(vnormal, cross(vdir, sliceDir_1)) * vdirXYDot;
        wallDarkeningCorrection_1 *= wallDarkeningCorrection_1;
        float2 slideDir_x_texelSize_1 = sliceDir_1.xy * u_maintex_texel_size.xy;
        float param_22 = stepCount;
        float2 param_23 = screenPos;
        float2 param_24 = slideDir_x_texelSize_1;
        float param_25 = stepRadius;
        float param_26 = initialRayStep;
        float param_27 = twoOverSquaredRadius;
        float param_28 = thickness;
        float3 param_29 = vpos.xyz;
        float3 param_30 = vdir;
        float2 h_1 = SampleSteps(param_22, param_23, param_24, param_25, param_26, param_27, param_28, param_29, param_30, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view);
        float3 normalSlicePlane_1 = normalize(cross(sliceDir_1, vdir));
        float3 tangent_1 = cross(vdir, normalSlicePlane_1);
        float3 normalProjected_1 = vnormal - (normalSlicePlane_1 * dot(vnormal, normalSlicePlane_1));
        float projLength_1 = length(normalProjected_1) + 9.9999997473787516355514526367188e-05;
        float cos_gamma_1 = fast::clamp(dot(normalProjected_1, vdir) / projLength_1, -1.0, 1.0);
        float gamma_1 = (-sign(dot(normalProjected_1, tangent_1))) * acos(cos_gamma_1);
        h_1 = acos(fast::clamp(h_1, float2(-1.0), float2(1.0)));
        h_1.x = gamma_1 + fast::max((-h_1.x) - gamma_1, -1.57079637050628662109375);
        h_1.y = gamma_1 + fast::min(h_1.y - gamma_1, 1.57079637050628662109375);
        float sin_gamma_1 = sin(gamma_1);
        float2 h2_1 = h_1 * 2.0;
        float2 innerIntegral_1 = ((-cos(h2_1 - float2(gamma_1))) + float2(cos_gamma_1)) + (h2_1 * sin_gamma_1);
        occlusionAcc += (((projLength_1 + wallDarkeningCorrection_1) * 0.25) * ((innerIntegral_1.x + innerIntegral_1.y) + u_ao_bias));
        float angle_2 = (2.0 * piOverDirectionCount) + noiseSpatialDirections_x_piOver_directionCount;
        float2 cos_sin_2 = float2(cos(angle_2), sin(angle_2));
        float3 sliceDir_2 = float3(cos_sin_2, 0.0);
        float wallDarkeningCorrection_2 = dot(vnormal, cross(vdir, sliceDir_2)) * vdirXYDot;
        wallDarkeningCorrection_2 *= wallDarkeningCorrection_2;
        float2 slideDir_x_texelSize_2 = sliceDir_2.xy * u_maintex_texel_size.xy;
        float param_31 = stepCount;
        float2 param_32 = screenPos;
        float2 param_33 = slideDir_x_texelSize_2;
        float param_34 = stepRadius;
        float param_35 = initialRayStep;
        float param_36 = twoOverSquaredRadius;
        float param_37 = thickness;
        float3 param_38 = vpos.xyz;
        float3 param_39 = vdir;
        float2 h_2 = SampleSteps(param_31, param_32, param_33, param_34, param_35, param_36, param_37, param_38, param_39, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view);
        float3 normalSlicePlane_2 = normalize(cross(sliceDir_2, vdir));
        float3 tangent_2 = cross(vdir, normalSlicePlane_2);
        float3 normalProjected_2 = vnormal - (normalSlicePlane_2 * dot(vnormal, normalSlicePlane_2));
        float projLength_2 = length(normalProjected_2) + 9.9999997473787516355514526367188e-05;
        float cos_gamma_2 = fast::clamp(dot(normalProjected_2, vdir) / projLength_2, -1.0, 1.0);
        float gamma_2 = (-sign(dot(normalProjected_2, tangent_2))) * acos(cos_gamma_2);
        h_2 = acos(fast::clamp(h_2, float2(-1.0), float2(1.0)));
        h_2.x = gamma_2 + fast::max((-h_2.x) - gamma_2, -1.57079637050628662109375);
        h_2.y = gamma_2 + fast::min(h_2.y - gamma_2, 1.57079637050628662109375);
        float sin_gamma_2 = sin(gamma_2);
        float2 h2_2 = h_2 * 2.0;
        float2 innerIntegral_2 = ((-cos(h2_2 - float2(gamma_2))) + float2(cos_gamma_2)) + (h2_2 * sin_gamma_2);
        occlusionAcc += (((projLength_2 + wallDarkeningCorrection_2) * 0.25) * ((innerIntegral_2.x + innerIntegral_2.y) + u_ao_bias));
        occlusionAcc /= 3.0;
        float outAO = fast::clamp(occlusionAcc, 0.0, 1.0);
        oOutRGBA = float4(float3(1.0), outAO);
        float param_40 = sampledDepth;
        oOutDepth = linear01Depth(param_40, u_ProjectionParams) / u_one_over_depthscale;
    }

    static inline __attribute__((always_inline))
    float4 GTAO(thread const float2& uv, thread const bool& useDynamicDepthMips, thread const float& directionCount, thread const float& sampleCount, thread const int& normalSource, thread float4 u_ProjectionParams, thread texture2d<float> u_depth_tex, thread const sampler u_depth_texSmplr, thread float4 u_uv2view, thread float2 u_ao_fade_params, thread float4 u_ao_levels, thread float u_ao_radius, thread float u_ao_thickness, thread float4 u_ao_fade_values, thread float4 u_maintex_texel_size, thread float u_ao_half_proj_scale, thread float u_ao_bias, thread float u_one_over_depthscale)
    {
        float2 param = uv;
        bool param_1 = useDynamicDepthMips;
        float param_2 = directionCount;
        float param_3 = sampleCount / 2.0;
        int param_4 = normalSource;
        float param_5;
        float4 param_6;
        GetGTAO(param, param_1, param_2, param_3, param_4, param_5, param_6, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view, u_ao_fade_params, u_ao_levels, u_ao_radius, u_ao_thickness, u_ao_fade_values, u_maintex_texel_size, u_ao_half_proj_scale, u_ao_bias, u_one_over_depthscale);
        float outDepth = param_5;
        float4 outRGBA = param_6;
        return float4(outRGBA.w, outDepth, 0.0, 0.0);
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant int& u_perpixel_normal [[buffer(11)]], constant float4& u_ProjectionParams [[buffer(0)]], constant float4& u_uv2view [[buffer(1)]], constant float2& u_ao_fade_params [[buffer(2)]], constant float4& u_ao_levels [[buffer(3)]], constant float& u_ao_radius [[buffer(4)]], constant float& u_ao_thickness [[buffer(5)]], constant float4& u_ao_fade_values [[buffer(6)]], constant float4& u_maintex_texel_size [[buffer(7)]], constant float& u_ao_half_proj_scale [[buffer(8)]], constant float& u_ao_bias [[buffer(9)]], constant float& u_one_over_depthscale [[buffer(10)]], texture2d<float> u_depth_tex [[texture(0)]], sampler u_depth_texSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 param = in.v_uv;
        bool param_1 = false;
        float param_2 = 3.0;
        float param_3 = 8.0;
        int param_4 = u_perpixel_normal;
        float4 color = GTAO(param, param_1, param_2, param_3, param_4, u_ProjectionParams, u_depth_tex, u_depth_texSmplr, u_uv2view, u_ao_fade_params, u_ao_levels, u_ao_radius, u_ao_thickness, u_ao_fade_values, u_maintex_texel_size, u_ao_half_proj_scale, u_ao_bias, u_one_over_depthscale);
        out.o_fragColor = float4(color.xy, 0.0, 0.0);
        return out;
    }
    `;

    const kSSAOPostEffectMetalFS = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 o_fragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 v_uv;
    };

    static inline __attribute__((always_inline))
    float ComputeDistanceFade(thread const float& _distance, thread float2 u_ao_fade_params)
    {
        return fast::clamp(fast::max(0.0, _distance - u_ao_fade_params.x) * u_ao_fade_params.y, 0.0, 1.0);
    }

    static inline __attribute__((always_inline))
    float4 CalcOcclusion(thread const float& iOcclusion, thread const float& linearDepth, thread float2 u_ao_fade_params, thread float u_ao_power_exponent, thread float4 u_ao_fade_values, thread float4 u_ao_levels, thread float4 u_ao_fade_tint)
    {
        float param = linearDepth;
        float distanceFade = ComputeDistanceFade(param, u_ao_fade_params);
        float exponent = mix(u_ao_power_exponent, u_ao_fade_values.z, distanceFade);
        float occlusion = pow(fast::max(iOcclusion, 0.0), exponent);
        float3 tintedOcclusion = mix(u_ao_levels.xyz, u_ao_fade_tint.xyz, float3(distanceFade));
        tintedOcclusion = mix(tintedOcclusion, float3(1.0), float3(occlusion));
        float intensity = mix(u_ao_levels.w, u_ao_fade_values.x, distanceFade);
        return mix(float4(1.0), float4(tintedOcclusion, occlusion), float4(intensity));
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float2& u_ao_fade_params [[buffer(0)]], constant float& u_ao_power_exponent [[buffer(1)]], constant float4& u_ao_fade_values [[buffer(2)]], constant float4& u_ao_levels [[buffer(3)]], constant float4& u_ao_fade_tint [[buffer(4)]], constant float& u_one_over_depthscale [[buffer(5)]], constant float4& u_ProjectionParams [[buffer(6)]], texture2d<float> u_ssao_tex [[texture(0)]], texture2d<float> _MainTex [[texture(1)]], sampler u_ssao_texSmplr [[sampler(0)]], sampler _MainTexSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float4 ssao = u_ssao_tex.sample(u_ssao_texSmplr, in.v_uv);
        float4 target = _MainTex.sample(_MainTexSmplr, in.v_uv);
        float linearEyeDepth = (ssao.y * u_one_over_depthscale) * u_ProjectionParams.z;
        float param = ssao.x;
        float param_1 = linearEyeDepth;
        float4 occlusionRGBA = CalcOcclusion(param, param_1, u_ao_fade_params, u_ao_power_exponent, u_ao_fade_values, u_ao_levels, u_ao_fade_tint);
        out.o_fragColor = float4(float3((occlusionRGBA * target).xyz), target.w);
        return out;
    }
    `;

//  Blur
const kSSAOBlur1xMetal = `
    #pragma clang diagnostic ignored "-Wmissing-prototypes"

    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 o_fragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 v_uv;
    };

    static inline __attribute__((always_inline))
    float2 FetchOcclusionDepth(thread const float2& uv, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr)
    {
        float4 ssao = _MainTex.sample(_MainTexSmplr, uv);
        return ssao.xy;
    }

    static inline __attribute__((always_inline))
    float ComputeSharpness(thread const float& linearEyeDepth, thread float u_ao_blur_sharpness)
    {
        return u_ao_blur_sharpness * (fast::clamp(1.0 - linearEyeDepth, 0.0, 1.0) + 0.00999999977648258209228515625);
    }

    static inline __attribute__((always_inline))
    float ComputeFalloff(thread const float& radius)
    {
        return 2.0 / (radius * radius);
    }

    static inline __attribute__((always_inline))
    float4 CrossBilateralWeight(thread const float4& r, thread const float4& d, thread const float& d0, thread const float& sharpness, thread const float& falloff)
    {
        float4 diff = (float4(d0) - d) * sharpness;
        return exp2(((-(r * r)) * falloff) - (diff * diff));
    }

    static inline __attribute__((always_inline))
    float4 blur1D_4x(thread const float2& uv, thread const float2& deltaUV, thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr, thread float u_ao_blur_sharpness, thread float2& v_uv, thread float u_one_over_depthscale, thread float4 u_ProjectionParams)
    {
        float2 param = v_uv;
        float2 occlusionDepth = FetchOcclusionDepth(param, _MainTex, _MainTexSmplr);
        float occlusion = occlusionDepth.x;
        float depth = occlusionDepth.y;
        float2 offset1 = deltaUV * 1.10000002384185791015625;
        float2 offset2 = deltaUV * 2.2000000476837158203125;
        float2 offset3 = deltaUV * 3.2999999523162841796875;
        float2 offset4 = deltaUV * 4.5;
        float2 param_1 = v_uv - offset4;
        float2 _124 = FetchOcclusionDepth(param_1, _MainTex, _MainTexSmplr);
        float4 s4;
        s4 = float4(s4.x, s4.y, _124.x, _124.y);
        float2 param_2 = v_uv - offset3;
        float2 _132 = FetchOcclusionDepth(param_2, _MainTex, _MainTexSmplr);
        float4 s3;
        s3 = float4(s3.x, s3.y, _132.x, _132.y);
        float2 param_3 = v_uv - offset2;
        float2 _140 = FetchOcclusionDepth(param_3, _MainTex, _MainTexSmplr);
        float4 s2;
        s2 = float4(s2.x, s2.y, _140.x, _140.y);
        float2 param_4 = v_uv - offset1;
        float2 _148 = FetchOcclusionDepth(param_4, _MainTex, _MainTexSmplr);
        float4 s1;
        s1 = float4(s1.x, s1.y, _148.x, _148.y);
        float2 param_5 = v_uv + offset1;
        float2 _155 = FetchOcclusionDepth(param_5, _MainTex, _MainTexSmplr);
        s1 = float4(_155.x, _155.y, s1.z, s1.w);
        float2 param_6 = v_uv + offset2;
        float2 _162 = FetchOcclusionDepth(param_6, _MainTex, _MainTexSmplr);
        s2 = float4(_162.x, _162.y, s2.z, s2.w);
        float2 param_7 = v_uv + offset3;
        float2 _169 = FetchOcclusionDepth(param_7, _MainTex, _MainTexSmplr);
        s3 = float4(_169.x, _169.y, s3.z, s3.w);
        float2 param_8 = v_uv + offset4;
        float2 _176 = FetchOcclusionDepth(param_8, _MainTex, _MainTexSmplr);
        s4 = float4(_176.x, _176.y, s4.z, s4.w);
        float linearEyeDepth = (occlusionDepth.y * u_one_over_depthscale) * u_ProjectionParams.z;
        float param_9 = linearEyeDepth;
        float sharpness = ComputeSharpness(param_9, u_ao_blur_sharpness);
        float param_10 = 8.0;
        float falloff = ComputeFalloff(param_10);
        float4 param_11 = float4(1.0, 1.0, 2.0, 2.0);
        float4 param_12 = float4(s1.yw, s2.yw);
        float param_13 = depth;
        float param_14 = sharpness;
        float param_15 = falloff;
        float4 w12 = CrossBilateralWeight(param_11, param_12, param_13, param_14, param_15);
        float4 param_16 = float4(3.0, 3.0, 4.0, 4.0);
        float4 param_17 = float4(s3.yw, s4.yw);
        float param_18 = depth;
        float param_19 = sharpness;
        float param_20 = falloff;
        float4 w34 = CrossBilateralWeight(param_16, param_17, param_18, param_19, param_20);
        float ao = (occlusion + dot(float4(s1.xz, s2.xz), w12)) + dot(float4(s3.xz, s4.xz), w34);
        ao /= ((1.0 + dot(float4(1.0), w12)) + dot(float4(1.0), w34));
        return float4(ao, depth, 0.0, 0.0);
    }

    fragment main0_out main0(main0_in in [[stage_in]], constant float& u_ao_blur_sharpness [[buffer(0)]], constant float& u_one_over_depthscale [[buffer(1)]], constant float4& u_ProjectionParams [[buffer(2)]], constant float2& u_ao_blur_deltauv [[buffer(3)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 param = in.v_uv;
        float2 param_1 = u_ao_blur_deltauv;
        out.o_fragColor = blur1D_4x(param, param_1, _MainTex, _MainTexSmplr, u_ao_blur_sharpness, in.v_uv, u_one_over_depthscale, u_ProjectionParams);
        return out;
    }
    `;

exports.kSSAOMetalVS = kSSAOMetalVS
exports.kSSAOMetalFS = kSSAOMetalFS
exports.kSSAOPostEffectMetalFS = kSSAOPostEffectMetalFS
exports.kSSAOBlur1xMetal = kSSAOBlur1xMetal