const full_screen_quad_metal_vert = `
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

    const spectral_lut_baker_metal = `
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

    fragment main0_out main0(main0_in in [[stage_in]])
    {
        main0_out out = {};
        if (in.uv.x < 0.3333333432674407958984375)
        {
            out.gl_FragColor = float4(1.0, 0.0, 0.0, 1.0);
        }
        else
        {
            if (in.uv.x > 0.666666686534881591796875)
            {
                out.gl_FragColor = float4(0.0, 0.0, 1.0, 1.0);
            }
            else
            {
                out.gl_FragColor = float4(0.0, 1.0, 0.0, 1.0);
            }
        }
        return out;
    }
    `;

    const chromatic_aberration_metal = `
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

    fragment main0_out main0(main0_in in [[stage_in]], constant float4& u_FastModeAndIntensityAndRTSize [[buffer(0)]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> u_SpectralLUT [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler u_SpectralLUTSmplr [[sampler(1)]])
    {
        main0_out out = {};
        if (u_FastModeAndIntensityAndRTSize.x < 0.5)
        {
            float2 coords = (in.uv * 2.0) - float2(1.0);
            float2 end = in.uv - ((coords * dot(coords, coords)) * u_FastModeAndIntensityAndRTSize.y);
            float2 diff = end - in.uv;
            float samples = float(int(fast::clamp(length((u_FastModeAndIntensityAndRTSize.zw * diff) * 0.5), 3.0, 16.0)));
            float2 delta = diff / float2(samples);
            float2 pos = in.uv;
            float4 sum = float4(0.0);
            float4 filterSum = float4(0.0);
            for (int i = 0; i < int(samples); i++)
            {
                float t = (float(i) + 0.5) / samples;
                float4 s = _MainTex.sample(_MainTexSmplr, pos);
                float4 filterColor = float4(u_SpectralLUT.sample(u_SpectralLUTSmplr, float2(t, 0.0)).xyz, 1.0);
                sum += (s * filterColor);
                filterSum += filterColor;
                pos += delta;
            }
            out.gl_FragColor = sum / filterSum;
        }
        else
        {
            float2 coords_1 = (in.uv * 2.0) - float2(1.0);
            float2 end_1 = in.uv - ((coords_1 * dot(coords_1, coords_1)) * u_FastModeAndIntensityAndRTSize.y);
            float2 delta_1 = (end_1 - in.uv) / float2(3.0);
            float4 filterA = float4(u_SpectralLUT.sample(u_SpectralLUTSmplr, float2(0.16666667163372039794921875, 0.0)).xyz, 1.0);
            float4 filterB = float4(u_SpectralLUT.sample(u_SpectralLUTSmplr, float2(0.5, 0.0)).xyz, 1.0);
            float4 filterC = float4(u_SpectralLUT.sample(u_SpectralLUTSmplr, float2(0.833333313465118408203125, 0.0)).xyz, 1.0);
            float4 texelA = _MainTex.sample(_MainTexSmplr, in.uv);
            float4 texelB = _MainTex.sample(_MainTexSmplr, (in.uv + delta_1));
            float4 texelC = _MainTex.sample(_MainTexSmplr, ((in.uv + delta_1) + delta_1));
            float4 sum_1 = ((texelA * filterA) + (texelB * filterB)) + (texelC * filterC);
            float4 filterSum_1 = (filterA + filterB) + filterC;
            out.gl_FragColor = sum_1 / filterSum_1;
        }
        return out;
    }
    `;

    const blend_layer_metal = `
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

    fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> _MainTex [[texture(0)]], texture2d<float> _Background [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _BackgroundSmplr [[sampler(1)]])
    {
        main0_out out = {};
        float4 src = _MainTex.sample(_MainTexSmplr, in.uv);
        float4 dst = _Background.sample(_BackgroundSmplr, in.uv);
        out.gl_FragColor = float4(src.xyz + (dst.xyz * (1.0 - src.w)), 1.0);
        return out;
    }
    `;

exports.full_screen_quad_metal_vert = full_screen_quad_metal_vert
exports.spectral_lut_baker_metal = spectral_lut_baker_metal
exports.chromatic_aberration_metal = chromatic_aberration_metal
exports.blend_layer_metal = blend_layer_metal