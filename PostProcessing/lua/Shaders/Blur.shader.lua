kDefaultVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]

kBlurFS = [[
#version 300 es
precision highp float;    
in vec2 uv;
uniform sampler2D _MainTex;
layout(location = 0) out vec4 o_fragColor;
uniform vec4 u_maintex_texel_size;
uniform vec2 u_blur_direction;

void main()
{
    vec4 c;
    c += texture(_MainTex, uv + (u_maintex_texel_size.xy * u_blur_direction *0.75))*126.0;
    c += texture(_MainTex, uv + (u_maintex_texel_size.xy * u_blur_direction *2.25))*84.0;
    c += texture(_MainTex, uv + (u_maintex_texel_size.xy * u_blur_direction *3.75))*36.0;
    c += texture(_MainTex, uv + (u_maintex_texel_size.xy * u_blur_direction *5.25))*9.0;
    c += texture(_MainTex, uv + (u_maintex_texel_size.xy * u_blur_direction *6.75))*1.0;
    
    c += texture(_MainTex, uv - (u_maintex_texel_size.xy * u_blur_direction *0.75))*126.0;
    c += texture(_MainTex, uv - (u_maintex_texel_size.xy * u_blur_direction *2.25))*84.0;
    c += texture(_MainTex, uv - (u_maintex_texel_size.xy * u_blur_direction *3.75))*36.0;
    c += texture(_MainTex, uv - (u_maintex_texel_size.xy * u_blur_direction *5.25))*9.0;
    c += texture(_MainTex, uv - (u_maintex_texel_size.xy * u_blur_direction *6.75))*1.0;
    
    
    o_fragColor = c/512.0;
}
]]

BlurShader = ScriptableObject(BaseShader)


function BlurShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("Blur")
        --  SSR Pass
        AddPassToMaterial(material, "gles30", kDefaultVS, kBlurFS)
        self.material = material
    end
    return self.material
end