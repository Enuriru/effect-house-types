const full_screen_quad_vert = "\
    attribute vec3 inPosition;\n \
    attribute vec2 inTexCoord;\n \
    \n \
    varying vec2 uv;\n \
\n \
    void main () {\n \
        gl_Position = vec4(inPosition, 1.0);\n \
        uv = inTexCoord;\n \
    }\n \
";

const spectral_lut_baker = "\n \
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
\n \
    varying vec2 uv;\n \
\n \
    uniform sampler2D _MainTex;\n \
\n \
    void main () {\n \
        if (uv.x < 1.0 / 3.0) \n \
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n \
        else if (uv.x > 2.0 / 3.0) \n \
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n \
        else \n \
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n \
    }\n \
";

const chromatic_aberration = " \
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
\n \
    varying vec2 uv;\n \
\n \
    uniform sampler2D _MainTex;\n \
\n \
    uniform vec4 u_FastModeAndIntensityAndRTSize;\n \
    uniform sampler2D u_SpectralLUT;\n \
\n \
    #define MAX_CHROMATIC_SAMPLES 16.0\n \
\n \
    void main() {\n \
        if (u_FastModeAndIntensityAndRTSize.x < 0.5) {\n \
            vec2 coords = uv * 2.0 - 1.0;\n \
\n \
            // !!!!!!!!!!!!!!!\n \
            // coords = coords - vec2(1.0, 1.0); // this line is only for demo !!!!!!!!!!!!!!\n \
            // !!!!!!!!!!!!!!!\n \
            \n \
            vec2 end = uv - coords * dot (coords, coords) * u_FastModeAndIntensityAndRTSize.y;\n \
\n \
            vec2 diff = end - uv;\n \
            float samples = float(int(clamp(length(u_FastModeAndIntensityAndRTSize.zw * diff * 0.5), 3.0, MAX_CHROMATIC_SAMPLES)));\n \
\n \
            vec2 delta = diff / samples;\n \
            vec2 pos = uv;\n \
\n \
            vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);\n \
            vec4 filterSum = vec4(0.0, 0.0, 0.0, 0.0);\n \
\n \
            for (int i = 0; i < int(samples); ++i) {\n \
                float t = (float(i) + 0.5) / samples;\n \
\n \
                vec4 s = texture2D(_MainTex, pos);\n \
                vec4 filter = vec4(texture2D(u_SpectralLUT, vec2(t, 0.0)).rgb, 1.0);\n \
\n \
                sum += s * filter;\n \
                filterSum += filter;\n \
                pos += delta;\n \
            }\n \
\n \
            gl_FragColor = sum / filterSum;\n \
        }\n \
        else {\n \
            vec2 coords = uv * 2.0 - 1.0;\n \
            vec2 end = uv - coords * dot (coords, coords) * u_FastModeAndIntensityAndRTSize.y;\n \
\n \
            vec2 delta = (end - uv) / 3.0;\n \
\n \
            vec4 filterA = vec4(texture2D(u_SpectralLUT, vec2(0.5 / 3.0, 0.0)).rgb, 1.0);\n \
            vec4 filterB = vec4(texture2D(u_SpectralLUT, vec2(1.5 / 3.0, 0.0)).rgb, 1.0);\n \
            vec4 filterC = vec4(texture2D(u_SpectralLUT, vec2(2.5 / 3.0, 0.0)).rgb, 1.0);\n \
\n \
            vec4 texelA = texture2D(_MainTex, uv);\n \
            vec4 texelB = texture2D(_MainTex, uv + delta);\n \
            vec4 texelC = texture2D(_MainTex, uv + delta + delta);\n \
\n \
            vec4 sum = texelA * filterA + texelB * filterB + texelC * filterC;\n \
            vec4 filterSum = filterA + filterB + filterC;\n \
            gl_FragColor = sum / filterSum;\n \
        }\n \
    }\n \
";

const blend_layer = " \
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
\n \
    varying vec2 uv;\n \
\n \
    uniform sampler2D _MainTex; // after aberration\n \
\n \
    uniform sampler2D _Background;\n \
\n \
    void main() {\n \
        vec4 src = texture2D(_MainTex, uv);\n \
        vec4 dst = texture2D(_Background, uv);\n \
        gl_FragColor = vec4(src.rgb + dst.rgb * (1.0 - src.a), 1.0);\n \
    }\n \
";

exports.full_screen_quad_vert = full_screen_quad_vert
exports.spectral_lut_baker = spectral_lut_baker
exports.chromatic_aberration = chromatic_aberration
exports.blend_layer = blend_layer