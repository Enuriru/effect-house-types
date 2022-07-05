kBloomVS = [[
attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 uv;
void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]

kExtractBrightFastModeFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
// uniform vec2 u_userprop;
uniform vec2 u_texture_size;
uniform vec4 u_threshold;
uniform vec4 u_clamp;
uniform sampler2D _MainTex;
uniform sampler2D _BloomMask;

vec4 DownsampleBox4Tap(vec2 texelSize)
{
    vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0);

    vec4 s;

    s = texture2D(_MainTex, uv + d.xy);
    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.xw);
    s += texture2D(_MainTex, uv + d.zw);

    return s * (1.0 / 4.0);
}

//colorTobright
float PixelBrightness(vec3 color, float useHSV)
{
    float br = 0.0;
    // if(useHSV > 0.5)
    // {
    //     //rgb to hsv
    //     br = max(color.r, color.g);
    //     br = max(br, color.b);
    // }else
    {
        //rgb to Luminance
        br = dot(color, vec3(0.2126, 0.7152, 0.0722));
    }
    return br;
}

//
// Quadratic color thresholding
// curve = (threshold - knee, knee * 2, 0.25 / knee)
//
vec4 QuadraticThreshold(vec4 color, float threshold, vec3 curve, float useHSV)
{
    // Pixel brightness
    float br = PixelBrightness(color.rgb, useHSV);

    // Under-threshold part: quadratic curve
    float rq = clamp(br - curve.x, 0.0, curve.y);
    rq = curve.z * rq * rq;

    // Combine and apply the brightness response curve.
    color *= max(rq, br - threshold) / max(br, 1.0e-4);

    return color;
}

vec4 Prefilter(vec4 color, float useHSV)
{
//     half autoExposure = SAMPLE_TEXTURE2D(_AutoExposureTex, sampler_AutoExposureTex, uv).r;
//     color *= autoExposure;
    color = min(vec4(u_clamp.x), color); // clamp to max
    color = QuadraticThreshold(color, u_threshold.x, u_threshold.yzw, useHSV);
    return color;
}

void main()
{
//u_userprop:(u_usemask, u_brightfunc)
    vec4 color = DownsampleBox4Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));
    float mask = 1.0;
    // if(u_userprop.x > 0.5)
    // {
    //     mask = texture2D(_BloomMask, uv).r;
    // }
    color = color * mask;
    color = clamp(color, vec4(0.0), vec4(65504.0)); // (2 - 2^-10) * 2^15
    color = Prefilter(color, 0.0);
    gl_FragColor = color;
}    
]]

kExtractBrightFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
// uniform vec2 u_userprop;
uniform vec2 u_texture_size;
uniform vec4 u_threshold;
uniform vec4 u_clamp;
uniform sampler2D _MainTex;
uniform sampler2D _BloomMask;

vec4 DownsampleBox13Tap(vec2 texelSize)
{

    vec4 A = texture2D(_MainTex, uv + texelSize * (-1.0, -1.0));
    vec4 B = texture2D(_MainTex, uv + texelSize * ( 0.0, -1.0));
    vec4 C = texture2D(_MainTex, uv + texelSize * ( 1.0, -1.0));
    vec4 D = texture2D(_MainTex, uv + texelSize * (-0.5, -0.5));
    vec4 E = texture2D(_MainTex, uv + texelSize * ( 0.5, -0.5));
    vec4 F = texture2D(_MainTex, uv + texelSize * (-1.0,  0.0));
    vec4 G = texture2D(_MainTex, uv);
    vec4 H = texture2D(_MainTex, uv + texelSize * ( 1.0,  0.0));
    vec4 I = texture2D(_MainTex, uv + texelSize * (-0.5,  0.5));
    vec4 J = texture2D(_MainTex, uv + texelSize * ( 0.5,  0.5));
    vec4 K = texture2D(_MainTex, uv + texelSize * (-1.0,  1.0));
    vec4 L = texture2D(_MainTex, uv + texelSize * ( 0.0,  1.0));
    vec4 M = texture2D(_MainTex, uv + texelSize * ( 1.0,  1.0));

    vec2 div = (1.0 / 4.0) * vec2(0.5, 0.125);

    vec4 o = (D + E + I + J) * div.x;
    o += (A + B + G + F) * div.y;
    o += (B + C + H + G) * div.y;
    o += (F + G + L + K) * div.y;
    o += (G + H + M + L) * div.y;

    return o;
}

//colorTobright
float PixelBrightness(vec3 color, float useHSV)
{
    float br = 0.0;
    if(useHSV < 0.5)
    {
        //rgb to hsv
        br = max(color.r, color.g);
        br = max(br, color.b);
    }else
    {
        //rgb to Luminance
        br = dot(color, vec3(0.2126, 0.7152, 0.0722));
    }
    return br;
}

//
// Quadratic color thresholding
// curve = (threshold - knee, knee * 2, 0.25 / knee)
//
vec4 QuadraticThreshold(vec4 color, float threshold, vec3 curve, float useHSV)
{
    // Pixel brightness
    float br = PixelBrightness(color.rgb, useHSV);

    // Under-threshold part: quadratic curve
    float rq = clamp(br - curve.x, 0.0, curve.y);
    rq = curve.z * rq * rq;

    // Combine and apply the brightness response curve.
    color *= max(rq, br - threshold) / max(br, 1.0e-4);

    return color;
}

vec4 Prefilter(vec4 color, float useHSV)
{
//     half autoExposure = SAMPLE_TEXTURE2D(_AutoExposureTex, sampler_AutoExposureTex, uv).r;
//     color *= autoExposure;
    color = min(vec4(u_clamp.x), color); // clamp to max
    color = QuadraticThreshold(color, u_threshold.x, u_threshold.yzw, useHSV);
    return color;
}

void main()
{
    vec4 color = DownsampleBox13Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));
    float mask = 1.0;
    // if(u_userprop.x > 0.5)
    // {
    //     mask = texture2D(_BloomMask, uv).r;
    // }
    color = color * mask;
    color = clamp(color, vec4(0.0), vec4(65504.0)); // (2 - 2^-10) * 2^15
    color = Prefilter(color, 0.0);
    gl_FragColor = color;
}
]]

kDownSampleFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
 

vec4 DownsampleBox13Tap(vec2 texelSize)
{
    vec4 A = texture2D(_MainTex, uv + texelSize * (-1.0, -1.0));
    vec4 B = texture2D(_MainTex, uv + texelSize * ( 0.0, -1.0));
    vec4 C = texture2D(_MainTex, uv + texelSize * ( 1.0, -1.0));
    vec4 D = texture2D(_MainTex, uv + texelSize * (-0.5, -0.5));;
    vec4 E = texture2D(_MainTex, uv + texelSize * ( 0.5, -0.5));;
    vec4 F = texture2D(_MainTex, uv + texelSize * (-1.0,  0.0));
    vec4 G = texture2D(_MainTex, uv);
    vec4 H = texture2D(_MainTex, uv + texelSize * ( 1.0,  0.0)); 
    vec4 I = texture2D(_MainTex, uv + texelSize * (-0.5,  0.5));
    vec4 J = texture2D(_MainTex, uv + texelSize * ( 0.5,  0.5));
    vec4 K = texture2D(_MainTex, uv + texelSize * (-1.0,  1.0));
    vec4 L = texture2D(_MainTex, uv + texelSize * ( 0.0,  1.0));
    vec4 M = texture2D(_MainTex, uv + texelSize * ( 1.0,  1.0));;
    vec2 div = (1.0 / 4.0) * vec2(0.5, 0.125);

    vec4 o = (D + E + I + J) * div.x;
    o += (A + B + G + F) * div.y;
    o += (B + C + H + G) * div.y;
    o += (F + G + L + K) * div.y;
    o += (G + H + M + L) * div.y;

    return o;
}

void main()
{
    vec4 color = DownsampleBox13Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));
    gl_FragColor = color;
}
]]

kDownSampleFastModeFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;

vec4 DownsampleBox4Tap(vec2 texelSize)
{
    vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0);
    vec4 s;
    s = texture2D(_MainTex, uv + d.xy);
    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.xw);
    s += texture2D(_MainTex, uv + d.zw);
    return s * (1.0 / 4.0);
}

void main()
{
    vec4 color = DownsampleBox4Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));
    gl_FragColor = color;
}   
]]

kUpSampleFastModeFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
uniform sampler2D _BloomTex;
uniform float u_sample_scale;

vec4 UpsampleBox(vec2 texelSize, vec4 sampleScale)
{
    vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0) * (sampleScale * 0.5);

    vec4 s;
    vec4 c;
    s = texture2D(_MainTex, uv + d.xy);
    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.xw);
    s += texture2D(_MainTex, uv + d.zw);

    return s * (1.0 / 4.0);
}

vec4 Combine(vec4 bloom)
{
    vec4 c = texture2D(_BloomTex, uv);
    return bloom + c;
}

void main()
{
    vec4 color = UpsampleBox(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));
    vec4 c = Combine(color);
    gl_FragColor = c;
}
]]

kUpSampleFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
uniform sampler2D _BloomTex;
uniform float u_sample_scale;

vec4 UpsampleTent(vec2 texelSize, vec4 sampleScale)
{
    vec4 d = texelSize.xyxy * vec4(1.0, 1.0, -1.0, 0.0) * sampleScale;

    vec4 s;
    vec4 c;
    c = texture2D(_MainTex, uv - d.xy);
    s = c;
    c = texture2D(_MainTex, uv - d.wy);
    s += c * 2.0;
    c = texture2D(_MainTex, uv - d.zy);
    s += c;

    c = texture2D(_MainTex, uv + d.zw);
    s += c * 2.0;
    c = texture2D(_MainTex, uv       );
    s += c * 4.0;
    c = texture2D(_MainTex, uv + d.xw);
    s += c * 2.0;

    c = texture2D(_MainTex, uv + d.zy);
    s += c;
    c = texture2D(_MainTex, uv + d.wy);
    s += c * 2.0;
    c = texture2D(_MainTex, uv + d.xy);
    s += c;

    return s * (1.0 / 16.0);
}

vec4 Combine(vec4 bloom)
{
    vec4 c = texture2D(_BloomTex, uv);
    return bloom + c;
}

void main()
{
    vec4 color = UpsampleTent(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));
    vec4 c = Combine(color);
    gl_FragColor = c;
}
]]

kUpSampleFinalFastModeFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
// uniform float u_hdr;
uniform sampler2D _PreviewTex;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
uniform vec4 u_bloom_color;
uniform float u_intensity;
uniform float u_sample_scale;
 
vec3 jodieReinhardTonemap(vec3 c){
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    vec3 tc = c / (c + 1.0);

    return mix(c / (l + 1.0), tc, tc);
}

vec4 UpsampleBox(vec2 texelSize, vec4 sampleScale)
{
    vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0) * (sampleScale * 0.5);

    vec4 s;
    vec4 c;
    s = texture2D(_MainTex, uv + d.xy);
    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.xw);
    s += texture2D(_MainTex, uv + d.zw);
   
    return s * (1.0 / 4.0);
}

void main()
{
    vec4 color = UpsampleBox(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));
    color.rgb = color.rgb * u_bloom_color.rgb * u_intensity;
    color.a *= u_bloom_color.a;
 
    vec4 originColor = texture2D(_PreviewTex, uv);
      
    // if(u_hdr > 0.0)
    // {
    //     color.rgb = jodieReinhardTonemap(color.rgb);
    // }
    gl_FragColor = vec4((originColor + color).rgb, originColor.a);
 
 
}
]]

kUpSampleFinalFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
// uniform float u_hdr;
uniform sampler2D _PreviewTex;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
uniform vec4 u_bloom_color;
uniform float u_intensity;
uniform float u_sample_scale;
 
vec3 jodieReinhardTonemap(vec3 c){
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    vec3 tc = c / (c + 1.0);

    return mix(c / (l + 1.0), tc, tc);
}


vec4 UpsampleTent(vec2 texelSize, vec4 sampleScale)
{
    vec4 d = texelSize.xyxy * vec4(1.0, 1.0, -1.0, 0.0) * sampleScale;

    vec4 s;
    s =  texture2D(_MainTex, uv - d.xy);
    s += texture2D(_MainTex, uv - d.wy) * 2.0;
    s += texture2D(_MainTex, uv - d.zy);

    s += texture2D(_MainTex, uv + d.zw) * 2.0;
    s += texture2D(_MainTex, uv       ) * 4.0;
    s += texture2D(_MainTex, uv + d.xw) * 2.0;

    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.wy) * 2.0;
    s += texture2D(_MainTex, uv + d.xy);

    return s * (1.0 / 16.0);
}

void main()
{
    vec4 color = UpsampleTent(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));
    color.rgb = color.rgb * u_bloom_color.rgb * u_intensity;
    color.a *= u_bloom_color.a;
    
    vec4 originColor = texture2D(_PreviewTex, uv);
    
    // if(u_hdr > 0.0)
    // {
    //     color.rgb = jodieReinhardTonemap(color.rgb);
    // }
    gl_FragColor = vec4((originColor + color).rgb, originColor.a);
}
]]





kStarFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
uniform vec2 u_direction;
uniform sampler2D _MainTex;
uniform float u_starIntensity;

vec4 dirBlur(vec2 uv)
{
    float delta = 0.2;
    vec4 color = vec4(0.0);
    vec2 off1 = 1.0 * delta * u_direction;
    vec2 off2 = 2.0 * delta * u_direction;
    vec2 off3 = 3.0 * delta * u_direction;
    vec2 off4 = 4.0 * delta * u_direction;
    vec2 off5 = 5.0 * delta * u_direction;
  
    color += texture2D(_MainTex, uv);
    color += texture2D(_MainTex, uv + off1);
    color += texture2D(_MainTex, uv - off1);
    color += texture2D(_MainTex, uv + off2);
    color += texture2D(_MainTex, uv - off2);
    color += texture2D(_MainTex, uv + off3);
    color += texture2D(_MainTex, uv - off3);
    color += texture2D(_MainTex, uv + off4);
    color += texture2D(_MainTex, uv - off4);
    color += texture2D(_MainTex, uv + off5);
    color += texture2D(_MainTex, uv - off5);
    return color * u_starIntensity * 0.090909;
}


void main()
{
    vec4 color = dirBlur(uv);
    gl_FragColor = color;
} 
]]

kStarFastModeFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
uniform vec2 u_direction;
uniform sampler2D _MainTex;
uniform float u_starIntensity;
 

vec4 dirBlur(vec2 uv)
{
    float delta = 0.33333;
    vec4 color = vec4(0.0);
    vec2 off1 = 1.0 * delta * u_direction;
    vec2 off2 = 2.0 * delta * u_direction;
    vec2 off3 = 3.0 * delta * u_direction;
    color += texture2D(_MainTex, uv);
    color += texture2D(_MainTex, uv + off1);
    color += texture2D(_MainTex, uv - off1);
    color += texture2D(_MainTex, uv + off2);
    color += texture2D(_MainTex, uv - off2);
    color += texture2D(_MainTex, uv + off3);
    color += texture2D(_MainTex, uv - off3);
    return color * u_starIntensity * 0.14285714;
}


void main()
{
    vec4 color = dirBlur(uv);
    gl_FragColor = color;
}   
]]




kUpSampleFinalStarFastModeFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
// uniform float u_hdr;
uniform sampler2D _PreviewTex;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
uniform vec4 u_bloom_color;
uniform float u_intensity;
uniform float u_sample_scale;
uniform sampler2D _HorizontalTex;
uniform sampler2D _VerticalTex;
 

vec3 jodieReinhardTonemap(vec3 c){
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    vec3 tc = c / (c + 1.0);

    return mix(c / (l + 1.0), tc, tc);
}

vec4 UpsampleBox(vec2 texelSize, vec4 sampleScale)
{
    vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0) * (sampleScale * 0.5);

    vec4 s;
    vec4 c;
    s = texture2D(_MainTex, uv + d.xy);
    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.xw);
    s += texture2D(_MainTex, uv + d.zw);
    

    return s * (1.0 / 4.0);
}

void main()
{
    vec4 color = UpsampleBox(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));
    color.rgb = color.rgb * u_intensity;
    vec4 color_h = texture2D(_HorizontalTex, uv);
    vec4 color_v = texture2D(_VerticalTex, uv);
    color.rgb += color_h.rgb + color_v.rgb;
    color.rgb *= u_bloom_color.rgb;
 
    vec4 originColor = texture2D(_PreviewTex, uv);
   
    // if(u_hdr > 0.0)
    // {
    //     color.rgb = jodieReinhardTonemap(color.rgb);
    // }
    gl_FragColor = vec4((originColor + color).rgb, originColor.a);

 

}
]]

kUpSampleFinalStarFS = [[
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 uv;
// uniform float u_hdr;
uniform sampler2D _PreviewTex;
uniform vec2 u_texture_size;
uniform sampler2D _MainTex;
uniform vec4 u_bloom_color;
uniform float u_intensity;
uniform float u_sample_scale;
uniform sampler2D _HorizontalTex;
uniform sampler2D _VerticalTex;
 

vec3 jodieReinhardTonemap(vec3 c){
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    vec3 tc = c / (c + 1.0);

    return mix(c / (l + 1.0), tc, tc);
}


vec4 UpsampleTent(vec2 texelSize, vec4 sampleScale)
{
    vec4 d = texelSize.xyxy * vec4(1.0, 1.0, -1.0, 0.0) * sampleScale;

    vec4 s;
    s =  texture2D(_MainTex, uv - d.xy);
    s += texture2D(_MainTex, uv - d.wy) * 2.0;
    s += texture2D(_MainTex, uv - d.zy);

    s += texture2D(_MainTex, uv + d.zw) * 2.0;
    s += texture2D(_MainTex, uv       ) * 4.0;
    s += texture2D(_MainTex, uv + d.xw) * 2.0;

    s += texture2D(_MainTex, uv + d.zy);
    s += texture2D(_MainTex, uv + d.wy) * 2.0;
    s += texture2D(_MainTex, uv + d.xy);

    return s * (1.0 / 16.0);
}

void main()
{
    vec4 color = UpsampleTent(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));
    color.rgb = color.rgb * u_intensity;
    vec4 color_h = texture2D(_HorizontalTex, uv);
    vec4 color_v = texture2D(_VerticalTex, uv);
    color.rgb += color_h.rgb + color_v.rgb;
    color.rgb *= u_bloom_color.rgb;


    vec4 originColor = texture2D(_PreviewTex, uv);
    

    // if(u_hdr > 0.0)
    // {
    //     color.rgb = jodieReinhardTonemap(color.rgb);
    // }
    gl_FragColor = vec4((originColor + color).rgb, originColor.a);
 
}
]]



BloomShader = ScriptableObject(BaseShader)

function BloomShader : getMaterial() 
    if self.material == nil then
        local material = CreateEmptyMaterial("Bloom")

        -- 0. ExtractBright Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kExtractBrightFS)
        -- 1. ExtractBright Fast Mode Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kExtractBrightFastModeFS)
        -- 2. DownSample Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kDownSampleFS)
        -- 3. DownSample Fast Mode Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kDownSampleFastModeFS)
        -- 4. UpSample Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kUpSampleFS)
        -- 5. UpSample Fast Mode Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kUpSampleFastModeFS)
        -- 6. UpSample Final Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kUpSampleFinalFS)
        -- 7. UpSample Final FastMode Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kUpSampleFinalFastModeFS)
        -- 8. Star Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kStarFS)
        -- 9. Star FastMode Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kStarFastModeFS)
        -- 10. UpSample Final Star Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kUpSampleFinalStarFS)
        -- 11. UpSample Final Star FastMode Pass
        AddPassToMaterial(material, "gles2", kBloomVS, kUpSampleFinalStarFastModeFS)

        self.material = material
    end

    return self.material
end
