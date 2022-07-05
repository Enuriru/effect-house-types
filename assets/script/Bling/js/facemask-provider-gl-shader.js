const faceVS = `
precision highp float;

attribute vec3 inPosition;
uniform vec2 u_ScreenParams;
uniform mat4 u_MVP;

varying vec2 v_UV;

void main ()
{
    vec2 pos = vec2(inPosition - 0.5)*2.0;
	gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
	vec2 screenPos = inPosition.xy;
	screenPos.y = 1.0 - screenPos.y;
	screenPos *= u_ScreenParams;
	v_UV = (u_MVP * vec4(screenPos, 0.0, 1.0)).xy;
}
        `;
    
const faceFS = `
precision highp float;

uniform sampler2D u_SegMask;

varying vec2 v_UV;

void main ()
{
	 float weight = texture2D(u_SegMask, v_UV).r;
     if (clamp(v_UV, 0.0, 1.0) != v_UV)
     {
         weight = 0.0;
     }
	gl_FragColor = vec4(vec3(weight), 1.0);
	//gl_FragColor = texture2D(u_SegMask, v_Pos);
}
        `;

exports.faceVS = faceVS;
exports.faceFS = faceFS;