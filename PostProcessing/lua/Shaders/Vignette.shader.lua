kVignetteVS = [[

    precision highp float;

    attribute vec2 inPosition;
    attribute vec2 inTexCoord;
    varying vec2 v_uv;
    //uniform mat4 u_MVP;
    void main()
    {
        //gl_Position = u_MVP * position;
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);
        v_uv = inTexCoord;
    }

    ]]


kVignetteFS = [[


precision highp float;


uniform vec4 u_ScreenParams;
uniform float u_power;
uniform float u_contrast;

uniform sampler2D _MainTex;
varying highp vec2 v_uv;

vec4 brightnessContrast(vec4 value, float brightness, float contrast)
{
    return (value - 0.5) * contrast + 0.5 + brightness;
} 

vec4 Vignette(vec4 inputImage, vec2 uv, vec2 resolution, float falloff, float contrast){
    
    float Falloff = falloff;
    vec2 coord = (uv - 0.5) * (resolution.x/resolution.y) * 2.0;
    float rf = sqrt(dot(coord, coord)) * Falloff;
    float rf2_1 = rf * rf + 1.0;
    float e = 1.0 / (rf2_1 * rf2_1);
    vec4 src = vec4(1.0,1.0,1.0,1.0);
    vec4 vignette = vec4(src.rgb * e, 1.0);
    vec4 adjusted = brightnessContrast(vignette, 0.0, contrast);
    adjusted = clamp(adjusted, 0.0, 1.0);
    return vec4(adjusted) * inputImage;
}

void main(void)
    {
        vec2 v_texcoord = v_uv;//conversion from another software package
        vec2 resolution; //conversion from another software package
        resolution.x = u_ScreenParams.x;
        resolution.y = u_ScreenParams.y;
        vec4 background = texture2D(_MainTex, v_texcoord);
        gl_FragColor = Vignette(background, v_texcoord, resolution, u_power, u_contrast);
        
        //gl_FragColor = Vignette(background, v_texcoord, resolution, u_power);
        //gl_FragColor = vec4((u_contrast * 0.1), 0.0, 1.0, 1.0);
    }
]]

VignetteShader = ScriptableObject(BaseShader)

function VignetteShader : getMaterial()
    if self.material == nil then
        local material = CreateEmptyMaterial("Vignette")
        -- Vignette Pass
        AddPassToMaterial(material, "gles30", kVignetteVS, kVignetteFS)
        self.material = material
    end
    return self.material
end
