kFogVS = [[
    precision highp float;
    attribute vec2 inPosition;
    attribute vec2 inTexCoord;
    varying vec2 uv0;
    void main() 
    { 
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);
        uv0 = inTexCoord;
    }
    
    ]]
    

kFogFS = [[
    precision highp float;
    varying highp vec2 uv0;
    uniform sampler2D _MainTex;
    uniform sampler2D depthTex;
    uniform vec4 u_ProjectionParams;
    uniform vec2 FogParams;
    uniform vec4 fogColor;
    float LinearizeDepth(float depth, float near, float far) 
    {
        float z = depth * 2.0 - 1.0; // back to NDC 
        float zeye = (2.0 * near * far) / (far + near - z * (far - near));    
        return zeye;
    }
    void main()
    {
        vec4 bgColor = texture2D(_MainTex, uv0);
        float depthValue = texture2D(depthTex, uv0).r;
        float linearDepth = LinearizeDepth(depthValue, u_ProjectionParams.y, u_ProjectionParams.z);
        // compute fog distance 
        float dist = linearDepth - u_ProjectionParams.y;
        // compute fog 
        float fog = clamp((FogParams.y - dist) / (FogParams.y - FogParams.x), 0.0, 1.0);
        vec4 color = mix(fogColor, bgColor, fog);
        gl_FragColor = color;
    }
    
]]

FogShader = ScriptableObject(BaseShader)

function FogShader : getMaterial() 
    if self.material == nil then
        local material = CreateEmptyMaterial("Fog")
        -- Fog Pass
        AddPassToMaterial(material, "gles2", kFogVS, kFogFS)
        self.material = material
        self.material:setVec2("FogParams", Amaz.Vector2f(1.0, 20.0))
        self.material:setVec4("fogColor", Amaz.Vector4f(0.0, 0.0, 0.0, 0.0))
    end
    return self.material
end
