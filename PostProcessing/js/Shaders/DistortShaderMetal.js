const kDistortMetalVS = `
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

    const kDistortMetalFS = `
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
    
    // Implementation of the GLSL radians() function
    template<typename T>
    inline T radians(T d)
    {
        return d * T(0.01745329251);
    }
    
    static inline __attribute__((always_inline))
    float2 Distort(thread float2& uvs, thread const float2& offset, thread float u_rotation, thread float u_barrelPower)
    {
        uvs -= offset;
        float theta = atan2(uvs.y, uvs.x) + radians(u_rotation);
        float radius = length(uvs);
        radius = pow(radius, u_barrelPower + 1.0);
        uvs.x = (radius * cos(theta)) + offset.x;
        uvs.y = (radius * sin(theta)) + offset.y;
        return (uvs + float2(1.0)) * 0.5;
    }
    
    static inline __attribute__((always_inline))
    float2 Zoom(thread const float2& uvs, thread const float& zoom)
    {
        return ((uvs - float2(0.5)) * (1.0 - zoom)) + float2(0.5);
    }
    
    static inline __attribute__((always_inline))
    float2 Wobble(thread float2& uv, thread const float2& speed, thread const float2& frequency, thread const float2& amplitude, thread float4 u_Time)
    {
        if ((isunordered(amplitude.x, 0.0) || amplitude.x != 0.0))
        {
            uv.x += (sin((uv.y * frequency.x) + (u_Time.y * speed.x)) / (1.0 / amplitude.x));
        }
        if ((isunordered(amplitude.y, 0.0) || amplitude.y != 0.0))
        {
            uv.y += (cos((uv.x * frequency.y) + (u_Time.y * speed.y)) / (1.0 / amplitude.y));
        }
        return uv;
    }
    
    fragment main0_out main0(main0_in in [[stage_in]], constant float& u_rotation [[buffer(0)]], constant float& u_barrelPower [[buffer(1)]], constant float4& u_Time [[buffer(2)]], constant float2& u_offset [[buffer(3)]], constant float& u_zoom [[buffer(4)]], constant float2& u_speed [[buffer(5)]], constant float2& u_frequency [[buffer(6)]], constant float2& u_amplitude [[buffer(7)]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 v_texcoord = in.v_uv;
        float2 inverted = v_texcoord;
        float2 uv = float2(-1.0) + (inverted * 2.0);
        float2 param = uv;
        float2 param_1 = u_offset;
        float2 _163 = Distort(param, param_1, u_rotation, u_barrelPower);
        float2 distortedUV = _163;
        float2 param_2 = distortedUV;
        float param_3 = u_zoom;
        float2 scaledUVs = Zoom(param_2, param_3);
        float2 param_4 = scaledUVs;
        float2 param_5 = u_speed;
        float2 param_6 = u_frequency;
        float2 param_7 = u_amplitude;
        float2 _183 = Wobble(param_4, param_5, param_6, param_7, u_Time);
        float2 wobbleUVs = _183;
        float4 distorted = _MainTex.sample(_MainTexSmplr, wobbleUVs);
        out.gl_FragColor = distorted;
        return out;
    }
    `;
exports.kDistortMetalVS = kDistortMetalVS
exports.kDistortMetalFS = kDistortMetalFS