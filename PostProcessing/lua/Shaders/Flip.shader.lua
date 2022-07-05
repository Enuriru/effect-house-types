kFlipVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]

kFlipFS = [[
#version 300 es
precision highp float;    
in vec2 uv;
uniform sampler2D _MainTex;
layout(location = 0) out vec4 o_fragColor;


void main()
{
    o_fragColor = texture(_MainTex, vec2(uv.x, 1.0 - uv.y));
}
]]

FlipShader = ScriptableObject(BaseShader)


function FlipShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("Flip")
        --  Flip Pass
        AddPassToMaterial(material, "gles30", kFlipVS, kFlipFS)
        self.material = material
    end
    return self.material
end