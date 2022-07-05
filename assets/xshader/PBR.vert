precision highp float;
attribute vec3 attPosition;
attribute vec3 attNormal;
attribute vec2 attUV;

#define AMAZING_USE_NORMAL_TEXTURE

#ifdef AMAZING_USE_NORMAL_TEXTURE
attribute vec3 attTangent;
attribute vec3 attBinormal;
#endif

#ifdef AMAZING_USE_BONES
attribute vec4 attBoneIds;
attribute vec4 attWeights;
const int MAX_BONES = 50;
uniform mat4 u_Palatte[MAX_BONES];
#endif

uniform mat4 u_Model;
uniform mat4 u_MVP;
uniform mat4 u_TransposeInvModel;
varying vec3 g_vary_WorldPosition;
varying vec3 g_vary_WorldNormal;
varying vec2 g_vary_uv0;

#ifdef AMAZING_USE_NORMAL_TEXTURE
varying vec3 g_vary_WorldTangent;
varying vec3 g_vary_WorldBinormal;
#endif

void main ()
{
    vec4 homogeneous_pos = vec4(attPosition, 1.0);
    g_vary_uv0 = attUV;

#ifdef AMAZING_USE_BONES
    mat4 boneTransform  = u_Palatte[int(attBoneIds.x)] * attWeights.x;
         boneTransform += u_Palatte[int(attBoneIds.y)] * attWeights.y;
         boneTransform += u_Palatte[int(attBoneIds.z)] * attWeights.z;
         boneTransform += u_Palatte[int(attBoneIds.w)] * attWeights.w;
    g_vary_WorldPosition = (boneTransform * homogeneous_pos).xyz;
    g_vary_WorldNormal = (boneTransform * vec4(attNormal, 0.0)).xyz;
#ifdef AMAZING_USE_NORMAL_TEXTURE
    g_vary_WorldTangent = (boneTransform * vec4(attTangent, 0.0)).xyz;
    g_vary_WorldBinormal = (boneTransform * vec4(attBinormal, 0.0)).xyz;
#endif
    gl_Position = u_MVP * boneTransform * homogeneous_pos;
#else
    g_vary_WorldPosition = (u_Model * homogeneous_pos).xyz;
    g_vary_WorldNormal = (u_TransposeInvModel * vec4(attNormal, 0.0)).xyz;
#ifdef AMAZING_USE_NORMAL_TEXTURE
    g_vary_WorldTangent = (u_TransposeInvModel * vec4(attTangent, 0.0)).xyz;
    g_vary_WorldBinormal = (u_TransposeInvModel * vec4(attBinormal, 0.0)).xyz;
#endif
    gl_Position = u_MVP * homogeneous_pos;
#endif
}
