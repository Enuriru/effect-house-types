kLightShaftsVS = [[

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
    

kLightShaftsDownsampleFS = [[


precision highp float;

uniform sampler2D _MainTex;
varying highp vec2 v_uv;

uniform vec4      UVMinMax;
uniform vec4 LightShaftParameters;
uniform float BloomMaxBrightness;
uniform vec4 BloomTintAndThreshold;
uniform vec2 TextureSpaceBlurOrigin;
uniform vec4 AspectRatioAndInvAspectRatio; 



uniform sampler2D u_depth_tex;
uniform float u_one_over_depthscale;
uniform vec4 u_ProjectionParams;

float linear01Depth(float z)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    float zc0 = (1.0 - far/near)/2.0;
    float zc1 = (1.0 + far/near)/2.0;
    return 1.0/(zc0 * z + zc1);
}

float linear02Depth(float z)
{
    float ndc = z * 2.0 - 1.0;
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    return ((2.0 * near * far) /(far + near - ndc * (far -near)))/far;
}

float linearEyeDepth(float z)
{
    float near = u_ProjectionParams.y;
    float far = u_ProjectionParams.z;
    float zc0 = (1.0 - far/near)/2.0;
    float zc1 = (1.0 + far/near)/2.0;
    
    float zc2 = zc0/far;
    float zc3 = zc1/far;

    return 1.0 / (zc2 * z + zc3);
}


float SampleDepth(vec2 screenPos)
{
    vec2 uv = screenPos;

        return texture2D(u_depth_tex, uv).r;

}
void main(void)
    {
        #ifdef OCCLUSION_TERM

        
                float depth  =SampleDepth(v_uv);
                depth = linear01Depth(depth);
                float SceneDepth = depth * u_ProjectionParams.z;

                vec2 NormalizedCoordinates = (v_uv - UVMinMax.xy) / UVMinMax.zw;
                float EdgeMask = 1.0 - NormalizedCoordinates.x * (1.0 - NormalizedCoordinates.x) * NormalizedCoordinates.y * (1.0 - NormalizedCoordinates.y) * 8.0;
                EdgeMask = EdgeMask * EdgeMask * EdgeMask * EdgeMask;

                float InvOcclusionDepthRange = LightShaftParameters.x;
                float OcclusionMask = clamp(SceneDepth * InvOcclusionDepthRange,0.0,1.0);
                float occlusion = max(OcclusionMask, EdgeMask);
                gl_FragColor = vec4(occlusion,occlusion,occlusion,1.0);

        #else

                vec4 outCol = vec4(1.0,1.0,1.0,1.0);

                vec2 InUV = v_uv - 0.5;
                InUV = InUV * AspectRatioAndInvAspectRatio.zw;
                InUV = InUV+0.5;
                vec3 SceneColor = texture2D(_MainTex,v_uv).xyz;
        
                float depth  =SampleDepth(v_uv);
                depth = linear01Depth(depth);
                float SceneDepth = depth * u_ProjectionParams.z;
        
        
                vec2 NormalizedCoordinates = (v_uv - UVMinMax.xy) / UVMinMax.zw;
                float EdgeMask = 1.0 - NormalizedCoordinates.x * (1.0 - NormalizedCoordinates.x) * NormalizedCoordinates.y * (1.0 - NormalizedCoordinates.y) * 8.0;
                EdgeMask = EdgeMask * EdgeMask * EdgeMask * EdgeMask;
        
        
                float Luminance = max(dot(SceneColor, vec3(0.3, 0.59, 0.11)), 6.10352e-5);
                float AdjustedLuminance = clamp(Luminance - BloomTintAndThreshold.a, 0.0, BloomMaxBrightness);
                vec3 BloomColor = LightShaftParameters.y * SceneColor / Luminance * AdjustedLuminance * 2.0;
        
                float InvOcclusionDepthRange = LightShaftParameters.x;
        
                float BloomDistanceMask = clamp((SceneDepth - 0.5/ InvOcclusionDepthRange) * InvOcclusionDepthRange,0.0,1.0);
                float BlurOriginDistanceMask = 1.0 - clamp(length(TextureSpaceBlurOrigin.xy - InUV  ) * 2.0,0.0,1.0);
                outCol.rgb = BloomColor * BloomTintAndThreshold.rgb * BloomDistanceMask * (1.0 - EdgeMask) * BlurOriginDistanceMask * BlurOriginDistanceMask;
                gl_FragColor = outCol;
        #endif
    }
]]



kBlurLightShaftsFS = [[


precision highp float;

uniform sampler2D _MainTex;
varying highp vec2 v_uv;
uniform vec4      UVMinMax;
uniform vec4 LightShaftParameters;
uniform float BloomMaxBrightness;
uniform vec4 BloomTintAndThreshold;
uniform vec2 TextureSpaceBlurOrigin;
uniform vec4 AspectRatioAndInvAspectRatio; 
uniform vec4 RadialBlurParameters;


#define NUM_SAMPLES  12

void main(void)
    {
                    vec4 outCol = vec4(1.0,1.0,1.0,1.0);
                	vec2 UV = v_uv.xy;

                    vec3 BlurredValues = vec3(0.0,0.0,0.0);

                    //vec2 AspectCorrectedUV = UV * AspectRatioAndInvAspectRatio.zw;
                    vec2 AspectCorrectedUV = UV ;
                    float PassScale = pow(0.4 * float(NUM_SAMPLES), RadialBlurParameters.z) ;
                    vec2 AspectCorrectedBlurVector = (TextureSpaceBlurOrigin.xy - AspectCorrectedUV)* min(RadialBlurParameters.y * PassScale, 1.0);


                    
                    for (int SampleIndex = 0; SampleIndex < NUM_SAMPLES; SampleIndex++)
                    {
                        vec2 SampleUVs = (AspectCorrectedUV + AspectCorrectedBlurVector * float(SampleIndex) / float(NUM_SAMPLES));

                      //  vec2 SampleUVs = (AspectCorrectedUV + AspectCorrectedBlurVector * float(SampleIndex) / float(NUM_SAMPLES)) * AspectRatioAndInvAspectRatio.xy;
                        vec2 ClampedUVs = clamp(SampleUVs, UVMinMax.xy, UVMinMax.zw);
                        // bilinear clamp
                      //  vec3 SampleValue = Texture2DSample(_MainTex, SourceTextureSampler, ClampedUVs).xyz;
                      //  vec3 SampleValue = _MainTex.Sample(my_linear_clamp_sampler, ClampedUVs).xyz;
                          vec3 SampleValue = texture2D(_MainTex,ClampedUVs).xyz;
                        BlurredValues += SampleValue;
                    }
                    
                    outCol.rgb = BlurredValues / float(NUM_SAMPLES);
                    outCol.a = 1.0;
                    gl_FragColor = outCol;

    }
]]




kApplyLightShaftsFS = [[


precision highp float;

uniform sampler2D _MainTex;
uniform sampler2D _LightTex;
varying highp vec2 v_uv;


void main(void)
    {
                    vec4 lightCol = texture2D(_LightTex,v_uv);
                    vec4 sceneCol = texture2D(_MainTex,v_uv);
                    sceneCol = sceneCol +lightCol;
           
                    gl_FragColor =sceneCol;
                    gl_FragColor.a =1.0;
    }
]]



kFinishOcclusionFS = [[


precision highp float;

uniform sampler2D _MainTex;
uniform sampler2D _LightTex;
varying highp vec2 v_uv;


uniform vec4 LightShaftParameters;
uniform vec2 TextureSpaceBlurOrigin;
uniform vec4 AspectRatioAndInvAspectRatio; 

void main(void)
    {



        float LightShaftOcclusion = texture2D(_LightTex,v_uv).r;

        float FinalOcclusion = mix(LightShaftParameters.w, 1.0, LightShaftOcclusion * LightShaftOcclusion);
        float BlurOriginDistanceMask = clamp(length(TextureSpaceBlurOrigin.xy - v_uv*AspectRatioAndInvAspectRatio.zw) * 0.2,0.0,1.0);
        FinalOcclusion = mix(FinalOcclusion, 1.0, BlurOriginDistanceMask);
        FinalOcclusion = clamp(FinalOcclusion,0.0,1.0);
        vec4 sceneCol = texture2D(_MainTex,v_uv);
       // sceneCol = sceneCol * FinalOcclusion;
      //  sceneCol.a = 1.0;
        vec4 bgColor = vec4(0.0,0.0,0.0,1.0);
        gl_FragColor =mix(bgColor,sceneCol,FinalOcclusion);
        gl_FragColor.a =1.0;
       // gl_FragColor = vec4(FinalOcclusion,FinalOcclusion,FinalOcclusion,1.0);
    }
]]
LightShaftsShader = ScriptableObject(BaseShader)

function LightShaftsShader : getMaterial() 
    if self.material == nil then
        local material = CreateEmptyMaterial("LightShafts")
        AddPassToMaterial(material, "gles2", kLightShaftsVS, kLightShaftsDownsampleFS)
        AddPassToMaterial(material, "gles2", kLightShaftsVS, kBlurLightShaftsFS)
        AddPassToMaterial(material, "gles2", kLightShaftsVS, kApplyLightShaftsFS)
        AddPassToMaterial(material, "gles2", kLightShaftsVS, kFinishOcclusionFS)

        self.material = material
        local macrosVector = Amaz.StringVector()
        macrosVector:pushBack("OCCLUSION_TERM")
        MaterialSetMacroVector(self.material,0,"gles2",macrosVector)
    end
    return self.material
end