const KIRA_COMMON_VS=
    `
precision highp float;
attribute vec3 inPosition;
attribute vec2 inTexCoord;

varying vec2 uv;
varying float v_NoiseData;
varying float v_NoiseData2;

uniform sampler2D u_KiraTex;
uniform sampler2D u_NoiseTex;
uniform sampler2D u_MaskTex;
uniform float u_KiraSizeScale;
uniform float u_KiraSizeRandomExtent;

const float kiraTexWidth = 128.0;
const float kiraTexWidthInv = 1.0 / kiraTexWidth;
const float kiraSizeRandomMin = 0.1;
const float kiraSizeRandomMax = 3.6;

float remapValue (float inputValue, float inputMin, float inputMax, float outputMin, float outputMax)
{
    return inputValue / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
}

void main() {
    // sample kira texture
    vec2 uv0 = inPosition.xy;
    vec2 uv1 = inPosition.xy + vec2(kiraTexWidthInv, 0.0);
    vec4 pixel0 = texture2D(u_KiraTex, uv0);
    vec4 pixel1 = texture2D(u_KiraTex, uv1);
    vec2 pos = vec2(pixel0.r + pixel0.g / 255.0, pixel0.b + pixel0.a / 255.0);
    float flag = pixel1.b;
    gl_Position = vec4((pos-0.5)*2.0, 0.0, 1.0);

    // calculate size
    vec4 noiseData = texture2D(u_NoiseTex, uv0);
    float spriteSizeRandom = remapValue(noiseData.r, 0.0, 1.0, kiraSizeRandomMin, kiraSizeRandomMax);
    float mask = 1.0;

    #ifdef AE_USE_MASK
        mask = 1.0 - texture2D(u_MaskTex, pos).r;
    #endif

    gl_PointSize = inPosition.z * u_KiraSizeScale * spriteSizeRandom * flag * mask;
    v_NoiseData = noiseData.b;
    v_NoiseData2 = noiseData.r;
}
`;

const KIRA_SPRITE_FS=
        `
    precision highp float;
    
    uniform sampler2D u_KiraPattern0;
    uniform sampler2D u_KiraPattern1;
    uniform sampler2D u_KiraPattern2;
    
    uniform float u_KiraBrightness;
    uniform float u_KiraOpacity;
    uniform int u_KiraPatternCount;
    uniform vec4 u_ColorOne;
    uniform vec4 u_ColorTwo;
    
    varying vec2 uv;
    varying float v_NoiseData;
    varying float v_NoiseData2;
    
    vec3 rgb2hsv (vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(   vec4(c.bg, K.wz),
                        vec4(c.gb, K.xy),
                        step(c.b, c.g) );
        vec4 q = mix(   vec4(p.xyw, c.r),
                        vec4(c.r, p.yzx),
                        step(p.x, c.r) );
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                    d / (q.x + e),
                    q.x);
    }
    
    vec3 hsv2rgb (vec3 color)
    {
        float h = color.x;
        float s = color.y;
        float v = color.z;
        float c = v * s;
        float m = v - c;
    
        float H = h * 6.0;
        float c1 = 1.0 - clamp(H-1.0,0.0,1.0) + clamp(H-4.0, 0.0, 1.0);
        float c2 = clamp(H, 0.0, 1.0) - clamp(H-3.0, 0.0, 1.0);
        float c3 = clamp(H-2.0, 0.0, 1.0) - clamp(H-5.0, 0.0, 1.0);
        return vec3( c1*c, c2*c, c3*c ) + m;
    }
    
    vec3 hueChange(vec3 color, vec3 targetColor, vec3 targetColor2, float noise)
    {
        vec3 hsvValue = rgb2hsv(color);
        vec3 targetHue = rgb2hsv(mix(targetColor, targetColor2, step(0.5, noise)));
        hsvValue.r = fract(hsvValue.r + targetHue.r);
        hsvValue.g = targetHue.g;
        return hsv2rgb(hsvValue);
    }
    
    int remapIndex (float inputValue, int indexCount)
    {
        return int(floor(inputValue * float(indexCount) * 0.9));
    }

    
    void main() {
        #ifdef AE_USE_PATTERN
            vec4 pats[3];
            pats[0] = texture2D(u_KiraPattern0, gl_PointCoord);
            pats[1] = texture2D(u_KiraPattern1, gl_PointCoord);
            pats[2] = texture2D(u_KiraPattern2, gl_PointCoord);
            int patIdx = remapIndex(v_NoiseData, u_KiraPatternCount);
            vec4 patColor = pats[patIdx];
            patColor.rgb *= patColor.a;
            
            vec3 hueShiftColor = hueChange(patColor.rgb, u_ColorOne.rgb, u_ColorTwo.rgb, v_NoiseData2);
            vec3 rgbColor = mix(patColor.rgb, hueShiftColor, 0.8);
            vec4 finalColor = vec4(rgbColor, patColor.a) * (1.0 + u_KiraBrightness * 1.5) * u_KiraOpacity;
        #else
            vec4 finalColor = vec4(0.0);
        #endif
            gl_FragColor = finalColor;
    }
`;

exports.KIRA_COMMON_VS = KIRA_COMMON_VS
exports.KIRA_SPRITE_FS = KIRA_SPRITE_FS