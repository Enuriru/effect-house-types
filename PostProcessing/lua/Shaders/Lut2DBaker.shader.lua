klut2DBakerVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 v_uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    v_uv = inTexCoord;
}
]]

klut2DBakerFS = [[
#version 300 es
precision highp float;   
precision highp sampler2D; 
in vec2 v_uv;   
layout(location = 0) out vec4 o_fragColor;

uniform vec4  u_lut_params;
uniform vec3  u_color_balance;
uniform vec4  u_color_filter;
uniform vec3  u_hue_sat_con;
uniform float u_brightness;
uniform vec3  u_channel_mixer_red;
uniform vec3  u_channel_mixer_green;
uniform vec3  u_channel_mixer_blue;
uniform vec3  u_lift;
uniform vec3  u_inv_gamma;
uniform vec3  u_gain;

uniform sampler2D _MainTex;
uniform sampler2D u_curves;

#define EPSILON  1.0e-4
#define FLT_MAX  3.402823466e+38

//
//White balance
//Recommended workspace: ACEScg (Linear)
//
mat3 LIN_2_LMS_MAT = mat3(
    3.90405e-1, 5.49941e-1, 8.92632e-3,
    7.08416e-2, 9.63172e-1, 1.35775e-3,
    2.31082e-2, 1.28021e-1, 9.36245e-1
);

mat3 LMS_2_LIN_MAT = mat3(
    2.85847e+0, -1.62879e+0, -2.48910e-2,
    -2.10182e-1, 1.15820e+0, 3.24281e-4,
    -4.18120e-2, -1.18169e-1, 1.06867e+0
);

float Luminance(vec3 linearRgb)
{
    return dot(linearRgb, vec3(0.2126729, 0.7151522, 0.0721750));
}

vec3 GetLutStripValue(vec2 uv, vec4 params)
{
    uv -= params.yz;
    vec3 color;
    color.r = fract(uv.x * params.x);
    color.b = uv.x - color.r / params.x;
    color.g = uv.y;
    return color * params.w;
}

vec3 Contrast(vec3 c, float midpoint, float contrast)
{
    return (c - midpoint) * contrast + midpoint;
}

vec3 WhiteBalance(vec3 c, vec3 balance)
{
    vec3 lms = transpose(LIN_2_LMS_MAT) * c;
    lms *= balance;
    return transpose(LMS_2_LIN_MAT) * lms;
}

vec3 ChannelMixer(vec3 c, vec3 red, vec3 green, vec3 blue)
{
    return vec3(dot(c, red), dot(c, green), dot(c, blue));
}

vec3 RgbToHsv(vec3 c)
{
    vec4 k = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, k.wz), vec4(c.gb, k.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = EPSILON;
    return vec3(abs(q.z + (q.w - q.y) /(6.0 * d + e)), d/(q.x + e), q.x);
}

vec3 HsvToRgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p-K.xxx, vec3(0.0), vec3(1.0)), c.y);
}

float RotateHue(float value, float low, float hi)
{
    return (value < low) ? value + hi  : ( (value > hi)? value -hi :  value);
}

vec3 Saturation(vec3 c, float sat)
{
    float luma = Luminance(c);
    return vec3(luma) + vec3(sat) * (c - vec3(luma));
}

vec3 FastSign(vec3 x)
{
    return clamp(x * FLT_MAX + 0.5, vec3(0.0), vec3(1.0)) * 2.0 - 1.0;
}

vec3 LiftGammaGainHDR(vec3 c, vec3 lift, vec3 invgamma, vec3 gain)
{
    c = c * gain + lift;
    return FastSign(c) * pow(abs(c), invgamma);
}

vec3 ApplyCommonGradingSteps(vec3 colorLinear)
{
    colorLinear = WhiteBalance(colorLinear, u_color_balance);
    vec3 colorFilter = u_color_filter.xyz;
    colorLinear *= colorFilter;
    colorLinear = ChannelMixer(colorLinear, u_channel_mixer_red, u_channel_mixer_green, u_channel_mixer_blue);
    colorLinear = LiftGammaGainHDR(colorLinear, u_lift, u_inv_gamma, u_gain);

    // Do Not feed negative values to RgbToHsv or they'll wrap around
    colorLinear = max(vec3(0.0), colorLinear);

    vec3 hsv = RgbToHsv(colorLinear);

    float satMult = 1.0;
    //Hue Vs Sat
    satMult = clamp(texture(u_curves, vec2(hsv.x, 0.25)).y, 0.0, 1.0) * 2.0;

    //Sat Vs Sat
    satMult *= clamp(texture(u_curves, vec2(hsv.y, 0.25)).z, 0.0, 1.0) * 2.0;

    //Lum Vs Sat
    satMult *= clamp(texture(u_curves, vec2(Luminance(colorLinear), 0.25)).w, 0.0, 1.0) * 2.0;

    //Hue Vs Hue
    float hue = hsv.x + u_hue_sat_con.x;
    float offset = clamp(texture(u_curves, vec2(hue, 0.25)).x, 0.0, 1.0) - 0.5;
    hue += offset;
    hsv.x = RotateHue(hue, 0.0, 1.0);
    colorLinear = HsvToRgb(hsv);
    colorLinear = Saturation(colorLinear, u_hue_sat_con.y * satMult);

    return colorLinear;
}

//
//Remaps Y/R/G/B values
//curveTex has to be 128 pixels wide
//
vec3 YrgbCurve(vec3 c)
{
    const float kHalfPixel = (1.0/128.0)/2.0;

    // Y (master)
    c += vec3(kHalfPixel);
    float mr = texture(u_curves, vec2(c.r, 0.75)).a;
    float mg = texture(u_curves, vec2(c.g, 0.75)).a;
    float mb = texture(u_curves, vec2(c.b, 0.75)).a;
    c = clamp(vec3(mr, mg, mb), vec3(0.0), vec3(1.0));

    //RGB
    c += vec3(kHalfPixel);
    float r = texture(u_curves, vec2(c.r, 0.75)).r;
    float g = texture(u_curves, vec2(c.g, 0.75)).g;
    float b = texture(u_curves, vec2(c.b, 0.75)).b;
    return clamp(vec3(r, g, b), vec3(0.0), vec3(1.0));
}

vec3 ColorGradeLDR(vec3 colorLinear)
{
    //Brightness is a simple linear multipier. Works better in LDR than using e.v.
    colorLinear *= u_brightness;

    //Contrast is done in linear, switching to log for that in LDR is pointless and doesn't
    //feel as good to tweak 
    const float kMidGrey = pow(0.5, 2.2);
    colorLinear = Contrast(colorLinear, kMidGrey, u_hue_sat_con.z);

    colorLinear = ApplyCommonGradingSteps(colorLinear);

    // YRGB only works in LDR for now as we don't do any curve range remapping
    //!!!!!!!todo !!!!!!!!!!!!!!
   // colorLinear = YrgbCurve(colorLinear);
    
    return clamp(colorLinear, vec3(0.0), vec3(1.0));
}

void main()
{
    vec3 colorLinear = GetLutStripValue(v_uv, u_lut_params);
    vec3 graded = ColorGradeLDR(colorLinear);
    o_fragColor = vec4(graded, 1.0);
}
]]

klut2DBakerHDRFS = [[
#version 300 es
precision highp float;   
precision highp sampler2D; 
in vec2 v_uv;   
layout(location = 0) out vec4 o_fragColor;

uniform vec4  u_lut_params;
uniform vec3  u_color_balance;
uniform vec4  u_color_filter;
uniform vec3  u_hue_sat_con;
uniform vec3  u_channel_mixer_red;
uniform vec3  u_channel_mixer_green;
uniform vec3  u_channel_mixer_blue;
uniform vec3  u_lift;
uniform vec3  u_inv_gamma;
uniform vec3  u_gain;



uniform vec4 u_CustomToneCurve;
uniform vec4 u_ToeSegmentA;
uniform vec4 u_ToeSegmentB;
uniform vec4 u_MidSegmentA;
uniform vec4 u_MidSegmentB;
uniform vec4 u_ShoSegmentA;
uniform vec4 u_ShoSegmentB;

uniform sampler2D _MainTex;
uniform sampler2D u_curves;

struct ParamsLogC
{
    float cut;
    float a, b, c, d, e, f;
};

#define HALF_MAX  65504.0
#define EPSILON  1.0e-4
#define PI 3.14159265358
#define ACEScc_MIDGRAY 0.4135884
#define FLT_MAX  3.402823466e+38


#define DIM_SURROUND_GAMMA  0.9811

const float RRT_GLOW_GAIN = 0.05;
const float RRT_GLOW_MID = 0.08;
const float RRT_RED_HUE = 0.0;
const float RRT_RED_WIDTH = 135.0;
const float RRT_RED_SCALE = 0.82;
const float RRT_RED_PIVOT = 0.03;
const float RRT_SAT_FACTOR = 0.96;

const float ODT_SAT_FACTOR = 0.93;

const ParamsLogC LogC = ParamsLogC(
    0.011361, //cut
    5.555556, //a
    0.047996, //b
    0.244161, //c
    0.386036, //d
    5.301883, //e
    0.092819  //f
);

//
//White balance
//Recommended workspace: ACEScg (Linear)
//
const mat3 LIN_2_LMS_MAT = mat3(
    3.90405e-1, 5.49941e-1, 8.92632e-3,
    7.08416e-2, 9.63172e-1, 1.35775e-3,
    2.31082e-2, 1.28021e-1, 9.36245e-1
);

const mat3 LMS_2_LIN_MAT = mat3(
    2.85847e+0, -1.62879e+0, -2.48910e-2,
    -2.10182e-1, 1.15820e+0, 3.24281e-4,
    -4.18120e-2, -1.18169e-1, 1.06867e+0
);

const mat3 sRGB_2_AP0 = mat3(
    0.4397010, 0.3829780, 0.1773350,
    0.0897923, 0.8134230, 0.0967616,
    0.0175440, 0.1115440, 0.8707040
);

const mat3 sRGB_2_AP1 = mat3(
    0.61319, 0.33951, 0.04737,
    0.07021, 0.91634, 0.01345,
    0.02062, 0.10957, 0.86961
);

const mat3 AP0_2_sRGB = mat3(
    2.52169, -1.13413, -0.38756,
    -0.27648, 1.37272, -0.09624,
    -0.01538, -0.15298, 1.16835
);

const mat3 AP1_2_sRGB = mat3(
    1.70505, -0.62179, -0.08326,
    -0.13026, 1.14080, -0.01055,
    -0.02400, -0.12897, 1.15297
);

const mat3 AP0_2_AP1_MAT = mat3(
     1.4514393161, -0.2365107469, -0.2149285693,
    -0.0765537734,  1.1762296998, -0.0996759264,
     0.0083161484, -0.0060324498,  0.9977163014
);

const mat3 AP1_2_AP0_MAT = mat3(
     0.6954522414, 0.1406786965, 0.1638690622,
     0.0447945634, 0.8596711185, 0.0955343182,
    -0.0055258826, 0.0040252103, 1.0015006723
);

const mat3 AP1_2_XYZ_MAT = mat3(
     0.6624541811, 0.1340042065, 0.1561876870,
     0.2722287168, 0.6740817658, 0.0536895174,
    -0.0055746495, 0.0040607335, 1.0103391003
);

const mat3 XYZ_2_AP1_MAT = mat3(
     1.6410233797, -0.3248032942, -0.2364246952,
    -0.6636628587,  1.6153315917,  0.0167563477,
     0.0117218943, -0.0082844420,  0.9883948585
);

const mat3 XYZ_2_REC709_MAT = mat3(
     3.2409699419, -1.5373831776, -0.4986107603,
    -0.9692436363,  1.8759675015,  0.0415550574,
     0.0556300797, -0.2039769589,  1.0569715142
);

const mat3 XYZ_2_REC2020_MAT = mat3(
     1.7166511880, -0.3556707838, -0.2533662814,
    -0.6666843518,  1.6164812366,  0.0157685458,
     0.0176398574, -0.0427706133,  0.9421031212
);

const mat3 XYZ_2_DCIP3_MAT = mat3(
     2.7253940305, -1.0180030062, -0.4401631952,
    -0.7951680258,  1.6897320548,  0.0226471906,
     0.0412418914, -0.0876390192,  1.1009293786
);

const vec3 AP1_RGB2Y = vec3(0.272229, 0.674082, 0.0536895);

const mat3 RRT_SAT_MAT = mat3(
    0.9708890, 0.0269633, 0.00214758,
    0.0108892, 0.9869630, 0.00214758,
    0.0108892, 0.0269633, 0.96214800
);

const mat3 ODT_SAT_MAT = mat3(
    0.949056, 0.0471857, 0.00375827,
    0.019056, 0.9771860, 0.00375827,
    0.019056, 0.0471857, 0.93375800
);

const mat3 D60_2_D65_CAT = mat3(
     0.98722400, -0.00611327, 0.0159533,
    -0.00759836,  1.00186000, 0.0053302,
     0.00307257, -0.00509595, 1.0816800
);


float atan2(in float y, in float x)
{
    bool s = (abs(x) > abs(y));
    return mix(PI/2.0 - atan(x,y), atan(y,x), s);
}

vec3 XYZ_2_xyY(vec3 XYZ)
{
    float divisor = max(dot(XYZ, vec3(1.0)), 1e-4);
    return vec3(XYZ.xy / divisor, XYZ.y);
}

vec3 xyY_2_XYZ(vec3 xyY)
{
    float m = xyY.z / max(xyY.y, 1e-4);
    vec3 XYZ = vec3(xyY.xz, (1.0 - xyY.x - xyY.y));
    XYZ.xz *= m;
    return XYZ;
}

vec3 unity_to_ACES(vec3 x)
{
    x = transpose(sRGB_2_AP0) * x;
    return x;
}

vec3 ACES_to_ACEScg(vec3 x)
{
    return transpose(AP0_2_AP1_MAT) * x;
}

vec3 ACES_to_ACEScc(vec3 x)
{
    x = clamp(x, vec3(0.0), vec3(HALF_MAX));
    return (x.x < 0.00003051757 || x.y < 0.00003051757 || x.z < 0.00003051757) ? (log2(0.00001525857 + x * 0.5) + 9.72) / 17.52 : (log2(x) + 9.72) / 17.52;
}

float ACEScc_to_ACES(float x)
{
    if (x < -0.3013698630)
        return (pow(2.0, x * 17.52 - 9.72) - pow(2.0, -16.0)) * 2.0;
    else if (x < (log2(HALF_MAX) + 9.72)/17.52)
        return pow(2.0, x * 17.52 - 9.72);
    else 
        return HALF_MAX;
}

vec3 ACEScc_to_ACES(vec3 x)
{
    return vec3(ACEScc_to_ACES(x.r), ACEScc_to_ACES(x.g), ACEScc_to_ACES(x.b));
}

vec3 ACEScg_to_ACES(vec3 x)
{
    return transpose(AP1_2_AP0_MAT) * x;
}

vec3 LogCToLinear(vec3 x)
{
    return (pow(vec3(10.0), (x - LogC.d)/LogC.c) - LogC.b) /LogC.a;
}

float Luminance(vec3 linearRgb)
{
    return dot(linearRgb, vec3(0.2126729, 0.7151522, 0.0721750));
}

vec3 FastSign(vec3 x)
{
    return clamp(x * FLT_MAX + 0.5, vec3(0.0), vec3(1.0)) * 2.0 - 1.0;
}

float FastSign(float x)
{
    return clamp(x * FLT_MAX + 0.5, 0.0, 1.0) * 2.0 - 1.0;
}

vec3 WhiteBalance(vec3 c, vec3 balance)
{
    vec3 lms = transpose(LIN_2_LMS_MAT) * c;
    lms *= balance;
    return transpose(LMS_2_LIN_MAT) * lms;
}

vec3 ChannelMixer(vec3 c, vec3 red, vec3 green, vec3 blue)
{
    return vec3(dot(c, red), dot(c, green), dot(c, blue));
}

vec3 RgbToHsv(vec3 c)
{
    vec4 k = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, k.wz), vec4(c.gb, k.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = EPSILON;
    return vec3(abs(q.z + (q.w - q.y) /(6.0 * d + e)), d/(q.x + e), q.x);
}

vec3 HsvToRgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p-K.xxx, vec3(0.0), vec3(1.0)), c.y);
}

float RotateHue(float value, float low, float hi)
{
    return (value < low) ? value + hi  : ( (value > hi)? value -hi :  value);
}

vec3 Saturation(vec3 c, float sat)
{
    float luma = Luminance(c);
    return vec3(luma) + vec3(sat) * (c - vec3(luma));
}

vec3 LiftGammaGainHDR(vec3 c, vec3 lift, vec3 invgamma, vec3 gain)
{
    c = c * gain + lift;
    return FastSign(c) * pow(abs(c), invgamma);
}

vec3 Contrast(vec3 c, float midpoint, float contrast)
{
    return (c - midpoint) * contrast + midpoint;
}

vec3 GetLutStripValue(vec2 uv, vec4 params)
{
    uv -= params.yz;
    vec3 color;
    color.r = fract(uv.x * params.x);
    color.b = uv.x - color.r / params.x;
    color.g = uv.y;
    return color * params.w;
}

vec3 LogGradeHDR(vec3 colorLog)
{
    // HDR contrast feels a lot more natural when done in log rather than doing it in linear
    colorLog = Contrast(colorLog, ACEScc_MIDGRAY, u_hue_sat_con.z);
    return colorLog;
}

float rgb_2_saturation(vec3 rgb)
{
    const float TINY = 1e-4;
    float mi = min(min(rgb.r, rgb.g), rgb.b);
    float ma = max(max(rgb.r, rgb.g), rgb.b);
    return (max(ma, TINY) - max(mi, TINY)) / max(ma, 1e-2);
}

float rgb_2_yc(vec3 rgb)
{
    const float ycRadiusWeight = 1.75;

    float r = rgb.x;
    float g = rgb.y;
    float b = rgb.z;
    float chroma = sqrt(b * (b-g) + g * (g-r) + r*(r-b));
    return (b + g + r + ycRadiusWeight * chroma) /3.0;
}

float rgb_2_hue(vec3 rgb)
{
    float hue;
    if(rgb.x == rgb.y && rgb.y == rgb.z)
        hue = 0.0;
    else
        hue = (180.0 / PI) * atan2(sqrt(3.0) * (rgb.y - rgb.z), 2.0 * rgb.x - rgb.y - rgb.z);

    if (hue < 0.0) hue = hue + 360.0;

    return hue;
}

float center_hue(float hue, float centerH)
{
    float hueCentered = hue - centerH;
    if(hueCentered < -180.0) hueCentered = hueCentered + 360.0;
    else if (hueCentered > 180.0) hueCentered = hueCentered - 360.0;
    return hueCentered;
}

float sigmoid_shaper(float x)
{
    float t = max(1.0 - abs(x/2.0), 0.0);
    float y = 1.0 + FastSign(x) * (1.0 - t*t);
    return y / 2.0;
}

float glow_fwd(float ycIn, float glowGainIn, float glowMid)
{
    float glowGainOut;

    if(ycIn <= 2.0 / 3.0 * glowMid)
        glowGainOut = glowGainIn;
    else if(ycIn >= 2.0 * glowMid)
        glowGainOut = 0.0;
    else
        glowGainOut = glowGainIn * (glowMid / ycIn - 1.0 /2.0);
    
    return glowGainOut;
}

vec3 darkSurround_to_dimSurround(vec3 linearCV)
{
    vec3 XYZ = transpose(AP1_2_XYZ_MAT) * linearCV;
    vec3 xyY = XYZ_2_xyY(XYZ);
    xyY.z = clamp(xyY.z, 0.0, HALF_MAX);
    xyY.z = pow(xyY.z, DIM_SURROUND_GAMMA);
    XYZ = xyY_2_XYZ(xyY);

    return transpose(XYZ_2_AP1_MAT) * XYZ;
}

vec3 AcesTonemap(vec3 aces)
{
    // -- Glow module -- //
    float saturation = rgb_2_saturation(aces);
    float ycIn = rgb_2_yc(aces);
    float s = sigmoid_shaper( (saturation - 0.4)/0.2);
    float addedGlow = 1.0 + glow_fwd(ycIn, RRT_GLOW_GAIN * s, RRT_GLOW_MID);
    aces *= addedGlow;

    // -- Red modifier -- //
    float hue = rgb_2_hue(aces);
    float centerdHue = center_hue(hue, RRT_RED_HUE);
    float hueWeight;
    {
        hueWeight = smoothstep(0.0, 1.0, 1.0 - abs(2.0 * centerdHue / RRT_RED_WIDTH));
        hueWeight *= hueWeight;
    }

    aces.r += hueWeight * saturation * (RRT_RED_PIVOT - aces.r) * (1.0 - RRT_RED_SCALE);

    //--- ACES to RGB rendering space --- //
    vec3 acescg = max(vec3(0.0), ACES_to_ACEScg(aces));

    //--- Global desaturation --- //
    acescg = mix(vec3(dot(acescg, AP1_RGB2Y)), acescg, vec3(RRT_SAT_FACTOR));
    
    const float a = 278.5085;
    const float b = 10.7772;
    const float c = 293.6045;
    const float d = 88.7122;
    const float e = 80.6889;
    vec3 x = acescg;
    vec3 rgbPost = (x * (a * x + b)) / ( x * (c * x + d) + e);

    //Apply gamma adjustment to compensate for dim surround
    vec3 linearCV = darkSurround_to_dimSurround(rgbPost);

    //Apply desaturation to compensate for luminance difference
    linearCV = mix(vec3(dot(linearCV, AP1_RGB2Y)), linearCV, vec3(ODT_SAT_FACTOR));

    //Convert to display primary encoding
    //Rendering space RGB to XYZ
    vec3 XYZ = transpose(AP1_2_XYZ_MAT) * linearCV;

    // Apply CAT from ACES White point to assumed observer adapted white point
    XYZ = transpose(D60_2_D65_CAT) * XYZ;

    // CIE XYZ to display primaries
    linearCV = transpose(XYZ_2_REC709_MAT) * XYZ;
    return linearCV;
}

float EvalCustomSegment(float x, vec4 segmentA, vec2 segmentB)
{
     float kOffsetX = segmentA.x;
     float kOffsetY = segmentA.y;
     float kScaleX  = segmentA.z;
     float kScaleY  = segmentA.w;
     float kLnA     = segmentB.x;
     float kB       = segmentB.y;

    float x0 = (x - kOffsetX) * kScaleX;
    float y0 = (x0 > 0.0) ? exp(kLnA + kB * log(x0)) : 0.0;
    return y0 * kScaleY + kOffsetY;
}


float EvalCustomCurve(float x, vec3 curve, vec4 toeSegmentA, vec2 toeSegmentB, vec4 midSegmentA, vec2 midSegmentB, vec4 shoSegmentA, vec2 shoSegmentB)
{
    vec4 segmentA;
    vec2 segmentB;

    if (x < curve.y)
    {
        segmentA = toeSegmentA;
        segmentB = toeSegmentB;
    }
    else if (x < curve.z)
    {
        segmentA = midSegmentA;
        segmentB = midSegmentB;
    }
    else
    {
        segmentA = shoSegmentA;
        segmentB = shoSegmentB;
    }

    return EvalCustomSegment(x, segmentA, segmentB);
}


vec3 CustomTonemap(vec3 x, vec3 curve, vec4 toeSegmentA, vec2 toeSegmentB, vec4 midSegmentA, vec2 midSegmentB, vec4 shoSegmentA, vec2 shoSegmentB)
{
    vec3 normX = x * curve.x;
    vec3 ret;
    ret.x = EvalCustomCurve(normX.x, curve, toeSegmentA, toeSegmentB, midSegmentA, midSegmentB, shoSegmentA, shoSegmentB);
    ret.y = EvalCustomCurve(normX.y, curve, toeSegmentA, toeSegmentB, midSegmentA, midSegmentB, shoSegmentA, shoSegmentB);
    ret.z = EvalCustomCurve(normX.z, curve, toeSegmentA, toeSegmentB, midSegmentA, midSegmentB, shoSegmentA, shoSegmentB);
    return ret;
}

vec3 NeutralCurve(vec3 x, float a, float b, float c, float d, float e, float f)
{
    return ((x * (a * x + c * b) + d * e) / (x * (a * x + b) + d * f)) - e / f;
}

vec3 NeutralTonemap(vec3 x)
{
    // Tonemap
    float a = 0.2;
    float b = 0.29;
    float c = 0.24;
    float d = 0.272;
    float e = 0.02;
    float f = 0.3;
    float whiteLevel = 5.3;
    float whiteClip = 1.0;

    vec3 whiteScale =vec3(1.0,1.0,1.0)/ NeutralCurve(vec3(whiteLevel,whiteLevel,whiteLevel), a, b, c, d, e, f);
    x = NeutralCurve(x * whiteScale, a, b, c, d, e, f);
    x *= whiteScale;

    // Post-curve white point adjustment
    x /=vec3(whiteClip,whiteClip,whiteClip);

    return x;
}
vec3 ApplyCommonGradingSteps(vec3 colorLinear)
{
    colorLinear = WhiteBalance(colorLinear, u_color_balance);
    vec3 colorFilter = u_color_filter.xyz;
    colorLinear *= colorFilter;
    colorLinear = ChannelMixer(colorLinear, u_channel_mixer_red, u_channel_mixer_green, u_channel_mixer_blue);
    colorLinear = LiftGammaGainHDR(colorLinear, u_lift, u_inv_gamma, u_gain);

    // Do Not feed negative values to RgbToHsv or they'll wrap around
    colorLinear = max(vec3(0.0), colorLinear);

    vec3 hsv = RgbToHsv(colorLinear);

    float satMult = 1.0;
    //Hue Vs Sat
    satMult = clamp(texture(u_curves, vec2(hsv.x, 0.25)).y, 0.0, 1.0) * 2.0;

    //Sat Vs Sat
    satMult *= clamp(texture(u_curves, vec2(hsv.y, 0.25)).z, 0.0, 1.0) * 2.0;

    //Lum Vs Sat
    satMult *= clamp(texture(u_curves, vec2(Luminance(colorLinear), 0.25)).w, 0.0, 1.0) * 2.0;

    //Hue Vs Hue
    float hue = hsv.x + u_hue_sat_con.x;
    float offset = clamp(texture(u_curves, vec2(hue, 0.25)).x, 0.0, 1.0) - 0.5;
    hue += offset;
    hsv.x = RotateHue(hue, 0.0, 1.0);
    colorLinear = HsvToRgb(hsv);
    colorLinear = Saturation(colorLinear, u_hue_sat_con.y * satMult);

    return colorLinear;
}

vec3 LinearGradeHDR(vec3 colorLinear)
{
    colorLinear = ApplyCommonGradingSteps(colorLinear);
    return colorLinear;
}

vec3 ColorGradeHDR(vec3 colorLutSpace)
{
    #ifdef TONEMAPPING_ACES
        
        vec3 colorLinear = LogCToLinear(colorLutSpace);
        vec3 aces = unity_to_ACES(colorLinear);

        //ACEScc (log) space
        vec3 acescc = ACES_to_ACEScc(aces);
        acescc = LogGradeHDR(acescc);
        aces = ACEScc_to_ACES(acescc);

        //ACEScg (linear) space
        vec3 acescg = ACES_to_ACEScg(aces);
        acescg = LinearGradeHDR(acescg);

        //Tonemap ODT(RRT(acces))
        aces = ACEScg_to_ACES(acescg);
        colorLinear = AcesTonemap(aces);

        //for test
        //colorLinear = pow(colorLinear,vec3(1.0/2.2,1.0/2.2,1.0/2.2));

        return colorLinear;
        
    #else
        
            
            // colorLutSpace is already in log space
            colorLutSpace = LogGradeHDR(colorLutSpace);

            // Switch back to linear
            vec3 colorLinear = LogCToLinear(colorLutSpace);
            colorLinear = LinearGradeHDR(colorLinear);
            colorLinear = max(vec3(0.0,0.0,0.0), colorLinear);

            // Tonemap
            #ifdef TONEMAPPING_NEUTRAL
            
                colorLinear = NeutralTonemap(colorLinear);
            #endif

            #ifdef  TONEMAPPING_CUSTOM
                
                colorLinear = CustomTonemap(
                    colorLinear, u_CustomToneCurve.xyz,
                    u_ToeSegmentA, u_ToeSegmentB.xy,
                    u_MidSegmentA, u_MidSegmentB.xy,
                    u_ShoSegmentA, u_ShoSegmentB.xy
                );

            #endif
          //  colorLinear = pow(colorLinear,vec3(1.0/2.2,1.0/2.2,1.0/2.2));
            return colorLinear;
            //return vec3(1.0,0.0,1.0);

        
    #endif 
}


void main()
{
    vec3 colorLutSpace = GetLutStripValue(v_uv, u_lut_params);
    vec3 graded = ColorGradeHDR(colorLutSpace);
    o_fragColor = vec4(max(graded, vec3(0.0)), 1.0);
}
]]

Lut2DBakerShader = ScriptableObject(BaseShader)

function Lut2DBakerShader : getMaterial()
    -- if self.material == nil then 
        local material = CreateEmptyMaterial("Lut2DBaker")
        AddPassToMaterial(material, "gles30", klut2DBakerVS, klut2DBakerFS);
        AddPassToMaterial(material, "gles30", klut2DBakerVS, klut2DBakerHDRFS);
        local macrosVector = Amaz.StringVector()
        macrosVector:pushBack("TONEMAPPING_ACES")
        macrosVector:pushBack("TONEMAPPING_NEUTRAL")
        macrosVector:pushBack("TONEMAPPING_CUSTOM")

        MaterialSetMacroVector(material,0,"gles30",macrosVector)
        MaterialSetMacroVector(material,1,"gles30",macrosVector)

        self.material = material
    -- end
    return self.material
end