const faceMetalVS = `
#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 u_ScreenParams;
    float4x4 u_MVP;
};

struct main0_out
{
    float2 v_UV;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 inPosition [[attribute(0)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 pos = float2((in.inPosition - float3(0.5)).xy) * 2.0;
    out.gl_Position = float4(pos.x, pos.y, 0.0, 1.0);
    float2 screenPos = in.inPosition.xy;
    screenPos.y = 1.0 - screenPos.y;
    screenPos *= buffer.u_ScreenParams;
    out.v_UV = (buffer.u_MVP * float4(screenPos, 0.0, 1.0)).xy;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}
`;

const faceMetalFS = `
#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 v_UV;
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_SegMask [[texture(0)]], sampler u_SegMaskSmplr [[sampler(0)]])
{
    main0_out out = {};
    float weight = u_SegMask.sample(u_SegMaskSmplr, in.v_UV).x;
    float2 _28 = fast::clamp(in.v_UV, float2(0.0), float2(1.0));
    if (any((isunordered(_28, in.v_UV) || _28 != in.v_UV)))
    {
        weight = 0.0;
    }
    out.gl_FragColor = float4(float3(weight), 1.0);
    return out;
}
        `;

exports.faceMetalVS = faceMetalVS;
exports.faceMetalFS = faceMetalFS;