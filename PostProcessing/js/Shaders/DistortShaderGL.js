const kDistortVS = " \
    \n \
    precision highp float;\n \
    \n \
    attribute vec2 inPosition;\n \
    attribute vec2 inTexCoord;\n \
    varying vec2 v_uv;\n \
    //uniform mat4 u_MVP;\n \
    void main() \n \
    { \n \
        //gl_Position = u_MVP * position;\n \
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);\n \
        v_uv = inTexCoord;\n \
    }\n \
    "
    const kDistortFS = "\n \
    \n \
    \n \
    precision highp float;\n \
    \n \
    \n \
    uniform vec4 u_Time; // system variable\n \
    uniform float u_barrelPower;\n \
    uniform float u_rotation;\n \
    uniform float u_zoom;\n \
    uniform float u_maskTiles;\n \
    \n \
    uniform vec2 u_amplitude;\n \
    uniform vec2 u_frequency;\n \
    uniform vec2 u_speed;\n \
    uniform vec2 u_offset;\n \
    \n \
    uniform sampler2D _MainTex;\n \
    uniform sampler2D u_maskA;\n \
    \n \
    varying highp vec2 v_uv;\n \
    \n \
    \n \
    //This applies barrel distort, and it uses uniforms to modify location of center\n \
    vec2 Distort(vec2 uvs, vec2 offset){\n \
        uvs = uvs - offset;\n \
        float theta  = atan(uvs.y, uvs.x) + radians(u_rotation);\n \
        float radius = length(uvs);\n \
        radius = pow(radius, u_barrelPower + 1.0);\n \
        uvs.x = radius * cos(theta) + offset.x;\n \
        uvs.y = radius * sin(theta) + offset.y;\n \
        //uvs = uvs + offset;\n \
        return 0.5 * (uvs + 1.0);\n \
    }\n \
    \n \
    //This zooms the screen\n \
    vec2 Zoom(vec2 uvs, float zoom){\n \
        return (uvs - vec2(0.5, 0.5)) * (1.0 - zoom) + vec2(0.5, 0.5);\n \
    }\n \
    \n \
    //This creates both vertical and horizontal wobble\n \
    vec2 Wobble(vec2 uv, vec2 speed, vec2 frequency, vec2 amplitude){\n \
        if(amplitude.x != 0.0 ){\n \
                uv.x += sin(uv.y * frequency.x + (u_Time.y * speed.x) )/(1.0/amplitude.x);\n \
            }\n \
        if(amplitude.y != 0.0 ){\n \
                uv.y += cos(uv.x * frequency.y + (u_Time.y * speed.y) )/(1.0/amplitude.y);\n \
            }\n \
        return uv;\n \
    }\n \
    \n \
    \n \
    void main(void)\n \
        {\n \
            \n \
            vec2 v_texcoord = v_uv; // conversion from another package\n \
            vec2 inverted = v_texcoord;\n \
            vec2 uv = -1.0 + (2.0 * inverted);\n \
            vec2 distortedUV = Distort(uv, u_offset);\n \
            vec2 scaledUVs = Zoom(distortedUV, u_zoom);\n \
            vec2 wobbleUVs = Wobble(scaledUVs, u_speed, u_frequency, u_amplitude);\n \
            vec4 distorted = texture2D(_MainTex, wobbleUVs);\n \
            //vec4 original = texture2D(_MainTex, inverted);\n \
            //vec4 maskA =  texture2D(u_maskA, inverted * u_maskTiles);\n \
            //gl_FragColor = mix(original, distorted, maskA.r);\n \
            gl_FragColor = distorted;\n \
        }\n \
    "
exports.kDistortVS = kDistortVS
exports.kDistortFS = kDistortFS