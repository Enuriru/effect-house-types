const kGrainVS = " \
    \n \
    precision highp float;\n \
    \n \
    attribute vec2 inPosition;\n \
    attribute vec2 inTexCoord;\n \
    varying vec2 v_uv;\n \
    \n \
    void main()\n \
    {\n \
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);\n \
        v_uv = inTexCoord;\n \
    }\n \
    "
    const kGrainFS = " \
    \n \
    \n \
    precision highp float;\n \
    \n \
    uniform vec4 u_ScreenParams;\n \
    \n \
    uniform vec4 u_Time; // system variable\n \
    uniform float u_strength;\n \
    uniform float u_color;\n \
    uniform float u_speed;\n \
    \n \
    uniform sampler2D _MainTex;\n \
    varying highp vec2 v_uv;\n \
    \n \
    \n \
    vec3 soft_light(vec3 a, vec3 b, float w) {\n \
        return mix(a, pow(a, pow(vec3(2.0), 2.0 * (vec3(0.5) - b))), w);\n \
    }\n \
    \n \
    float NoiseColor(in vec2 xy, in float seed){\n \
        return fract(tan(distance(xy * 1.618033, xy) * seed) * xy.x);\n \
    }\n \
    \n \
    vec3 BlackAndWhite(vec3 inputImage){\n \
        float luminance = inputImage.r * 0.299 + inputImage.g * 0.587 + inputImage.b * 0.114;\n \
        return vec3(luminance);\n \
    }\n \
    \n \
    vec3 brightnessContrast(vec3 value, float brightness, float contrast){\n \
        return (value - 0.5) * contrast + 0.5 + brightness;\n \
    }\n \
    \n \
    void main(void)\n \
    {\n \
        float time = u_Time.y;\n \
        vec2 xy = v_uv;\n \
        float speed = u_speed * 0.000001;\n \
        float fractional = fract(time) * speed;\n \
    \n \
        vec3 noiseColor = vec3(\n \
                NoiseColor(xy * 1000.0, fractional + 1.0), // R\n \
                NoiseColor(xy * 1000.0, fractional + 2.0), // G\n \
                NoiseColor(xy * 1000.0, fractional + 3.0) // B\n \
                );\n \
    \n \
        noiseColor = clamp(noiseColor, 0.0, 1.0);\n \
        vec3 noiseBW = vec3(BlackAndWhite(noiseColor.rgb));\n \
        vec3 noise = mix(noiseBW, noiseColor, u_color);\n \
        vec3 backgroundImage = texture2D(_MainTex, v_uv).rgb;\n \
        vec3 softLightImage = soft_light(backgroundImage.rgb, noise, u_strength);\n \
        gl_FragColor = vec4(softLightImage, 1.0);\n \
    \n \
        //gl_FragColor = vec4(u_strength, sin(time), u_speed * 0.1, 1.0);//test variables\n \
    }\n \
    "
exports.kGrainVS = kGrainVS
exports.kGrainFS = kGrainFS