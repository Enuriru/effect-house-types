const KIRA_COMMON_METAL_VS=
`#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_KiraSizeScale;
};

struct main0_out
{
    float2 uv;
    float v_NoiseData;
    float v_NoiseData2;
    float4 gl_Position [[position]];
    float gl_PointSize [[point_size]];
};

struct main0_in
{
    float3 inPosition [[attribute(0)]];
};

static inline __attribute__((always_inline))
float remapValue(thread const float& inputValue, thread const float& inputMin, thread const float& inputMax, thread const float& outputMin, thread const float& outputMax)
{
    return ((inputValue / (inputMax - inputMin)) * (outputMax - outputMin)) + outputMin;
}

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_KiraTex [[texture(0)]], texture2d<float> u_NoiseTex [[texture(1)]], texture2d<float> u_MaskTex [[texture(2)]], sampler u_KiraTexSmplr [[sampler(0)]], sampler u_NoiseTexSmplr [[sampler(1)]], sampler u_MaskTexSmplr [[sampler(2)]])
{
    main0_out out = {};
    float2 uv0 = in.inPosition.xy;
    float2 uv1 = in.inPosition.xy + float2(0.0078125, 0.0);
    float4 pixel0 = u_KiraTex.sample(u_KiraTexSmplr, uv0, level(0.0));
    float4 pixel1 = u_KiraTex.sample(u_KiraTexSmplr, uv1, level(0.0));
    float2 pos = float2(pixel0.x + (pixel0.y / 255.0), pixel0.z + (pixel0.w / 255.0));
    float flag = pixel1.z;
    out.gl_Position = float4((pos - float2(0.5)) * 2.0, 0.0, 1.0);
    float4 noiseData = u_NoiseTex.sample(u_NoiseTexSmplr, uv0, level(0.0));
    float param = noiseData.x;
    float param_1 = 0.0;
    float param_2 = 1.0;
    float param_3 = 0.100000001490116119384765625;
    float param_4 = 3.599999904632568359375;
    float spriteSizeRandom = remapValue(param, param_1, param_2, param_3, param_4);
    float mask = 1.0;
  #ifdef AE_USE_MASK
    mask = 1.0 - u_MaskTex.sample(u_MaskTexSmplr, pos, level(0.0)).x;
  #endif
    out.gl_PointSize = (((in.inPosition.z * buffer.u_KiraSizeScale) * spriteSizeRandom) * flag) * mask;
    out.v_NoiseData = noiseData.z;
    out.v_NoiseData2 = noiseData.x;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}
`;

const KIRA_SPRITE_METAL_FS=
`#pragma clang diagnostic ignored "-Wmissing-prototypes"
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

struct buffer_t
{
int u_KiraPatternCount;
float4 u_ColorOne;
float4 u_ColorTwo;
float u_KiraBrightness;
float u_KiraOpacity;
};

struct main0_out
{
float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
float v_NoiseData;
float v_NoiseData2;
};

static inline __attribute__((always_inline))
int remapIndex(thread const float& inputValue, thread const int& indexCount)
{
return int(floor((inputValue * float(indexCount)) * 0.89999997615814208984375));
}

static inline __attribute__((always_inline))
float3 rgb2hsv(thread const float3& c)
{
float4 K = float4(0.0, -0.3333333432674407958984375, 0.666666686534881591796875, -1.0);
float4 p = mix(float4(c.zy, K.wz), float4(c.yz, K.xy), float4(step(c.z, c.y)));
float4 q = mix(float4(p.xyw, c.x), float4(c.x, p.yzx), float4(step(p.x, c.x)));
float d = q.x - fast::min(q.w, q.y);
float e = 1.0000000133514319600180897396058e-10;
return float3(abs(q.z + ((q.w - q.y) / ((6.0 * d) + e))), d / (q.x + e), q.x);
}

static inline __attribute__((always_inline))
float3 hsv2rgb(thread const float3& color)
{
float h = color.x;
float s = color.y;
float v = color.z;
float c = v * s;
float m = v - c;
float H = h * 6.0;
float c1 = (1.0 - fast::clamp(H - 1.0, 0.0, 1.0)) + fast::clamp(H - 4.0, 0.0, 1.0);
float c2 = fast::clamp(H, 0.0, 1.0) - fast::clamp(H - 3.0, 0.0, 1.0);
float c3 = fast::clamp(H - 2.0, 0.0, 1.0) - fast::clamp(H - 5.0, 0.0, 1.0);
return float3(c1 * c, c2 * c, c3 * c) + float3(m);
}

static inline __attribute__((always_inline))
float3 hueChange(thread const float3& color, thread const float3& targetColor, thread const float3& targetColor2, thread const float& _noise)
{
float3 param = color;
float3 hsvValue = rgb2hsv(param);
float3 param_1 = mix(targetColor, targetColor2, float3(step(0.5, _noise)));
float3 targetHue = rgb2hsv(param_1);
hsvValue.x = fract(hsvValue.x + targetHue.x);
hsvValue.y = targetHue.y;
float3 param_2 = hsvValue;
return hsv2rgb(param_2);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_KiraPattern0 [[texture(0)]], texture2d<float> u_KiraPattern1 [[texture(1)]], texture2d<float> u_KiraPattern2 [[texture(2)]], sampler u_KiraPattern0Smplr [[sampler(0)]], sampler u_KiraPattern1Smplr [[sampler(1)]], sampler u_KiraPattern2Smplr [[sampler(2)]], float2 gl_PointCoord [[point_coord]])
{
main0_out out = {};
#ifdef AE_USE_PATTERN
spvUnsafeArray<float4, 3> pats;
pats[0] = u_KiraPattern0.sample(u_KiraPattern0Smplr, gl_PointCoord);
pats[1] = u_KiraPattern1.sample(u_KiraPattern1Smplr, gl_PointCoord);
pats[2] = u_KiraPattern2.sample(u_KiraPattern2Smplr, gl_PointCoord);
float param = in.v_NoiseData;
int param_1 = buffer.u_KiraPatternCount;
int patIdx = remapIndex(param, param_1);
float4 patColor = pats[patIdx];
float3 _279 = patColor.xyz * patColor.w;
patColor = float4(_279.x, _279.y, _279.z, patColor.w);
float3 param_2 = patColor.xyz;
float3 param_3 = buffer.u_ColorOne.xyz;
float3 param_4 = buffer.u_ColorTwo.xyz;
float param_5 = in.v_NoiseData2;
float3 hueShiftColor = hueChange(param_2, param_3, param_4, param_5);
float3 rgbColor = mix(patColor.xyz, hueShiftColor, float3(0.800000011920928955078125));
float4 finalColor = (float4(rgbColor, patColor.w) * (1.0 + (buffer.u_KiraBrightness * 1.5))) * buffer.u_KiraOpacity;
#else
float4 finalColor = float4(0.0);
#endif
out.gl_FragColor = finalColor;
return out;
}
`;

exports.KIRA_COMMON_METAL_VS = KIRA_COMMON_METAL_VS
exports.KIRA_SPRITE_METAL_FS = KIRA_SPRITE_METAL_FS