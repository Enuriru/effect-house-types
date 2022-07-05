const kVignetteVS = " \
    \n \
    precision highp float;\n \
    \n \
    attribute vec2 inPosition;\n \
    attribute vec2 inTexCoord;\n \
    varying vec2 v_uv;\n \
    //uniform mat4 u_MVP;\n \
    void main()\n \
    {\n \
        //gl_Position = u_MVP * position;\n \
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);\n \
        v_uv = inTexCoord;\n \
    }\n \
    "

    const kVignetteFS = " \
    \n \
    \n \
    precision highp float;\n \
    \n \
    \n \
    uniform vec4 u_ScreenParams;\n \
    uniform float u_power;\n \
    uniform float u_contrast;\n \
    \n \
    uniform sampler2D _MainTex;\n \
    varying highp vec2 v_uv;\n \
    \n \
    vec4 brightnessContrast(vec4 value, float brightness, float contrast)\n \
    {\n \
        return (value - 0.5) * contrast + 0.5 + brightness;\n \
    } \n \
    \n \
    vec4 Vignette(vec4 inputImage, vec2 uv, vec2 resolution, float falloff, float contrast){\n \
    \n \
        float Falloff = falloff;\n \
        vec2 coord = (uv - 0.5) * (resolution.x/resolution.y) * 2.0;\n \
        float rf = sqrt(dot(coord, coord)) * Falloff;\n \
        float rf2_1 = rf * rf + 1.0;\n \
        float e = 1.0 / (rf2_1 * rf2_1);\n \
        vec4 src = vec4(1.0,1.0,1.0,1.0);\n \
        vec4 vignette = vec4(src.rgb * e, 1.0);\n \
        vec4 adjusted = brightnessContrast(vignette, 0.0, contrast);\n \
        adjusted = clamp(adjusted, 0.0, 1.0);\n \
        return vec4(adjusted) * inputImage;\n \
    }\n \
    \n \
    void main(void)\n \
    {\n \
        vec2 v_texcoord = v_uv;//conversion from another software package\n \
        vec2 resolution = vec2(0.9, 1.6); //conversion from another software package\n \
        // Avoid u_ScreenParam is undefine, for unknown reasons.\n \
        if (u_ScreenParams.z > 1.0)\n \
        {\n \
            resolution.x = u_ScreenParams.x;\n \
            resolution.y = u_ScreenParams.y;\n \
        }\n \
        vec4 background = texture2D(_MainTex, v_texcoord);\n \
        gl_FragColor = Vignette(background, v_texcoord, resolution, u_power, u_contrast);\n \
        \n \
        //gl_FragColor = Vignette(background, v_texcoord, resolution, u_power);\n \
        //gl_FragColor = vec4((u_contrast * 0.1), 0.0, 1.0, 1.0);\n \
    }\n \
    "

exports.kVignetteVS = kVignetteVS
exports.kVignetteFS = kVignetteFS