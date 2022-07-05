kColorGradingVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 v_uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    v_uv = inTexCoord;
}
]]

kColorGradingFS = [[
#version 300 es
precision highp float;   
precision highp sampler2D; 
uniform sampler2D _MainTex;
in vec2 v_uv;   
layout(location = 0) out vec4 o_fragColor;

void main()
{
    vec4 color = texture(_MainTex, v_uv);
    color.rgb = pow (color.rgb, vec3(0.4545454, 0.4545454, 0.4545454));
    o_fragColor =color;

}
]]


kCGPostProcessFS = [[
    #version 300 es
    precision highp float;   
    precision highp sampler2D; 
    in vec2 v_uv;   
    layout(location = 0) out vec4 o_fragColor;
    
    uniform vec3   u_lut_params;
    uniform float u_post_exposure;
    uniform sampler2D u_lut2D;
    uniform sampler2D _MainTex;
    uniform float u_hdr;

    vec3 LinearToSRGB(vec3 c)
    {
        // USE_VERY_FAST_SRGB
        return sqrt(c);
    }

    vec4 LinearToSRGB(vec4 c)
    {
        return vec4(LinearToSRGB(c.rgb), c.a);
    }

    vec3 SRGBToLinear(vec3 c)
    {
        // USE_VERY_FAST_SRGB
        return c* c;
    }
    vec4 SRGBToLinear(vec4 c)
    {
        return vec4(SRGBToLinear(c.rgb), c.a);
    }

    vec3 LinearToLogC(vec3 x)
    {
        return 0.244161 * log(5.555556 * x + 0.047996) / log(10.0) + 0.386036;
    }


    vec3 ApplyLut2D(sampler2D samplerTex, vec3 uvw, vec3 scaleOffset)
    {
        uvw.z *= scaleOffset.z;
        float shift = floor(uvw.z);
        uvw.xy = uvw.xy * scaleOffset.z * scaleOffset.xy + scaleOffset.xy * 0.5;
        uvw.x += shift * scaleOffset.y;
        uvw.xyz = mix(texture(samplerTex, uvw.xy).rgb, texture(samplerTex, uvw.xy + vec2(scaleOffset.y, 0.0)).rgb, uvw.z - shift);
        return uvw;
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

    void main()
    {
        vec4 color = texture(_MainTex, v_uv);
       // vec4 lut = texture(u_lut2D, v_uv);
       // vec3 colorLinear = GetLutStripValue(v_uv, u_lut_params);

        if(u_hdr > 0.5)
        {
           color *= u_post_exposure;
           color.rgb = clamp(LinearToLogC(color.rgb), vec3(0.0), vec3(1.0));
           color.rgb = ApplyLut2D(u_lut2D, color.rgb, u_lut_params);
        }
        else{
            color = clamp(color, vec4(0.0), vec4(1.0));
            color.rgb = LinearToSRGB(color.rgb);
            color.rgb = ApplyLut2D(u_lut2D, color.rgb, u_lut_params);
            color = SRGBToLinear(color);
        }
       // color.rgb = pow (color.rgb, vec3(0.4545454, 0.4545454, 0.4545454));
        o_fragColor = color;

    }
]]

ColorGradingShader = ScriptableObject(BaseShader)

function ColorGradingShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("ColorGrading")
        AddPassToMaterial(material, "gles30", kColorGradingVS, kColorGradingFS);
        AddPassToMaterial(material, "gles30", kColorGradingVS, kCGPostProcessFS);
        self.material = material
    end
    return self.material
end