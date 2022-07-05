precision highp float;
uniform float u_DirLightNum;
uniform float u_DirLightsEnabled[2];
uniform vec3 u_DirLightsDirection[2];
uniform vec3 u_DirLightsColor[2];
uniform float u_DirLightsIntensity[2];
uniform float u_PointLightNum;
uniform float u_PointLightsEnabled[2];
uniform vec3 u_PointLightsPosition[2];
uniform vec3 u_PointLightsColor[2];
uniform float u_PointLightsIntensity[2];
uniform float u_PointLightsAttenRangeInv[2];
uniform float u_SpotLightNum;
uniform float u_SpotLightsEnabled[2];
uniform vec3 u_SpotLightsDirection[2];
uniform vec3 u_SpotLightsPosition[2];
uniform vec3 u_SpotLightsColor[2];
uniform float u_SpotLightsIntensity[2];
uniform float u_SpotLightsInnerAngleCos[2];
uniform float u_SpotLightsOuterAngleCos[2];
uniform float u_SpotLightsAttenRangeInv[2];
uniform sampler2D u_AlbedoTexture;
uniform float u_Culloff;
uniform sampler2D u_RadianceTex;
uniform sampler2D u_IrradianceTex;
uniform vec4 u_AlbedoColor;
uniform vec4 u_EmissiveColor;
uniform float u_Specular;
uniform float u_Metallic;
uniform float u_Roughness;
uniform float u_Translucency;
uniform float u_UVTilig;
uniform float u_IBLOffset;
uniform float u_IBLIntensity;
uniform vec3 u_WorldSpaceCameraPos;
varying vec3 g_vary_WorldPosition;
varying vec3 g_vary_WorldNormal;
varying vec2 g_vary_uv0;

#ifdef AMAZING_USE_SHADOW
uniform sampler2D u_DirLight0ShadowTexture;
uniform float u_DirLight0ShadowBias;
uniform mat4 u_DirLight0ShadowMatrix;
uniform vec2 u_DirLight0ShadowTextureSize;
uniform float u_DirLight0ShadowStrength;
uniform float u_DirLight0ShadowSoftness;
uniform float u_DirLight0ShadowSoft;
uniform vec2 u_DirLight0ShadowBoundingBoxSize;
uniform float u_DirLight0SelfShadowGradient;

#define SELFSHADOW_COS_MAX 0.00872653549837393496488821397358
#define PI 3.14159
#define SAMPLE_BOX_SIZE 4

float DecodeFloat(const vec4 value)
{
    const vec4 bitSh = vec4(1.0/(256.0*256.0), 1.0/(256.0), 1.0, 0.0);
    return(dot(value, bitSh));
}

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float GetShadowFactor() {
    if (u_DirLightNum < 0.5)
        return 1.0;
    int lightIndex = 0;
    for (int i = 0; i < int(u_DirLightNum); i++) {
        if (u_DirLightsEnabled[i] > 0.0) {
            lightIndex = i;
            break;
        }
    }
    const int sample_size = SAMPLE_BOX_SIZE * SAMPLE_BOX_SIZE;
    float nl = max(dot(g_vary_WorldNormal, -u_DirLightsDirection[lightIndex]), 0.0);
    vec4 proj_pos = u_DirLight0ShadowMatrix * vec4(g_vary_WorldPosition, 1.0);
    vec3 shadow_coord = proj_pos.xyz / proj_pos.w;
    if (shadow_coord.x < 0.0 || shadow_coord.y < 0.0 || shadow_coord.x > 1.0 || shadow_coord.y > 1.0)
        return 1.0;
    shadow_coord.z = clamp(shadow_coord.z, 0.0, 1.0);
    float bias = u_DirLight0ShadowBias + clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001);
    bias = clamp(bias, 0.0, 1.0);
    
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    float shadow_alpha = 0.0;
    vec2 inv_tex_size = vec2(1.0) / (u_DirLight0ShadowBoundingBoxSize * u_DirLight0ShadowTextureSize);
    float inv_num = 1.0 / float(SAMPLE_BOX_SIZE * SAMPLE_BOX_SIZE);
    if (u_DirLight0ShadowSoft > 0.0) {
      for (int i = 0; i < SAMPLE_BOX_SIZE; i++) {
        float float_i = float(i);
        for (int j = 0; j < SAMPLE_BOX_SIZE; j++) {
          float float_j = float(j);
          float jitter_x = rand(shadow_coord.xy + vec2(float_i, float_j));
          float jitter_y = rand(shadow_coord.xy + vec2(float_i * 2.0, float_j * 3.0));
          float r = sqrt(float_i + jitter_x);
          float theta = 2.0 * PI * (float(j) + jitter_y) * inv_num;
                  
          vec4 data = texture2D(u_DirLight0ShadowTexture, shadow_coord.xy + vec2(r * cos(theta), r * sin(theta)) * u_DirLight0ShadowSoftness * inv_tex_size);
          float depth = DecodeFloat(data);
          float noShadow = float(shadow_coord.z <= depth + bias);
          shadow_sum += noShadow;
          shadow_alpha += max(data.a, noShadow);
        }
      }
      shadow_factor = shadow_sum / float(sample_size);
      shadow_alpha /= float(sample_size);
    } else {
      vec4 data = texture2D(u_DirLight0ShadowTexture, shadow_coord.xy);
      float depth = DecodeFloat(data);
      float noShadow = float(shadow_coord.z <= depth + bias);
      shadow_factor = noShadow;
      shadow_alpha = max(data.a, noShadow);
    }
#ifdef AMAZING_USE_SELF_SHADOW
    shadow_factor = min(clamp((nl - SELFSHADOW_COS_MAX) * u_DirLight0SelfShadowGradient, 0.0, 1.0), shadow_factor);
#endif
    if (shadow_factor < 1.0) {
      shadow_factor = mix(1.0, shadow_factor, u_DirLight0ShadowStrength * shadow_alpha);
    }
    
    return shadow_factor;
}
#endif

void main ()
{
  float tmpvar_1[2];
  vec3 tmpvar_2[2];
  vec3 tmpvar_3[2];
  float tmpvar_4[2];
  float tmpvar_5[2];
  vec3 tmpvar_6[2];
  vec3 tmpvar_7[2];
  float tmpvar_8[2];
  float tmpvar_9[2];
  float tmpvar_10[2];
  vec3 tmpvar_11[2];
  vec3 tmpvar_12[2];
  vec3 tmpvar_13[2];
  float tmpvar_14[2];
  float tmpvar_15[2];
  float tmpvar_16[2];
  float tmpvar_17[2];
  lowp vec3 final_color_18;
  vec3 tmpvar_19;
  lowp vec3 tmpvar_20;
  lowp vec3 tmpvar_21;
  lowp float tmpvar_22;
  vec2 tmpvar_23;
  vec3 tmpvar_24;
  tmpvar_24 = normalize(g_vary_WorldNormal);
  tmpvar_23.x = g_vary_uv0.x;
  tmpvar_23.y = (1.0 - g_vary_uv0.y);
  vec3 tmpvar_25;
  tmpvar_25 = normalize((u_WorldSpaceCameraPos.xyz - g_vary_WorldPosition));
  lowp vec4 tmpvar_26;
  tmpvar_26 = texture2D (u_AlbedoTexture, (tmpvar_23 * u_UVTilig));
  tmpvar_21 = (pow (tmpvar_26.xyz, vec3(2.2, 2.2, 2.2)) * u_AlbedoColor.xyz);
  if ((tmpvar_26.w < u_Culloff)) {
    discard;
  };
  tmpvar_22 = (tmpvar_26.w * u_Translucency);
  tmpvar_20 = (tmpvar_21 - (tmpvar_21 * vec3(u_Metallic)));
  lowp vec3 tmpvar_27;
  tmpvar_27 = mix (vec3((0.08 * u_Specular)), tmpvar_21, u_Metallic);
  final_color_18 = vec3(0.0, 0.0, 0.0);
  float tmpvar_28[2];
  float tmpvar_29[2];
  tmpvar_28[0]=tmpvar_1[0];tmpvar_28[1]=tmpvar_1[1];
  tmpvar_29[0]=tmpvar_4[0];tmpvar_29[1]=tmpvar_4[1];
  tmpvar_28[0] = 0.0;
  tmpvar_29[0] = 0.0;
  tmpvar_1[0]=tmpvar_28[0];tmpvar_1[1]=tmpvar_28[1];
  tmpvar_4[0]=tmpvar_29[0];tmpvar_4[1]=tmpvar_29[1];
  highp int tmpvar_30;
  float tmpvar_31[2];
  vec3 tmpvar_32[2];
  vec3 tmpvar_33[2];
  float tmpvar_34[2];
  highp int tmpvar_35;
  float tmpvar_36[2];
  vec3 tmpvar_37[2];
  vec3 tmpvar_38[2];
  float tmpvar_39[2];
  float tmpvar_40[2];
  highp int tmpvar_41;
  float tmpvar_42[2];
  vec3 tmpvar_43[2];
  vec3 tmpvar_44[2];
  vec3 tmpvar_45[2];
  float tmpvar_46[2];
  float tmpvar_47[2];
  float tmpvar_48[2];
  float tmpvar_49[2];
  tmpvar_31[0]=tmpvar_28[0];tmpvar_31[1]=tmpvar_28[1];
  tmpvar_32[0]=tmpvar_2[0];tmpvar_32[1]=tmpvar_2[1];
  tmpvar_33[0]=tmpvar_3[0];tmpvar_33[1]=tmpvar_3[1];
  tmpvar_34[0]=tmpvar_29[0];tmpvar_34[1]=tmpvar_29[1];
  tmpvar_35 = 0;
  tmpvar_36[0]=tmpvar_5[0];tmpvar_36[1]=tmpvar_5[1];
  tmpvar_37[0]=tmpvar_6[0];tmpvar_37[1]=tmpvar_6[1];
  tmpvar_38[0]=tmpvar_7[0];tmpvar_38[1]=tmpvar_7[1];
  tmpvar_39[0]=tmpvar_8[0];tmpvar_39[1]=tmpvar_8[1];
  tmpvar_40[0]=tmpvar_9[0];tmpvar_40[1]=tmpvar_9[1];
  tmpvar_41 = 0;
  tmpvar_42[0]=tmpvar_10[0];tmpvar_42[1]=tmpvar_10[1];
  tmpvar_43[0]=tmpvar_11[0];tmpvar_43[1]=tmpvar_11[1];
  tmpvar_44[0]=tmpvar_12[0];tmpvar_44[1]=tmpvar_12[1];
  tmpvar_45[0]=tmpvar_13[0];tmpvar_45[1]=tmpvar_13[1];
  tmpvar_46[0]=tmpvar_14[0];tmpvar_46[1]=tmpvar_14[1];
  tmpvar_47[0]=tmpvar_15[0];tmpvar_47[1]=tmpvar_15[1];
  tmpvar_48[0]=tmpvar_16[0];tmpvar_48[1]=tmpvar_16[1];
  tmpvar_49[0]=tmpvar_17[0];tmpvar_49[1]=tmpvar_17[1];
  tmpvar_30 = int(clamp (u_DirLightNum, 0.0, 2.0));
  for (highp int i_52 = 0; i_52 < tmpvar_30; i_52++) {
    tmpvar_32[i_52] = normalize(-(u_DirLightsDirection[i_52]));
    tmpvar_33[i_52] = u_DirLightsColor[i_52];
    tmpvar_34[i_52] = u_DirLightsIntensity[i_52];
    tmpvar_31[i_52] = u_DirLightsEnabled[i_52];
  };
  tmpvar_35 = int(clamp (u_PointLightNum, 0.0, 2.0));
  for (highp int i_51 = 0; i_51 < tmpvar_35; i_51++) {
    tmpvar_37[i_51] = u_PointLightsPosition[i_51];
    tmpvar_38[i_51] = u_PointLightsColor[i_51];
    tmpvar_39[i_51] = u_PointLightsIntensity[i_51];
    tmpvar_40[i_51] = u_PointLightsAttenRangeInv[i_51];
    tmpvar_36[i_51] = u_PointLightsEnabled[i_51];
  };
  tmpvar_41 = int(clamp (u_SpotLightNum, 0.0, 2.0));
  for (highp int i_50 = 0; i_50 < tmpvar_41; i_50++) {
    tmpvar_43[i_50] = normalize(-(u_SpotLightsDirection[i_50]));
    tmpvar_44[i_50] = u_SpotLightsPosition[i_50];
    tmpvar_45[i_50] = u_SpotLightsColor[i_50];
    tmpvar_46[i_50] = u_SpotLightsIntensity[i_50];
    tmpvar_47[i_50] = u_SpotLightsInnerAngleCos[i_50];
    tmpvar_48[i_50] = u_SpotLightsOuterAngleCos[i_50];
    tmpvar_49[i_50] = u_SpotLightsAttenRangeInv[i_50];
    tmpvar_42[i_50] = u_SpotLightsEnabled[i_50];
  };
  tmpvar_1[0]=tmpvar_31[0];tmpvar_1[1]=tmpvar_31[1];
  tmpvar_2[0]=tmpvar_32[0];tmpvar_2[1]=tmpvar_32[1];
  tmpvar_3[0]=tmpvar_33[0];tmpvar_3[1]=tmpvar_33[1];
  tmpvar_4[0]=tmpvar_34[0];tmpvar_4[1]=tmpvar_34[1];
  tmpvar_5[0]=tmpvar_36[0];tmpvar_5[1]=tmpvar_36[1];
  tmpvar_6[0]=tmpvar_37[0];tmpvar_6[1]=tmpvar_37[1];
  tmpvar_7[0]=tmpvar_38[0];tmpvar_7[1]=tmpvar_38[1];
  tmpvar_8[0]=tmpvar_39[0];tmpvar_8[1]=tmpvar_39[1];
  tmpvar_9[0]=tmpvar_40[0];tmpvar_9[1]=tmpvar_40[1];
  tmpvar_10[0]=tmpvar_42[0];tmpvar_10[1]=tmpvar_42[1];
  tmpvar_11[0]=tmpvar_43[0];tmpvar_11[1]=tmpvar_43[1];
  tmpvar_12[0]=tmpvar_44[0];tmpvar_12[1]=tmpvar_44[1];
  tmpvar_13[0]=tmpvar_45[0];tmpvar_13[1]=tmpvar_45[1];
  tmpvar_14[0]=tmpvar_46[0];tmpvar_14[1]=tmpvar_46[1];
  tmpvar_15[0]=tmpvar_47[0];tmpvar_15[1]=tmpvar_47[1];
  tmpvar_16[0]=tmpvar_48[0];tmpvar_16[1]=tmpvar_48[1];
  tmpvar_17[0]=tmpvar_49[0];tmpvar_17[1]=tmpvar_49[1];
  lowp vec3 color_53;
  color_53 = vec3(0.0, 0.0, 0.0);
  vec3 tmpvar_54;
  vec3 tmpvar_55;
  vec3 tmpvar_56;
  lowp vec3 tmpvar_57;
  lowp vec3 tmpvar_58;
  float tmpvar_59;
  tmpvar_54 = tmpvar_24;
  tmpvar_55 = tmpvar_25;
  tmpvar_56 = tmpvar_19;
  tmpvar_57 = tmpvar_20;
  tmpvar_58 = tmpvar_27;
  tmpvar_59 = u_Roughness;
  highp int tmpvar_60;
  float tmpvar_61[2];
  vec3 tmpvar_62[2];
  vec3 tmpvar_63[2];
  float tmpvar_64[2];
  tmpvar_60 = tmpvar_30;
  tmpvar_61[0]=tmpvar_31[0];tmpvar_61[1]=tmpvar_31[1];
  tmpvar_62[0]=tmpvar_32[0];tmpvar_62[1]=tmpvar_32[1];
  tmpvar_63[0]=tmpvar_33[0];tmpvar_63[1]=tmpvar_33[1];
  tmpvar_64[0]=tmpvar_34[0];tmpvar_64[1]=tmpvar_34[1];
  lowp vec3 color_66;
  color_66 = vec3(0.0, 0.0, 0.0);
  for (highp int i_65 = 0; i_65 < tmpvar_60; i_65++) {
    tmpvar_56 = tmpvar_62[i_65];
    float tmpvar_67;
    tmpvar_67 = dot (tmpvar_54, tmpvar_56);
    float tmpvar_68;
    tmpvar_68 = dot (tmpvar_54, tmpvar_55);
    float tmpvar_69;
    tmpvar_69 = dot (tmpvar_56, tmpvar_55);
    float tmpvar_70;
    tmpvar_70 = inversesqrt((2.0 + (2.0 * tmpvar_69)));
    float tmpvar_71;
    tmpvar_71 = clamp (((tmpvar_67 + tmpvar_68) * tmpvar_70), 0.0001, 1.0);
    float tmpvar_72;
    tmpvar_72 = clamp (tmpvar_67, 0.0001, 1.0);
    float tmpvar_73;
    tmpvar_73 = clamp ((abs(tmpvar_68) + 1e-05), 0.0001, 1.0);
    float tmpvar_74;
    tmpvar_74 = (tmpvar_59 * tmpvar_59);
    float tmpvar_75;
    tmpvar_75 = (tmpvar_74 * tmpvar_74);
    float tmpvar_76;
    tmpvar_76 = (((
      (tmpvar_71 * tmpvar_75)
     - tmpvar_71) * tmpvar_71) + 1.0);
    float tmpvar_77;
    tmpvar_77 = (tmpvar_59 * tmpvar_59);
    float tmpvar_78;
    tmpvar_78 = pow ((1.0 - clamp (
      (tmpvar_70 + (tmpvar_70 * tmpvar_69))
    , 0.0001, 1.0)), 5.0);
    color_66 = (color_66 + ((
      ((((tmpvar_57 * 0.3183099) + (
        ((tmpvar_75 / ((3.141593 * tmpvar_76) * tmpvar_76)) * (0.5 / ((
          (tmpvar_72 * ((tmpvar_73 * (1.0 - tmpvar_77)) + tmpvar_77))
         + 
          (tmpvar_73 * ((tmpvar_72 * (1.0 - tmpvar_77)) + tmpvar_77))
        ) + 1e-05)))
       * 
        ((clamp ((50.0 * tmpvar_58.y), 0.0, 1.0) * tmpvar_78) + ((1.0 - tmpvar_78) * tmpvar_58))
      )) * tmpvar_72) * tmpvar_64[i_65])
     * tmpvar_63[i_65]) * tmpvar_61[i_65]));
  };
  color_53 = color_66;
  vec3 tmpvar_79;
  vec3 tmpvar_80;
  vec3 tmpvar_81;
  vec3 tmpvar_82;
  lowp vec3 tmpvar_83;
  lowp vec3 tmpvar_84;
  float tmpvar_85;
  tmpvar_79 = g_vary_WorldPosition;
  tmpvar_80 = tmpvar_24;
  tmpvar_81 = tmpvar_25;
  tmpvar_82 = tmpvar_19;
  tmpvar_83 = tmpvar_20;
  tmpvar_84 = tmpvar_27;
  tmpvar_85 = u_Roughness;
  highp int tmpvar_86;
  float tmpvar_87[2];
  vec3 tmpvar_88[2];
  vec3 tmpvar_89[2];
  float tmpvar_90[2];
  float tmpvar_91[2];
  tmpvar_86 = tmpvar_35;
  tmpvar_87[0]=tmpvar_36[0];tmpvar_87[1]=tmpvar_36[1];
  tmpvar_88[0]=tmpvar_37[0];tmpvar_88[1]=tmpvar_37[1];
  tmpvar_89[0]=tmpvar_38[0];tmpvar_89[1]=tmpvar_38[1];
  tmpvar_90[0]=tmpvar_39[0];tmpvar_90[1]=tmpvar_39[1];
  tmpvar_91[0]=tmpvar_40[0];tmpvar_91[1]=tmpvar_40[1];
  lowp vec3 color_93;
  color_93 = vec3(0.0, 0.0, 0.0);
  for (highp int i_92 = 0; i_92 < tmpvar_86; i_92++) {
    vec3 tmpvar_94;
    tmpvar_94 = ((tmpvar_88[i_92] - tmpvar_79) * tmpvar_91[i_92]);
    float tmpvar_95;
    tmpvar_95 = sqrt(dot (tmpvar_94, tmpvar_94));
    tmpvar_82 = (tmpvar_94 / tmpvar_95);
    float tmpvar_96;
    tmpvar_96 = clamp ((1.0 - pow (tmpvar_95, 4.0)), 0.0, 1.0);
    float tmpvar_97;
    tmpvar_97 = dot (tmpvar_80, tmpvar_82);
    float tmpvar_98;
    tmpvar_98 = dot (tmpvar_80, tmpvar_81);
    float tmpvar_99;
    tmpvar_99 = dot (tmpvar_82, tmpvar_81);
    float tmpvar_100;
    tmpvar_100 = inversesqrt((2.0 + (2.0 * tmpvar_99)));
    float tmpvar_101;
    tmpvar_101 = clamp (((tmpvar_97 + tmpvar_98) * tmpvar_100), 0.0001, 1.0);
    float tmpvar_102;
    tmpvar_102 = clamp (tmpvar_97, 0.0001, 1.0);
    float tmpvar_103;
    tmpvar_103 = clamp ((abs(tmpvar_98) + 1e-05), 0.0001, 1.0);
    float tmpvar_104;
    tmpvar_104 = (tmpvar_85 * tmpvar_85);
    float tmpvar_105;
    tmpvar_105 = (tmpvar_104 * tmpvar_104);
    float tmpvar_106;
    tmpvar_106 = (((
      (tmpvar_101 * tmpvar_105)
     - tmpvar_101) * tmpvar_101) + 1.0);
    float tmpvar_107;
    tmpvar_107 = (tmpvar_85 * tmpvar_85);
    float tmpvar_108;
    tmpvar_108 = pow ((1.0 - clamp (
      (tmpvar_100 + (tmpvar_100 * tmpvar_99))
    , 0.0001, 1.0)), 5.0);
    color_93 = (color_93 + ((
      ((((
        (tmpvar_83 * 0.3183099)
       + 
        (((tmpvar_105 / (
          (3.141593 * tmpvar_106)
         * tmpvar_106)) * (0.5 / (
          ((tmpvar_102 * ((tmpvar_103 * 
            (1.0 - tmpvar_107)
          ) + tmpvar_107)) + (tmpvar_103 * ((tmpvar_102 * 
            (1.0 - tmpvar_107)
          ) + tmpvar_107)))
         + 1e-05))) * ((clamp (
          (50.0 * tmpvar_84.y)
        , 0.0, 1.0) * tmpvar_108) + ((1.0 - tmpvar_108) * tmpvar_84)))
      ) * tmpvar_102) * tmpvar_90[i_92]) * tmpvar_89[i_92])
     * 
      ((((
        (tmpvar_96 * tmpvar_96)
       * 3.141593) / 12.56637) * ((tmpvar_95 * tmpvar_95) + 1.0)) * max (0.0, dot (tmpvar_80, tmpvar_82)))
    ) * tmpvar_87[i_92]));
  };
  color_53 = (color_66 + color_93);
  vec3 tmpvar_109;
  vec3 tmpvar_110;
  vec3 tmpvar_111;
  vec3 tmpvar_112;
  lowp vec3 tmpvar_113;
  lowp vec3 tmpvar_114;
  float tmpvar_115;
  tmpvar_109 = g_vary_WorldPosition;
  tmpvar_110 = tmpvar_24;
  tmpvar_111 = tmpvar_25;
  tmpvar_112 = tmpvar_19;
  tmpvar_113 = tmpvar_20;
  tmpvar_114 = tmpvar_27;
  tmpvar_115 = u_Roughness;
  highp int tmpvar_116;
  float tmpvar_117[2];
  vec3 tmpvar_118[2];
  vec3 tmpvar_119[2];
  vec3 tmpvar_120[2];
  float tmpvar_121[2];
  float tmpvar_122[2];
  float tmpvar_123[2];
  float tmpvar_124[2];
  tmpvar_116 = tmpvar_41;
  tmpvar_117[0]=tmpvar_42[0];tmpvar_117[1]=tmpvar_42[1];
  tmpvar_118[0]=tmpvar_43[0];tmpvar_118[1]=tmpvar_43[1];
  tmpvar_119[0]=tmpvar_44[0];tmpvar_119[1]=tmpvar_44[1];
  tmpvar_120[0]=tmpvar_45[0];tmpvar_120[1]=tmpvar_45[1];
  tmpvar_121[0]=tmpvar_46[0];tmpvar_121[1]=tmpvar_46[1];
  tmpvar_122[0]=tmpvar_47[0];tmpvar_122[1]=tmpvar_47[1];
  tmpvar_123[0]=tmpvar_48[0];tmpvar_123[1]=tmpvar_48[1];
  tmpvar_124[0]=tmpvar_49[0];tmpvar_124[1]=tmpvar_49[1];
  lowp vec3 color_126;
  color_126 = vec3(0.0, 0.0, 0.0);
  for (highp int i_125 = 0; i_125 < tmpvar_116; i_125++) {
    vec3 tmpvar_127;
    tmpvar_127 = ((tmpvar_119[i_125] - tmpvar_109) * tmpvar_124[i_125]);
    float tmpvar_128;
    tmpvar_128 = sqrt(dot (tmpvar_127, tmpvar_127));
    tmpvar_112 = (tmpvar_127 / tmpvar_128);
    float edge0_129;
    edge0_129 = tmpvar_123[i_125];
    float tmpvar_130;
    tmpvar_130 = clamp (((
      max (0.0, dot (tmpvar_112, tmpvar_118[i_125]))
     - edge0_129) / (tmpvar_122[i_125] - edge0_129)), 0.0, 1.0);
    float tmpvar_131;
    tmpvar_131 = clamp ((1.0 - pow (tmpvar_128, 4.0)), 0.0, 1.0);
    float tmpvar_132;
    tmpvar_132 = dot (tmpvar_110, tmpvar_112);
    float tmpvar_133;
    tmpvar_133 = dot (tmpvar_110, tmpvar_111);
    float tmpvar_134;
    tmpvar_134 = dot (tmpvar_112, tmpvar_111);
    float tmpvar_135;
    tmpvar_135 = inversesqrt((2.0 + (2.0 * tmpvar_134)));
    float tmpvar_136;
    tmpvar_136 = clamp (((tmpvar_132 + tmpvar_133) * tmpvar_135), 0.0001, 1.0);
    float tmpvar_137;
    tmpvar_137 = clamp (tmpvar_132, 0.0001, 1.0);
    float tmpvar_138;
    tmpvar_138 = clamp ((abs(tmpvar_133) + 1e-05), 0.0001, 1.0);
    float tmpvar_139;
    tmpvar_139 = (tmpvar_115 * tmpvar_115);
    float tmpvar_140;
    tmpvar_140 = (tmpvar_139 * tmpvar_139);
    float tmpvar_141;
    tmpvar_141 = (((
      (tmpvar_136 * tmpvar_140)
     - tmpvar_136) * tmpvar_136) + 1.0);
    float tmpvar_142;
    tmpvar_142 = (tmpvar_115 * tmpvar_115);
    float tmpvar_143;
    tmpvar_143 = pow ((1.0 - clamp (
      (tmpvar_135 + (tmpvar_135 * tmpvar_134))
    , 0.0001, 1.0)), 5.0);
    color_126 = (color_126 + ((
      ((((
        (tmpvar_113 * 0.3183099)
       + 
        (((tmpvar_140 / (
          (3.141593 * tmpvar_141)
         * tmpvar_141)) * (0.5 / (
          ((tmpvar_137 * ((tmpvar_138 * 
            (1.0 - tmpvar_142)
          ) + tmpvar_142)) + (tmpvar_138 * ((tmpvar_137 * 
            (1.0 - tmpvar_142)
          ) + tmpvar_142)))
         + 1e-05))) * ((clamp (
          (50.0 * tmpvar_114.y)
        , 0.0, 1.0) * tmpvar_143) + ((1.0 - tmpvar_143) * tmpvar_114)))
      ) * tmpvar_137) * tmpvar_121[i_125]) * tmpvar_120[i_125])
     * 
      ((((
        ((tmpvar_131 * tmpvar_131) * 3.141593)
       / 12.56637) * (
        (tmpvar_128 * tmpvar_128)
       + 1.0)) * max (0.0, dot (tmpvar_110, tmpvar_112))) * (tmpvar_130 * (tmpvar_130 * (3.0 - 
        (2.0 * tmpvar_130)
      ))))
    ) * tmpvar_117[i_125]));
  };
  color_53 = (color_53 + color_126);
  final_color_18 = (color_53 + u_EmissiveColor.xyz);
  float tmpvar_144;
  float tmpvar_145;
  tmpvar_145 = (min (abs(
    (tmpvar_24.x / tmpvar_24.z)
  ), 1.0) / max (abs(
    (tmpvar_24.x / tmpvar_24.z)
  ), 1.0));
  float tmpvar_146;
  tmpvar_146 = (tmpvar_145 * tmpvar_145);
  tmpvar_146 = (((
    ((((
      ((((-0.01213232 * tmpvar_146) + 0.05368138) * tmpvar_146) - 0.1173503)
     * tmpvar_146) + 0.1938925) * tmpvar_146) - 0.3326756)
   * tmpvar_146) + 0.9999793) * tmpvar_145);
  tmpvar_146 = (tmpvar_146 + (float(
    (abs((tmpvar_24.x / tmpvar_24.z)) > 1.0)
  ) * (
    (tmpvar_146 * -2.0)
   + 1.570796)));
  tmpvar_144 = (tmpvar_146 * sign((tmpvar_24.x / tmpvar_24.z)));
  if ((abs(tmpvar_24.z) > (1e-08 * abs(tmpvar_24.x)))) {
    if ((tmpvar_24.z < 0.0)) {
      if ((tmpvar_24.x >= 0.0)) {
        tmpvar_144 += 3.141593;
      } else {
        tmpvar_144 = (tmpvar_144 - 3.141593);
      };
    };
  } else {
    tmpvar_144 = (sign(tmpvar_24.x) * 1.570796);
  };
  vec2 tmpvar_147;
  tmpvar_147.x = (((tmpvar_144 / 3.141593) + 1.0) * 0.5);
  tmpvar_147.y = ((1.570796 - (
    sign(tmpvar_24.y)
   * 
    (1.570796 - (sqrt((1.0 - 
      abs(tmpvar_24.y)
    )) * (1.570796 + (
      abs(tmpvar_24.y)
     * 
      (-0.2146018 + (abs(tmpvar_24.y) * (0.08656672 + (
        abs(tmpvar_24.y)
       * -0.03102955))))
    ))))
  )) / 3.141593);
  vec2 tmpvar_148;
  tmpvar_148.x = (float(mod ((tmpvar_147.x + u_IBLOffset), 1.0)));
  tmpvar_148.y = tmpvar_147.y;
  lowp vec4 tmpvar_149;
  tmpvar_149 = texture2D (u_IrradianceTex, tmpvar_148);
  lowp vec3 tmpvar_150;
  tmpvar_150 = (tmpvar_149.xyz * exp2((
    (tmpvar_149.w * 255.0)
   - 128.0)));
  vec2 coord_151;
  vec3 I_152;
  I_152 = -(tmpvar_25);
  vec3 tmpvar_153;
  tmpvar_153 = normalize((I_152 - (2.0 * 
    (dot (tmpvar_24, I_152) * tmpvar_24)
  )));
  float tmpvar_154;
  float tmpvar_155;
  tmpvar_155 = (min (abs(
    (tmpvar_153.x / tmpvar_153.z)
  ), 1.0) / max (abs(
    (tmpvar_153.x / tmpvar_153.z)
  ), 1.0));
  float tmpvar_156;
  tmpvar_156 = (tmpvar_155 * tmpvar_155);
  tmpvar_156 = (((
    ((((
      ((((-0.01213232 * tmpvar_156) + 0.05368138) * tmpvar_156) - 0.1173503)
     * tmpvar_156) + 0.1938925) * tmpvar_156) - 0.3326756)
   * tmpvar_156) + 0.9999793) * tmpvar_155);
  tmpvar_156 = (tmpvar_156 + (float(
    (abs((tmpvar_153.x / tmpvar_153.z)) > 1.0)
  ) * (
    (tmpvar_156 * -2.0)
   + 1.570796)));
  tmpvar_154 = (tmpvar_156 * sign((tmpvar_153.x / tmpvar_153.z)));
  if ((abs(tmpvar_153.z) > (1e-08 * abs(tmpvar_153.x)))) {
    if ((tmpvar_153.z < 0.0)) {
      if ((tmpvar_153.x >= 0.0)) {
        tmpvar_154 += 3.141593;
      } else {
        tmpvar_154 = (tmpvar_154 - 3.141593);
      };
    };
  } else {
    tmpvar_154 = (sign(tmpvar_153.x) * 1.570796);
  };
  vec2 tmpvar_157;
  tmpvar_157.x = (((tmpvar_154 / 3.141593) + 1.0) * 0.5);
  tmpvar_157.y = ((1.570796 - (
    sign(tmpvar_153.y)
   * 
    (1.570796 - (sqrt((1.0 - 
      abs(tmpvar_153.y)
    )) * (1.570796 + (
      abs(tmpvar_153.y)
     * 
      (-0.2146018 + (abs(tmpvar_153.y) * (0.08656672 + (
        abs(tmpvar_153.y)
       * -0.03102955))))
    ))))
  )) / 3.141593);
  float tmpvar_158;
  tmpvar_158 = (u_Roughness * 6.99);
  float tmpvar_159;
  tmpvar_159 = floor(tmpvar_158);
  float tmpvar_160;
  tmpvar_160 = exp2(tmpvar_159);
  float tmpvar_161;
  tmpvar_161 = (tmpvar_160 * 2.0);
  coord_151.x = ((float(mod ((tmpvar_157.x + u_IBLOffset), 1.0))) / tmpvar_160);
  coord_151.y = (((tmpvar_157.y / tmpvar_161) + 1.0) - (1.0/(tmpvar_160)));
  lowp vec4 tmpvar_162;
  tmpvar_162 = texture2D (u_RadianceTex, coord_151);
  coord_151.x = ((float(mod ((tmpvar_157.x + u_IBLOffset), 1.0))) / tmpvar_161);
  coord_151.y = (((tmpvar_157.y / 
    (tmpvar_161 * 2.0)
  ) + 1.0) - (1.0/(tmpvar_161)));
  lowp vec4 tmpvar_163;
  tmpvar_163 = texture2D (u_RadianceTex, coord_151);
  float tmpvar_164;
  tmpvar_164 = clamp (1.0, 0.0, 1.0);
  final_color_18 = (final_color_18 + ((tmpvar_150 * tmpvar_20) * max (vec3(1.0, 1.0, 1.0), 
    ((((2.0404 * tmpvar_20) - 0.3324) + ((-4.7951 * tmpvar_20) + 0.6417)) + ((2.7552 * tmpvar_20) + 0.6903))
  )));
  vec4 tmpvar_165;
  tmpvar_165 = ((u_Roughness * vec4(-1.0, -0.0275, -0.572, 0.022)) + vec4(1.0, 0.0425, 1.0, -0.04));
  vec2 tmpvar_166;
  tmpvar_166 = ((vec2(-1.04, 1.04) * (
    (min ((tmpvar_165.x * tmpvar_165.x), exp2((-9.28 * 
      max (dot (tmpvar_24, tmpvar_25), 0.0)
    ))) * tmpvar_165.x)
   + tmpvar_165.y)) + tmpvar_165.zw);
  final_color_18 = (final_color_18 + ((
    (mix ((tmpvar_162.xyz * exp2(
      ((tmpvar_162.w * 255.0) - 128.0)
    )), (tmpvar_163.xyz * exp2(
      ((tmpvar_163.w * 255.0) - 128.0)
    )), (tmpvar_158 - tmpvar_159)) * (tmpvar_164 * tmpvar_164))
   * 
    ((tmpvar_27 * tmpvar_166.x) + tmpvar_166.y)
  ) * max (vec3(1.0, 1.0, 1.0), 
    ((((2.0404 * tmpvar_27) - 0.3324) + ((-4.7951 * tmpvar_27) + 0.6417)) + ((2.7552 * tmpvar_27) + 0.6903))
  )));
  lowp vec3 tmpvar_167;
  lowp vec3 color_168;
  color_168 = (final_color_18 * u_IBLIntensity);
  tmpvar_167 = ((color_168 * (
    (2.51 * color_168)
   + 0.03)) / ((color_168 * 
    ((2.43 * color_168) + 0.59)
  ) + 0.14));
  final_color_18 = tmpvar_167;
  lowp vec4 tmpvar_169;
  tmpvar_169.xyz = tmpvar_167;
  tmpvar_169.w = tmpvar_22;
  mediump vec4 tmpvar_170;
  lowp vec4 color_171;
  color_171.w = tmpvar_169.w;
  color_171.xyz = pow (tmpvar_167, vec3(0.4545454, 0.4545454, 0.4545454));
  color_171.xyz = clamp (color_171.xyz, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
  tmpvar_170 = color_171;
#ifdef AMAZING_USE_SHADOW
  gl_FragColor = vec4(tmpvar_170.xyz * GetShadowFactor(), tmpvar_170.a);
#else
  gl_FragColor = tmpvar_170;
#endif
}

