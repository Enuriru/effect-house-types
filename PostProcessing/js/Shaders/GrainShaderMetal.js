const kGrainMetalVS = `
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

    const kGrainMetalFS = `
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
    float NoiseColor(thread const float2& xy, thread const float& seed)
    {
        return fract(tan(distance(xy * 1.61803305149078369140625, xy) * seed) * xy.x);
    }
    
    static inline __attribute__((always_inline))
    float3 BlackAndWhite(thread const float3& inputImage)
    {
        float luminance = ((inputImage.x * 0.2989999949932098388671875) + (inputImage.y * 0.58700001239776611328125)) + (inputImage.z * 0.114000000059604644775390625);
        return float3(luminance);
    }
    
    static inline __attribute__((always_inline))
    float3 soft_light(thread const float3& a, thread const float3& b, thread const float& w)
    {
        return mix(a, pow(a, pow(float3(2.0), (float3(0.5) - b) * 2.0)), float3(w));
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float4& u_Time [[buffer(0)]], constant float& u_speed [[buffer(1)]], constant float& u_color [[buffer(2)]], constant float& u_strength [[buffer(3)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float time = u_Time.y;
        float2 xy = in.v_uv;
        float speed = u_speed * 9.9999999747524270787835121154785e-07;
        float fractional = fract(time) * speed;
        float2 param = xy * 1000.0;
        float param_1 = fractional + 1.0;
        float2 param_2 = xy * 1000.0;
        float param_3 = fractional + 2.0;
        float2 param_4 = xy * 1000.0;
        float param_5 = fractional + 3.0;
        float3 noiseColor = float3(NoiseColor(param, param_1), NoiseColor(param_2, param_3), NoiseColor(param_4, param_5));
        noiseColor = fast::clamp(noiseColor, float3(0.0), float3(1.0));
        float3 param_6 = noiseColor;
        float3 noiseBW = float3(BlackAndWhite(param_6));
        float3 _noise = mix(noiseBW, noiseColor, float3(u_color));
        float3 backgroundImage = _MainTex.sample(_MainTexSmplr, in.v_uv).xyz;
        float3 param_7 = backgroundImage;
        float3 param_8 = _noise;
        float param_9 = u_strength;
        float3 softLightImage = soft_light(param_7, param_8, param_9);
        out.gl_FragColor = float4(softLightImage, 1.0);
        return out;
    }
    `;

exports.kGrainMetalVS = kGrainMetalVS
exports.kGrainMetalFS = kGrainMetalFS
