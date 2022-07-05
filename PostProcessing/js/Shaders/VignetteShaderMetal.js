const kVignetteMetalVS = `
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
        float2 inPosition [[attribute(0)]];
        float2 inTexCoord [[attribute(1)]];
    };
    
    vertex main0_out main0(main0_in in [[stage_in]])
    {
        main0_out out = {};
        out.gl_Position = float4(in.inPosition, 0.0, 1.0);
        out.v_uv = in.inTexCoord;
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    `;

const kVignetteMetalFS = `
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
        float2 v_uv;
    };
    
    static inline __attribute__((always_inline))
    float4 brightnessContrast(thread const float4& value, thread const float& brightness, thread const float& contrast)
    {
        return (((value - float4(0.5)) * contrast) + float4(0.5)) + float4(brightness);
    }
    
    static inline __attribute__((always_inline))
    float4 Vignette(thread const float4& inputImage, thread const float2& uv, thread const float2& resolution, thread const float& falloff, thread const float& contrast)
    {
        float Falloff = falloff;
        float2 coord = ((uv - float2(0.5)) * (resolution.x / resolution.y)) * 2.0;
        float rf = sqrt(dot(coord, coord)) * Falloff;
        float rf2_1 = (rf * rf) + 1.0;
        float e = 1.0 / (rf2_1 * rf2_1);
        float4 src = float4(1.0);
        float4 vignette = float4(src.xyz * e, 1.0);
        float4 param = vignette;
        float param_1 = 0.0;
        float param_2 = contrast;
        float4 adjusted = brightnessContrast(param, param_1, param_2);
        adjusted = fast::clamp(adjusted, float4(0.0), float4(1.0));
        return float4(adjusted) * inputImage;
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float4& u_ScreenParams [[buffer(0)]], constant float& u_power [[buffer(1)]], constant float& u_contrast [[buffer(2)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 v_texcoord = in.v_uv;
        float2 resolution = float2(0.89999997615814208984375, 1.60000002384185791015625);
        if (u_ScreenParams.z > 1.0)
        {
            resolution.x = u_ScreenParams.x;
            resolution.y = u_ScreenParams.y;
        }
        float4 background = _MainTex.sample(_MainTexSmplr, v_texcoord);
        float4 param = background;
        float2 param_1 = v_texcoord;
        float2 param_2 = resolution;
        float param_3 = u_power;
        float param_4 = u_contrast;
        out.gl_FragColor = Vignette(param, param_1, param_2, param_3, param_4);
        return out;
    }
    `;

exports.kVignetteMetalVS = kVignetteMetalVS
exports.kVignetteMetalFS = kVignetteMetalFS