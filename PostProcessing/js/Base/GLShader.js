const kGenMaskVS = "\
    attribute vec3 inPosition; \n \
    attribute vec2 inTexCoord; \n \
    varying vec2 uv; \n \
    void main() { \n \
        gl_Position = vec4(inPosition, 1.0); \n \
        uv = inTexCoord; \n \
    }"
    
const kGenMaskFS = "\
#ifdef GL_ES\n \
precision mediump float; \n \
#endif \n \
varying vec2 uv; \n \
uniform sampler2D _MainTex; \n \
\n \
void main() \n \
{ \n \
    gl_FragColor = texture2D(_MainTex, uv); \n \
}\n"

const kBlendBackGroudFS = "\
#ifdef GL_ES \n \
precision mediump float; \n \
#endif \n \
varying vec2 uv; \n \
uniform sampler2D _MainTex; \n \
uniform sampler2D backgroudTexture; \n \
void main() \n \
{ \n \
    vec3 bgColor = texture2D(backgroudTexture, uv).rgb; \n \
    vec4 fgColor = texture2D(_MainTex, uv); \n \
    gl_FragColor = vec4(bgColor * (1.0 - fgColor.a) + fgColor.rgb, fgColor.a); \n \
} "

exports.kGenMaskVS = kGenMaskVS
exports.kGenMaskFS = kGenMaskFS
exports.kBlendBackGroudFS = kBlendBackGroudFS