const kGenMaskMetalVS = `
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

const kGenMaskMetalFS = `
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

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> _MainTex [[texture(0)]], sampler _MainTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    out.gl_FragColor = _MainTex.sample(_MainTexSmplr, in.uv);
    return out;
}
`;

const kBlendBackGroudMetalFS = `
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

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> backgroudTexture [[texture(0)]], texture2d<float> _MainTex [[texture(1)]], sampler backgroudTextureSmplr [[sampler(0)]], sampler _MainTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float3 bgColor = backgroudTexture.sample(backgroudTextureSmplr, in.uv).xyz;
    float4 fgColor = _MainTex.sample(_MainTexSmplr, in.uv);
    out.gl_FragColor = float4((bgColor * (1.0 - fgColor.w)) + fgColor.xyz, fgColor.w);
    return out;
}
`;

exports.kGenMaskMetalVS = kGenMaskMetalVS
exports.kGenMaskMetalFS = kGenMaskMetalFS
exports.kBlendBackGroudMetalFS = kBlendBackGroudMetalFS
