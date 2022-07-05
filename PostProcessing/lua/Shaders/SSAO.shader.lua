kSSAOVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 v_uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    v_uv = inTexCoord;
}
]]

kSSAOFS = [[
#version 300 es
precision highp float;   
precision highp sampler2D; 
in vec2 v_uv;   
layout(location = 0) out vec4 o_fragColor;
uniform sampler2D u_depth_tex;
uniform sampler2D u_depth_normal_tex;
uniform vec4 u_ProjectionParams;
uniform mat4 u_CameraInvProjection;
uniform mat4 u_View;
uniform vec4 u_maintex_texel_size;
uniform vec4 u_uv2view;
uniform float u_ao_radius;
uniform float u_ao_power_exponent;
uniform vec4 u_ao_levels;
uniform float u_ao_thickness;
uniform float u_one_over_depthscale;
uniform vec2 u_ao_fade_params;
uniform vec4  u_ao_fade_values;
uniform float u_ao_half_proj_scale;
uniform int  u_perpixel_normal;
uniform int u_use_ldepth;
uniform float u_flip_depth;

#define NORMALS_NONE 0
#define NORMALS_CAMERA 1
#define NORMALS_GBUFFER 2
#define NORMALS_GBUFFER_OCTA_ENCODED 3

#define HALF_MAX 65504.0
#define DEPTH_EPSILON 1e-6
#define INTENISTY_THRESHOLD 1e-4

#define PIXEL_RADIUS_LIMIT 512.0
#define PI 3.14159265358
#define HALF_PI 1.57079632679

// linear depth to (0, 1)
float linearDepth(float z)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    return 2.0 * near / (far + near - z * (far - near));
}

// linear depth to (0, f)
float linearEyeDepth(float z)
{
    float far = u_ProjectionParams.z;
    return linearDepth(z) * far;
}

float UnpackDepth( const in vec4 enc ) {
    const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );
    float decoded = dot( enc, bit_shift );
    return decoded;
}

float unLinear01Depth(float ldepth)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    float zc0 = (1.0 - far/near)/2.0;
    float zc1 = (1.0 + far/near)/2.0;

    return (1.0/ldepth - zc1) / zc0;
}

//helper functions
float SampleDepth0(vec2 screenPos)
{
    vec2 uv = screenPos;
    if(u_flip_depth > 0.5)
    {
        uv.y = 1.0 - uv.y;
    }
    
    return texture(u_depth_tex, uv).r;
}

vec4 ConvertDepth(vec2 aUV, float sampledDepth)
{
    float viewDepth = -linearEyeDepth(sampledDepth); 

    return vec4( (aUV* u_uv2view.xy + u_uv2view.zw) * viewDepth, viewDepth, sampledDepth);
}

float ComputeDistanceFade(float distance)
{
    return clamp(max(0.0, distance - u_ao_fade_params.x) * u_ao_fade_params.y, 0.0, 1.0);
}

float JimenezNoise(vec2 xyPixelPos)
{
    return fract(52.9829189 * fract(dot(xyPixelPos, vec2(0.06711056, 0.00583715))));
}

void GetFadeIntensity_Radius_Thickness(float linearDepth, out float oIntensity, out float oRadius, out float oThickness)
{
    // Calc distance fade parameters
    vec3 intensity_radius_thickness = mix(vec3(u_ao_levels.a, u_ao_radius, u_ao_thickness), 
    u_ao_fade_values.xyw, vec3(ComputeDistanceFade(linearDepth)));
    oIntensity = intensity_radius_thickness.x;
    oRadius = intensity_radius_thickness.y;
    oThickness = intensity_radius_thickness.z;
}

void GetSpatialDirections_Offsets_JimenezNoise(vec2 screenPos, vec2 textureSizeZW, out float oNoiseSpatialOffsets, out float oNoiseSpatialDirections)
{
    vec2 xyPixelPos = ceil(screenPos * textureSizeZW);
    oNoiseSpatialOffsets = (1.0/4.0) * fract((xyPixelPos.y - xyPixelPos.x)/4.0)*4.0;
    oNoiseSpatialDirections = JimenezNoise(xyPixelPos);
}

vec4 FetchPosition0(vec2 uv)
{
    float sampledDepth = SampleDepth0(uv);
    return ConvertDepth(uv, sampledDepth);
}

//Note: The normal directions is reversed of the Unity's
vec3 FetchNormal(vec2 uv, int normalSource)
{
    /*if(normalSource == NORMALS_CAMERA)
    {

    }else if( (normalSource == NORMALS_GBUFFER) || (normalSource == NORMALS_GBUFFER_OCTA_ENCODED))
    {
        vec4 depthNormal = texture(u_depth_normal_tex, v_uv);
        vec3 vnormal = depthNormal.xyz*2.0 -1.0;
        return vec3(vnormal.xy, vnormal.z);
    }else{
        
    }*/
    vec3 c = FetchPosition0(uv).xyz;
    vec3 r = FetchPosition0(uv + vec2(1.0, 0.0) * u_maintex_texel_size.xy ).xyz;
    vec3 l = FetchPosition0(uv + vec2(-1.0, 0.0) * u_maintex_texel_size.xy ).xyz;
    vec3 t = FetchPosition0(uv + vec2(0.0, 1.0) * u_maintex_texel_size.xy ).xyz;
    vec3 b = FetchPosition0(uv + vec2(0.0, -1.0) * u_maintex_texel_size.xy ).xyz;
    vec3 vr = (r -c), vl = (c-l), vt = (t-c), vb = (c-b);
    vec3 min_horiz = ( dot(vr, vr) < dot(vl, vl) ) ? vr : vl;
    vec3 min_vert = ( dot(vt, vt) < dot(vb, vb) ) ? vt : vb;
    vec3 normalScreenSpace = normalize(cross(min_horiz, min_vert));

    return vec3(normalScreenSpace.x, normalScreenSpace.y, normalScreenSpace.z);

    //return vec3(0.0);
}

vec2 SampleSteps(float stepCount, vec2 screenPos, vec2 slideDir_x_texelSize, float stepRadius, float initialRayStep, float twoOverSquaredRadius, float thickness, vec3 vpos, vec3 vdir)
{
    vec2 h = vec2(-1.0, -1.0);

    //for(float s = 0.0; s < stepCount; )
    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (0.0 + initialRayStep), 1.0 + 0.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (1.0 + initialRayStep), 1.0 + 1.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (2.0 + initialRayStep), 1.0 + 2.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (3.0 + initialRayStep), 1.0 + 3.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (4.0 + initialRayStep), 1.0 + 4.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (5.0 + initialRayStep), 1.0 + 5.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (6.0 + initialRayStep), 1.0 + 6.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    {
        vec2 uvOffset = slideDir_x_texelSize * max(stepRadius * (7.0 + initialRayStep), 1.0 + 7.0);
        vec4 uv = vec4(screenPos.xy, screenPos.xy) + vec4(uvOffset.xy, -uvOffset.xy);

        //ds.v / ||ds||
        vec3 ds = FetchPosition0(uv.xy).xyz - vpos.xyz;

        //dt.v / ||dt||
        vec3 dt = FetchPosition0(uv.zw).xyz - vpos.xyz;

        vec2 dsdt = vec2(dot(ds, ds), dot(dt, dt));
        vec2 rLength = inversesqrt(dsdt + vec2(0.0001).xx);

        vec2 H = vec2(dot(ds, vdir), dot(dt, vdir)) * rLength.xy;
        vec2 attn = clamp(dsdt.xy * vec2(twoOverSquaredRadius).xx, 0.0, 1.0);
        H = mix(H, h, attn);

        h.xy = (H.x > h.x && H.y > h.y) ? H.xy : mix(H.xy, h.xy, vec2(thickness));
        //s = s+ 1.0;
    }

    return h;
}

void GetGTAO(vec2 uv, bool useDynamicDepthMips, float directionCount, float stepCount, int normalSource, out float oOutDepth, out vec4 oOutRGBA)
{
    vec2 screenPos = uv;
    vec2 depthUVoffset = vec2(0.25, 0.25) * u_maintex_texel_size.xy;
    vec2 sampleUVDepth = screenPos - depthUVoffset;

    float sampledDepth = SampleDepth0(uv);
    vec4 vpos = ConvertDepth(sampleUVDepth, sampledDepth); //FetchPosition0(sampleUVDepth);
    float intensity, radius, thickness;
    GetFadeIntensity_Radius_Thickness(vpos.z, intensity, radius, thickness);

    if((sampledDepth >= (1.0 - DEPTH_EPSILON) ) || intensity < INTENISTY_THRESHOLD)
    {
        oOutDepth = HALF_MAX;
        oOutRGBA = vec4(1.0).xxxx;
        return;
    }

    vec3 vnormal = FetchNormal(sampleUVDepth, normalSource);
    vec3 vdir = vec3(0.0) -  normalize(vpos.xyz);

    float vdirXYDot = dot(vdir.xy, vdir.xy);

    float radiusToScreen = radius * u_ao_half_proj_scale;
    float screenRadius = max(min(-radiusToScreen / vpos.z, PIXEL_RADIUS_LIMIT), (stepCount+0.0));
    float twoOverSquaredRadius = 2.0 / (radius * radius);
    float stepRadius =  screenRadius / (stepCount + 1.0);
    float noiseSpatialOffsets, noiseSpatialDirections;
    GetSpatialDirections_Offsets_JimenezNoise(screenPos, u_maintex_texel_size.zw, noiseSpatialOffsets, noiseSpatialDirections);
    float initialRayStep = fract(noiseSpatialOffsets);
    float piOverDirectionCount = PI / (0.0 + directionCount);
    float noiseSpatialDirections_x_piOver_directionCount = noiseSpatialDirections * piOverDirectionCount;

    float occlusionAcc = 0.0;
    //for(float dirCnt = 0.0; dirCnt < directionCount; )
    {
        float angle = 0.0 * piOverDirectionCount + noiseSpatialDirections_x_piOver_directionCount;
        vec2 cos_sin = vec2(cos(angle), sin(angle));

        vec3 sliceDir = vec3(cos_sin.xy, 0.0);
        float wallDarkeningCorrection = dot(vnormal, cross(vdir, sliceDir)) * vdirXYDot;
        wallDarkeningCorrection = wallDarkeningCorrection * wallDarkeningCorrection;

        vec2 slideDir_x_texelSize = sliceDir.xy * u_maintex_texel_size.xy;
        vec2 h;

        h = SampleSteps(stepCount, screenPos, slideDir_x_texelSize, stepRadius, initialRayStep, twoOverSquaredRadius, thickness, vpos.xyz, vdir);
        
        vec3 normalSlicePlane = normalize(cross(sliceDir, vdir));
        vec3 tangent = cross(vdir, normalSlicePlane);
        
        //Gram-Schmidt process
        vec3 normalProjected = vnormal - normalSlicePlane * dot(vnormal, normalSlicePlane);
        float projLength = length(normalProjected) + 0.0001;
        float cos_gamma = clamp(dot(normalProjected, vdir)/projLength, -1.0, 1.0);
        float gamma = -sign(dot(normalProjected, tangent)) * acos(cos_gamma);

        h = acos(clamp(h, -1.0, 1.0));
        h.x = gamma + max(-h.x - gamma, -HALF_PI);
        h.y = gamma + min(h.y - gamma, HALF_PI);

        float sin_gamma = sin(gamma);
        vec2 h2 = 2.0 * h;

        vec2 innerIntegral = (-cos(h2 - gamma) + cos_gamma + h2 * sin_gamma);
        occlusionAcc += (projLength + wallDarkeningCorrection) * 0.25 * (innerIntegral.x + innerIntegral.y);
        //dirCnt = dirCnt + 1.0;
    }

    {
        float angle = 1.0 * piOverDirectionCount + noiseSpatialDirections_x_piOver_directionCount;
        vec2 cos_sin = vec2(cos(angle), sin(angle));

        vec3 sliceDir = vec3(cos_sin.xy, 0.0);
        float wallDarkeningCorrection = dot(vnormal, cross(vdir, sliceDir)) * vdirXYDot;
        wallDarkeningCorrection = wallDarkeningCorrection * wallDarkeningCorrection;

        vec2 slideDir_x_texelSize = sliceDir.xy * u_maintex_texel_size.xy;
        vec2 h;

        h = SampleSteps(stepCount, screenPos, slideDir_x_texelSize, stepRadius, initialRayStep, twoOverSquaredRadius, thickness, vpos.xyz, vdir);
        
        vec3 normalSlicePlane = normalize(cross(sliceDir, vdir));
        vec3 tangent = cross(vdir, normalSlicePlane);
        
        //Gram-Schmidt process
        vec3 normalProjected = vnormal - normalSlicePlane * dot(vnormal, normalSlicePlane);
        float projLength = length(normalProjected) + 0.0001;
        float cos_gamma = clamp(dot(normalProjected, vdir)/projLength, -1.0, 1.0);
        float gamma = -sign(dot(normalProjected, tangent)) * acos(cos_gamma);

        h = acos(clamp(h, -1.0, 1.0));
        h.x = gamma + max(-h.x - gamma, -HALF_PI);
        h.y = gamma + min(h.y - gamma, HALF_PI);

        float sin_gamma = sin(gamma);
        vec2 h2 = 2.0 * h;

        vec2 innerIntegral = (-cos(h2 - gamma) + cos_gamma + h2 * sin_gamma);
        occlusionAcc += (projLength + wallDarkeningCorrection) * 0.25 * (innerIntegral.x + innerIntegral.y);
        //dirCnt = dirCnt + 1.0;
    }

    {
        float angle = 2.0 * piOverDirectionCount + noiseSpatialDirections_x_piOver_directionCount;
        vec2 cos_sin = vec2(cos(angle), sin(angle));

        vec3 sliceDir = vec3(cos_sin.xy, 0.0);
        float wallDarkeningCorrection = dot(vnormal, cross(vdir, sliceDir)) * vdirXYDot;
        wallDarkeningCorrection = wallDarkeningCorrection * wallDarkeningCorrection;

        vec2 slideDir_x_texelSize = sliceDir.xy * u_maintex_texel_size.xy;
        vec2 h;

        h = SampleSteps(stepCount, screenPos, slideDir_x_texelSize, stepRadius, initialRayStep, twoOverSquaredRadius, thickness, vpos.xyz, vdir);
        
        vec3 normalSlicePlane = normalize(cross(sliceDir, vdir));
        vec3 tangent = cross(vdir, normalSlicePlane);
        
        //Gram-Schmidt process
        vec3 normalProjected = vnormal - normalSlicePlane * dot(vnormal, normalSlicePlane);
        float projLength = length(normalProjected) + 0.0001;
        float cos_gamma = clamp(dot(normalProjected, vdir)/projLength, -1.0, 1.0);
        float gamma = -sign(dot(normalProjected, tangent)) * acos(cos_gamma);

        h = acos(clamp(h, -1.0, 1.0));
        h.x = gamma + max(-h.x - gamma, -HALF_PI);
        h.y = gamma + min(h.y - gamma, HALF_PI);

        float sin_gamma = sin(gamma);
        vec2 h2 = 2.0 * h;

        vec2 innerIntegral = (-cos(h2 - gamma) + cos_gamma + h2 * sin_gamma);
        occlusionAcc += (projLength + wallDarkeningCorrection) * 0.25 * (innerIntegral.x + innerIntegral.y);
        //dirCnt = dirCnt + 1.0;
    }
    
    occlusionAcc /= (3.0 + 0.0);

    float outAO = clamp(occlusionAcc, 0.0, 1.0);

    oOutRGBA = vec4(vec3(1.0), outAO);
    oOutDepth = sampledDepth;
}

vec4 GTAO(vec2 uv, bool useDynamicDepthMips, float directionCount, float sampleCount, int normalSource)
{
    float outDepth;
    vec4  outRGBA;
    GetGTAO(uv, useDynamicDepthMips, directionCount, sampleCount / 2.0, normalSource, outDepth, outRGBA);
    return vec4(outRGBA.a, outDepth, 0.0, 0.0);
}

void main(){
    vec4 color = GTAO(v_uv, false, 3.0, 8.0, u_perpixel_normal);

    o_fragColor = vec4(color.xy, 0.0, 0.0);
}
]]

kSSAOPostEffectFS = [[
#version 300 es
precision highp float;
precision highp sampler2D;   
in vec2 v_uv;
layout(location = 0) out vec4 o_fragColor;
uniform sampler2D u_ssao_tex;
uniform sampler2D _MainTex;
uniform vec2 u_ao_fade_params;
uniform vec4  u_ao_fade_values;
uniform vec4 u_ao_fade_tint;
uniform float u_ao_power_exponent;
uniform float u_one_over_depthscale;
uniform vec4 u_ao_levels; 
uniform vec4 u_ProjectionParams;

// linear depth to (0, 1)
float linearDepth(float z)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    return 2.0 * near / (far + near - z * (far - near));
}

float ComputeDistanceFade(float distance)
{
    return clamp(max(0.0, distance - u_ao_fade_params.x) * u_ao_fade_params.y, 0.0, 1.0);
}

vec4 CalcOcclusion(float iOcclusion, float linearDepth)
{
    float distanceFade = ComputeDistanceFade(linearDepth);
    float exponent = mix(u_ao_power_exponent, u_ao_fade_values.z, distanceFade);
    float occlusion = pow(max(iOcclusion, 0.0), exponent);
    vec3 tintedOcclusion = mix(u_ao_levels.rgb, u_ao_fade_tint.rgb, distanceFade);
    tintedOcclusion = mix(tintedOcclusion, vec3(1.0), vec3(occlusion));
    float intensity = mix(u_ao_levels.a, u_ao_fade_values.x, distanceFade);
    return mix(vec4(1.0), vec4(tintedOcclusion.rgb, occlusion), intensity);
}

void main()
{
    vec4 ssao = texture(u_ssao_tex, v_uv);
    vec4 target = texture(_MainTex, v_uv);
    float eyeDepth = ssao.y * u_ProjectionParams.z;
    vec4 occlusionRGBA = CalcOcclusion(ssao.x, eyeDepth);
    
    //debug
    //o_fragColor = vec4(vec3(ssao.y), 1.0);//*u_one_over_depthscale

    //combined
    o_fragColor = vec4(vec3(occlusionRGBA * target), target.a);
}
]]

--  Blur
kSSAOBlur = [[
#version 300 es
precision highp float;
precision highp sampler2D; 

in vec2 v_uv;
layout(location = 0) out vec4 o_fragColor;

uniform sampler2D _MainTex;
uniform vec2 u_ao_blur_deltauv;
// uniform float u_ao_blur_radius;
uniform float u_one_over_depthscale;
uniform vec4 u_ProjectionParams;
uniform float u_ao_blur_sharpness;

// linear depth to (0, 1)
float linearDepth(float z)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    return 2.0 * near / (far + near - z * (far - near));
}

// linear depth to (0, f)
float linearEyeDepth(float z)
{
    float far = u_ProjectionParams.z;
    return linearDepth(z) * far;
}

float unLinear01Depth(float ldepth)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    float zc0 = (1.0 - far/near)/2.0;
    float zc1 = (1.0 + far/near)/2.0;

    return (1.0/ldepth - zc1) / zc0;
}

vec2 FetchOcclusionDepth(vec2 uv)
{
    vec4 ssao = texture(_MainTex, uv);
    return ssao.xy;
}

float CrossBilateralWeight(float r, float z, float z0, float blur_radius)
{
	float BlurSigma = (blur_radius+1.0) * 0.5;
	float BlurFalloff = 1.0 / (2.0*BlurSigma*BlurSigma);

	// float dz = (z - z0) * u_ao_blur_sharpness;
    float dz = (linearEyeDepth(z) - linearEyeDepth(z0)) * u_ao_blur_sharpness;
	return exp2(-r*r*BlurFalloff - dz*dz);
}

vec2 blur1D_4x(vec2 aow, vec2 uv, vec2 offset, float z0, float blur_radius)
{
    float w = 1.0;
    vec2 aoz = FetchOcclusionDepth(uv + offset * vec2(0.0, 0.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);

    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(0.0, 0.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv + offset * vec2(1.0, 1.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);

    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(1.0, 1.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv + offset * vec2(2.0, 2.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(2.0, 2.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv + offset * vec2(3.0, 3.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(3.0, 3.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv + offset * vec2(4.0, 4.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(4.0, 4.0));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv + offset * vec2(0.5, 0.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(0.5, 0.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;


    aoz = FetchOcclusionDepth(uv + offset * vec2(2.5, 2.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(2.5, 2.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;


    aoz = FetchOcclusionDepth(uv + offset * vec2(4.5, 4.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(4.5, 4.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv + offset * vec2(6.5, 6.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    aoz = FetchOcclusionDepth(uv - offset * vec2(6.5, 6.5));
    w = CrossBilateralWeight(0.0, aoz.y, z0, blur_radius);
    aow.x += aoz.x * w;
    aow.y += w;

    return aow;
}

void main()
{
    vec2 aoz = FetchOcclusionDepth(v_uv);
    float center_z = aoz.y;

    float kernel_radius = 8.0;
    // if(u_ao_blur_radius > 0.5 && u_ao_blur_radius < 1.5)
    // {
        
    // }else if(u_ao_blur_radius > 1.5 && u_ao_blur_radius < 2.5){
    //     kernel_radius = 2.0;
    // }else if(u_ao_blur_radius > 2.5 && u_ao_blur_radius < 3.5){
    //     kernel_radius = 4.0;
    // }else{
    //     kernel_radius = 8.0;
    // }
    kernel_radius = 1.0;
    vec2 ao_w = vec2(aoz.x * 1.0, 1.0);
    ao_w = blur1D_4x(ao_w, v_uv, u_ao_blur_deltauv, center_z, kernel_radius);
    ao_w.x /= ao_w.y;
    o_fragColor = vec4(ao_w.x, center_z, 0.0, 0.0);
}
]]

SSAOShader = ScriptableObject(BaseShader)

function SSAOShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("ScreenSpaceAmbientOcclusion")
        AddPassToMaterial(material, "gles30", kSSAOVS, kSSAOFS);
        AddPassToMaterial(material, "gles30", kSSAOVS, kSSAOPostEffectFS);
        AddPassToMaterial(material, "gles30", kSSAOVS, kSSAOBlur);
        self.material = material
    end
    return self.material
end