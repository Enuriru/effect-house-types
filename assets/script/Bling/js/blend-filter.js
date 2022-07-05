'use strict';

const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const amg = require('./amg');

class BlendFilter extends amg.OperatorFilter {
    constructor(name, properties) {
        const DECL=`
#ifdef AE_BLENDMODE
    #if AE_BLENDMODE == 1 // Normal
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            return mix(base, blend, opacity);
        }
    #elif AE_BLENDMODE == 2 // Darken
        float darken (float base, float blend)
        {
            return min(base, blend);
        }
        vec3 darken (vec3 base, vec3 blend)
        {
            return vec3(darken(base.r, blend.r), darken(base.g, blend.g), darken(base.b, blend.b));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            return (darken(base, blend) * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 3 // Multiply
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 multiplyColor = base * blend;
            return (multiplyColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 4 // ColorBurn
        float colorBurn (float base, float blend)
        {
            float zero = blend;
            float nonZero = max(1.0 - (1.0 - base) / blend, 0.0);
            return mix(nonZero, zero, float(blend == 0.0));
        }
        vec3 colorBurn (vec3 base, vec3 blend)
        {
            return vec3(colorBurn(base.r, blend.r), colorBurn(base.g, blend.g), colorBurn(base.b, blend.b));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 burnColor = colorBurn(base, blend);
            return (burnColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 5 // Lighten
        float lighten (float base, float blend)
        {
            return max(base, blend);
        }
        vec3 lighten (vec3 base, vec3 blend)
        {
            return vec3(lighten(base.r, blend.r), lighten(base.g, blend.g), lighten(base.b, blend.b));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 lightenColor = lighten(base, blend);
            return (lightenColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 6 // Screen
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 screenColor = vec3(1.0) - ((vec3(1.0) - base) * (vec3(1.0) - blend));
            return (screenColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 7 // ColorDodge
        float colorDodge (float base, float blend)
        {
            float one = blend;
            float nonOne = min(base / (1.0 - blend), 1.0);
            return mix(nonOne, one, float(blend == 1.0));
        }
        vec3 colorDodge (vec3 base, vec3 blend)
        {
            return vec3(colorDodge(base.r, blend.r), colorDodge(base.g, blend.g), colorDodge(base.b, blend.b));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 dodgeColor = colorDodge(base, blend);
            return (dodgeColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 8 // LinearDodge
        vec3 linearDodge (vec3 base, vec3 blend)
        {
            return min(base + blend, vec3(1.0));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            return (linearDodge(base, blend) * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 9 // Overlay
        float overlay (float base, float blend)
        {
            float small = 2.0 * base * blend;
            float big = 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
            return mix(small, big, step(0.5, base));
        }
        vec3 overlay (vec3 base, vec3 blend)
        {
            return vec3(overlay(base.r, blend.r), overlay(base.g, blend.g), overlay(base.b, blend.b));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 overlayColor = overlay(base, blend);
            return (overlayColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 10 // Add
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 addColor = min(base + blend, vec3(1.0));
            return (addColor * opacity + base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 11 //SoftLight
        float softLight (float base, float blend)
        {
            float small = 2.0 * base * blend + base * base * (1.0 - 2.0 * blend);
            float big = sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend);
            return mix(small, big, step(0.5, blend));
        }
        vec3 softLight (vec3 base, vec3 blend)
        {
            return vec3(softLight(base.r, blend.r), softLight(base.g, blend.g), softLight(base.b, blend.b));
        }
        vec3 blend (vec3 base, vec3 blend, float opacity)
        {
            vec3 softLightColor = softLight(base, blend);
            return (softLightColor * opacity + base * (1.0 - opacity));
        }
    #endif
#else
    vec3 blend (vec3 base, vec3 blend, float opacity)
    {
        return mix(base, blend, opacity);
    }   
#endif
        `;
    
    const DECLMETAL = `
#ifdef AE_BLENDMODE
    #if AE_BLENDMODE == 1 // Normal
        static inline __attribute__((always_inline))
        float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
        {
            return mix(base, blend_1, float3(opacity));
        }
    #elif AE_BLENDMODE == 2 // Darken
        static inline __attribute__((always_inline))
        float darken(thread const float& base, thread const float& blend)
        {
            return fast::min(base, blend);
        }
        
        static inline __attribute__((always_inline))
        float3 darken(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(darken(param, param_1), darken(param_2, param_3), darken(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend_1;
            return (darken(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 3 // Multiply
        static inline __attribute__((always_inline))
        float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
        {
            float3 multiplyColor = base * blend_1;
            return (multiplyColor * opacity) + (base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 4 // ColorBurn
        static inline __attribute__((always_inline))
        float colorBurn(thread const float& base, thread const float& blend)
        {
            float zero = blend;
            float nonZero = fast::max(1.0 - ((1.0 - base) / blend), 0.0);
            return mix(nonZero, zero, float(blend == 0.0));
        }
        
        static inline __attribute__((always_inline))
        float3 colorBurn(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(colorBurn(param, param_1), colorBurn(param_2, param_3), colorBurn(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend_1;
            float3 burnColor = colorBurn(param, param_1);
            return (burnColor * opacity) + (base * (1.0 - opacity));
        }
    #elif AE_BLENDMODE == 5 // Lighten
    static inline __attribute__((always_inline))
    float lighten(thread const float& base, thread const float& blend)
    {
        return fast::max(base, blend);
    }
    
    static inline __attribute__((always_inline))
    float3 lighten(thread const float3& base, thread const float3& blend)
    {
        float param = base.x;
        float param_1 = blend.x;
        float param_2 = base.y;
        float param_3 = blend.y;
        float param_4 = base.z;
        float param_5 = blend.z;
        return float3(lighten(param, param_1), lighten(param_2, param_3), lighten(param_4, param_5));
    }
    
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 param = base;
        float3 param_1 = blend_1;
        float3 lightenColor = lighten(param, param_1);
        return (lightenColor * opacity) + (base * (1.0 - opacity));
    }
    #elif AE_BLENDMODE == 6 // Screen
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 screenColor = float3(1.0) - ((float3(1.0) - base) * (float3(1.0) - blend_1));
        return (screenColor * opacity) + (base * (1.0 - opacity));
    }
    #elif AE_BLENDMODE == 7 // ColorDodge
    static inline __attribute__((always_inline))
    float colorDodge(thread const float& base, thread const float& blend)
    {
        float one = blend;
        float nonOne = fast::min(base / (1.0 - blend), 1.0);
        return mix(nonOne, one, float(blend == 1.0));
    }
    
    static inline __attribute__((always_inline))
    float3 colorDodge(thread const float3& base, thread const float3& blend)
    {
        float param = base.x;
        float param_1 = blend.x;
        float param_2 = base.y;
        float param_3 = blend.y;
        float param_4 = base.z;
        float param_5 = blend.z;
        return float3(colorDodge(param, param_1), colorDodge(param_2, param_3), colorDodge(param_4, param_5));
    }
    
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 param = base;
        float3 param_1 = blend_1;
        float3 dodgeColor = colorDodge(param, param_1);
        return (dodgeColor * opacity) + (base * (1.0 - opacity));
    }
    #elif AE_BLENDMODE == 8 // LinearDodge
    static inline __attribute__((always_inline))
    float3 linearDodge(thread const float3& base, thread const float3& blend)
    {
        return fast::min(base + blend, float3(1.0));
    }
    
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 param = base;
        float3 param_1 = blend_1;
        return (linearDodge(param, param_1) * opacity) + (base * (1.0 - opacity));
    }
    #elif AE_BLENDMODE == 9 // Overlay
    static inline __attribute__((always_inline))
    float overlay(thread const float& base, thread const float& blend)
    {
        float small = (2.0 * base) * blend;
        float big = 1.0 - ((2.0 * (1.0 - base)) * (1.0 - blend));
        return mix(small, big, step(0.5, base));
    }
    
    static inline __attribute__((always_inline))
    float3 overlay(thread const float3& base, thread const float3& blend)
    {
        float param = base.x;
        float param_1 = blend.x;
        float param_2 = base.y;
        float param_3 = blend.y;
        float param_4 = base.z;
        float param_5 = blend.z;
        return float3(overlay(param, param_1), overlay(param_2, param_3), overlay(param_4, param_5));
    }
    
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 param = base;
        float3 param_1 = blend_1;
        float3 overlayColor = overlay(param, param_1);
        return (overlayColor * opacity) + (base * (1.0 - opacity));
    }
    #elif AE_BLENDMODE == 10 // Add
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 addColor = fast::min(base + blend_1, float3(1.0));
        return (addColor * opacity) + (base * (1.0 - opacity));
    }    
    #elif AE_BLENDMODE == 11 //SoftLight
    static inline __attribute__((always_inline))
    float softLight(thread const float& base, thread const float& blend)
    {
        float small = ((2.0 * base) * blend) + ((base * base) * (1.0 - (2.0 * blend)));
        float big = (sqrt(base) * ((2.0 * blend) - 1.0)) + ((2.0 * base) * (1.0 - blend));
        return mix(small, big, step(0.5, blend));
    }
    
    static inline __attribute__((always_inline))
    float3 softLight(thread const float3& base, thread const float3& blend)
    {
        float param = base.x;
        float param_1 = blend.x;
        float param_2 = base.y;
        float param_3 = blend.y;
        float param_4 = base.z;
        float param_5 = blend.z;
        return float3(softLight(param, param_1), softLight(param_2, param_3), softLight(param_4, param_5));
    }
    
    static inline __attribute__((always_inline))
    float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
    {
        float3 param = base;
        float3 param_1 = blend_1;
        float3 softLightColor = softLight(param, param_1);
        return (softLightColor * opacity) + (base * (1.0 - opacity));
    }
    #endif
#else
static inline __attribute__((always_inline))
float3 blend(thread const float3& base, thread const float3& blend_1, thread const float& opacity)
{
    return mix(base, blend_1, float3(opacity));
}
#endif
    `
          
        super(name, {
            operandNum: 2,
            decl: DECL,
            declMetal: DECLMETAL,
            snippet:`
            // base input0: kira input1: cameraInput
            result.rgb = blend(input1.rgb, input0.rgb, input0.a);
            result.a = 1.0;
            `,
            snippetMetal:`
            // base input0: kira input1: cameraInput
            float3 param = input1.xyz;
            float3 param_1 = input0.xyz;
            float param_2 = input0.w;
            float3 _56 = blend(param, param_1, param_2);
            result = float4(_56.x, _56.y, _56.z, result.w);
            result.w = 1.0;
            `
          })
        this.setProp('blendMode', properties.blendMode !== undefined ? properties.blendMode : 1) // NORMAL
    }

    setProp(name, value) {
        if(value == super.getProp(name)) {
            return;
        }
        super.setProp(name, value);
        if(name === 'blendMode') {
            this.material.enableMacro('AE_BLENDMODE', value);
        }
    }
}

module.exports.BlendFilter = BlendFilter

