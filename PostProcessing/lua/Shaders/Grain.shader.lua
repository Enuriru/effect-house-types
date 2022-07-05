kGrainVS = [[

    precision highp float;

    attribute vec2 inPosition;
    attribute vec2 inTexCoord;
    varying vec2 v_uv;

    void main()
    {
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);
        v_uv = inTexCoord;
    }

    ]]


kGrainFS = [[


precision highp float;

uniform vec4 u_ScreenParams;

uniform vec4 u_Time; // system variable
uniform float u_strength;
uniform float u_color;
uniform float u_speed;

uniform sampler2D _MainTex;
varying highp vec2 v_uv;


vec3 soft_light(vec3 a, vec3 b, float w) {
    return mix(a, pow(a, pow(vec3(2.0), 2.0 * (vec3(0.5) - b))), w);
}

float NoiseColor(in vec2 xy, in float seed){
    return fract(tan(distance(xy * 1.618033, xy) * seed) * xy.x);
}

vec3 BlackAndWhite(vec3 inputImage){
    float luminance = inputImage.r * 0.299 + inputImage.g * 0.587 + inputImage.b * 0.114;
    return vec3(luminance);
}

vec3 brightnessContrast(vec3 value, float brightness, float contrast){
    return (value - 0.5) * contrast + 0.5 + brightness;
}

void main(void)
    {
        float time = u_Time.y;
        vec2 xy = v_uv;
        float speed = u_speed * 0.000001;
        float fractional = fract(time) * speed;

        vec3 noiseColor = vec3(
                NoiseColor(xy * 1000.0, fractional + 1.0), // R
                NoiseColor(xy * 1000.0, fractional + 2.0), // G
                NoiseColor(xy * 1000.0, fractional + 3.0) // B
                );

        noiseColor = clamp(noiseColor, 0.0, 1.0);
        vec3 noiseBW = vec3(BlackAndWhite(noiseColor.rgb));
        vec3 noise = mix(noiseBW, noiseColor, u_color);
        vec3 backgroundImage = texture2D(_MainTex, v_uv).rgb;
        vec3 softLightImage = soft_light(backgroundImage.rgb, noise, u_strength);
        gl_FragColor = vec4(softLightImage, 1.0);

        //gl_FragColor = vec4(u_strength, sin(time), u_speed * 0.1, 1.0);//test variables
    }
]]

GrainShader = ScriptableObject(BaseShader)

function GrainShader : getMaterial()
    if self.material == nil then
        local material = CreateEmptyMaterial("Grain")
        -- Grain Pass
        AddPassToMaterial(material, "gles30", kGrainVS, kGrainFS)
        self.material = material
    end
    return self.material
end
