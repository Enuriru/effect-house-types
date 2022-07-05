kMotionBlurVS = [[
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
    

kMotionBlurFS = [[
    precision highp float;
    varying highp vec2 uv0;
    uniform sampler2D _MainTex;
    uniform sampler2D prevTex;
    uniform float alpha;
    void main()
    {
        vec4 CurrColor = texture2D(_MainTex, uv0);
        vec4 PrevColor = texture2D(prevTex, uv0);
        vec3 color = CurrColor.rgb * alpha + PrevColor.rgb * (1.0 - alpha);
        gl_FragColor = vec4(color, 1.0);
        //gl_FragColor = PrevColor;
    }
    
]]

MotionBlurShader = ScriptableObject(BaseShader)

function MotionBlurShader : getMaterial() 
    if self.material == nil then
        local material = CreateEmptyMaterial("MotionBlur")
        -- MotionBlur Pass
        AddPassToMaterial(material, "gles2", kMotionBlurVS, kMotionBlurFS)
        self.material = material
    end
    return self.material
end
