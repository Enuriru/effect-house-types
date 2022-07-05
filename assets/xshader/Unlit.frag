precision highp float;
uniform sampler2D u_AlbedoTexture;
uniform vec4 u_AlbedoColor;
uniform float u_UVTilig;
uniform float u_Translucency;
varying vec2 g_vary_uv0;
void main ()
{
  vec2 uv_1;
  uv_1.x = g_vary_uv0.x;
  uv_1.y = (1.0 - g_vary_uv0.y);
  lowp vec4 tmpvar_2;
  tmpvar_2 = texture2D (u_AlbedoTexture, (uv_1 * u_UVTilig));
  lowp vec3 tmpvar_3;
  tmpvar_3 = (tmpvar_2.xyz * u_AlbedoColor.xyz);
  lowp float tmpvar_4;
  tmpvar_4 = (tmpvar_2.w * u_Translucency);
  mediump vec4 tmpvar_5;
  tmpvar_5.xyz = tmpvar_3;
  tmpvar_5.w = tmpvar_4;
  gl_FragColor = tmpvar_5;
}

