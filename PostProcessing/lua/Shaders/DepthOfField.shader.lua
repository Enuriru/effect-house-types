local full_screen_quad_vert = [[
    attribute vec3 inPosition;
    attribute vec2 inTexCoord;
    
    varying vec2 uv;

    void main () {
        gl_Position = vec4(inPosition, 1.0);
        uv = inTexCoord;
    }
]];

local  calcu_coc_FS= [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;


    uniform float _Distance;
    uniform float _LensCoeff;  // f^2 / (N * (S1 - f) * film_width * 2)
    uniform float _MaxCoC;
    uniform float _RcpMaxCoC;
    uniform float _RcpAspect;
   // uniform vec3 _TaaParams; // Jitter.x, Jitter.y, Blending
    uniform sampler2D u_depth_tex;
    uniform vec4 _ProjectionParams;
   // x is 1.0 (or –1.0 if currently rendering with  a flipped projection matrix), 
   //y is the camera’s near plane, z is the camera’s far plane and w is 1/FarPlane.
    uniform vec4 _ZBufferParams;
float linear01Depth(float z)
{

    return 1.0/(_ZBufferParams.x * z + _ZBufferParams.y);
}


float linearEyeDepth(float z)
{
    return 1.0/(_ZBufferParams.z * z + _ZBufferParams.w);

}



float SampleDepth(vec2 screenPos)
{
    vec2 uv = screenPos;

        return texture2D(u_depth_tex, uv).r;

}

    void main () {
            
        float depth  =SampleDepth(uv);
        depth = linearEyeDepth(depth);
        float coc = (depth - _Distance) * _LensCoeff / max(depth, 1e-4);
        gl_FragColor = vec4 (clamp(coc * 0.5 * _RcpMaxCoC + 0.5,0.0,1.0));

    }
]];


local  prefilter_FS= [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _CoCTex;
    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform float _MaxCoC;
    uniform float _RcpMaxCoC;


    float Max3(float a,float b,float c)
    {
        return max(max(a,b),c);
    }

    float Min3(float a,float b,float c)
    {
        return min(min(a,b),c);
    }


    void main () {

        //TODO use gather

        //
        vec3 duv = _MainTex_TexelSize.xyx * vec3(0.5,0.5,-0.5);
        vec2 uv0 = uv - duv.xy;
        vec2 uv1 = uv - duv.zy;
        vec2 uv2 = uv + duv.zy;
        vec2 uv3 = uv + duv.xy;

        //
        vec3 c0 = texture2D(_MainTex,uv0).rgb;
        vec3 c1 = texture2D(_MainTex,uv1).rgb;
        vec3 c2 = texture2D(_MainTex,uv2).rgb;
        vec3 c3 = texture2D(_MainTex,uv3).rgb;

        float coc0 = texture2D(_CoCTex, uv0).r * 2.0 - 1.0;
        float coc1 = texture2D(_CoCTex, uv1).r * 2.0 - 1.0;
        float coc2 = texture2D(_CoCTex, uv2).r * 2.0 - 1.0;
        float coc3 = texture2D(_CoCTex, uv3).r * 2.0 - 1.0;

        // Apply CoC and luma weights to reduce bleeding and flickering
        float w0 = abs(coc0) / (Max3(c0.r, c0.g, c0.b) + 1.0);
        float w1 = abs(coc1) / (Max3(c1.r, c1.g, c1.b) + 1.0);
        float w2 = abs(coc2) / (Max3(c2.r, c2.g, c2.b) + 1.0);
        float w3 = abs(coc3) / (Max3(c3.r, c3.g, c3.b) + 1.0);
    
        // Weighted average of the color samples
        vec3 avg = c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3;
        avg /= max(w0 + w1 + w2 + w3, 1e-4);
    
        //由于直接下采样的话是取均值，这对CoC来说是错误的。所以这里我们取 四个点中CoC绝对值最大的
        float coc_min = min(coc0, Min3(coc1, coc2, coc3));
        float coc_max = max(coc0, Max3(coc1, coc2, coc3));
        float coc = (-coc_min > coc_max ? coc_min : coc_max) * _MaxCoC;
  
        // Premultiply CoC again
        avg *= smoothstep(0.0, _MainTex_TexelSize.y * 2.0, abs(coc));
      //  #if defined(UNITY_COLORSPACE_GAMMA)
      //  avg = SRGBToLinear(avg);
      //  #endif
    
       gl_FragColor = vec4(avg,coc * _RcpMaxCoC *0.5 +0.5);
       //gl_FragColor = vec4(abs(coc * _RcpMaxCoC),abs(coc * _RcpMaxCoC),abs(coc * _RcpMaxCoC),1.0);

    }
]];




local  bokehBlur_FS= [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _DoFTex_TexelSize;
    uniform float _MaxCoC;
    uniform float _RcpAspect;
    uniform float _blurSize;
    const float PI = 3.1415926;

    void main () {
         #ifdef KERNEL_SMALL
          const int kSampleCount = 16;
          vec2 kDiskKernel[16];
          kDiskKernel[0] = vec2(0.0,0.0);
          kDiskKernel[1] = vec2(0.54545456,0.0);
          kDiskKernel[2] = vec2(0.16855472,0.5187581);
          kDiskKernel[3] = vec2(-0.44128203,0.3206101);
          kDiskKernel[4] = vec2(-0.44128197,-0.3206102);
          kDiskKernel[5] = vec2(0.1685548,-0.5187581);
          kDiskKernel[6] = vec2(1.0,0.0);
          kDiskKernel[7] = vec2(0.809017,0.58778524);
          kDiskKernel[8] = vec2(0.30901697,0.95105654);
          kDiskKernel[9] = vec2(-0.30901703,0.9510565);
          kDiskKernel[10] =vec2(-0.80901706,0.5877852);
          kDiskKernel[11] =vec2(-1.0,0.0);
          kDiskKernel[12] =vec2(-0.80901694,-0.58778536);
          kDiskKernel[13] =vec2(-0.30901664,-0.9510566);
          kDiskKernel[14] =vec2(0.30901712,-0.9510565);
          kDiskKernel[15] =vec2(0.80901694,-0.5877853);
        #endif

        #ifdef KERNEL_MEDIUM
            const int kSampleCount = 22;
            vec2 kDiskKernel[22];
            kDiskKernel[0] = vec2(0.0,0.0);
            kDiskKernel[1] = vec2(0.53333336,0.0);
            kDiskKernel[2] = vec2(0.3325279,0.4169768);
            kDiskKernel[3] = vec2(-0.11867785,0.5199616);
            kDiskKernel[4] = vec2(-0.48051673,0.2314047);
            kDiskKernel[5] = vec2(-0.48051673,-0.23140468);
            kDiskKernel[6] = vec2(-0.11867763,-0.51996166);
            kDiskKernel[7] = vec2(0.33252785,-0.4169769);
            kDiskKernel[8] = vec2(1.0,0.0);
            kDiskKernel[9] = vec2(0.90096885,0.43388376);
            kDiskKernel[10] =vec2(0.6234898,0.7818315);
            kDiskKernel[11] =vec2(0.22252098,0.9749279);
            kDiskKernel[12] =vec2(-0.22252095,0.9749279);
            kDiskKernel[13] =vec2(-0.62349,0.7818314);
            kDiskKernel[14] =vec2(-0.90096885,0.43388382);
            kDiskKernel[15] =vec2(-1.0,0.0);
            kDiskKernel[16] =vec2(-0.90096885,-0.43388376);
            kDiskKernel[17] =vec2(-0.6234896,-0.7818316);
            kDiskKernel[18] =vec2(-0.22252055,-0.974928);
            kDiskKernel[19] =vec2(0.2225215,-0.9749278);
            kDiskKernel[20] =vec2(0.6234897,-0.7818316);
            kDiskKernel[21] =vec2(0.90096885,-0.43388376);
        #endif

        #ifdef KERNEL_LARGE
            const int kSampleCount = 43;
            vec2 kDiskKernel[43];
            kDiskKernel[0] = vec2(0.0,0.0);
            kDiskKernel[1] = vec2(0.36363637,0.0);
            kDiskKernel[2] = vec2(0.22672357,0.28430238);
            kDiskKernel[3] = vec2(-0.08091671,0.35451925);
            kDiskKernel[4] = vec2(-0.32762504,0.15777594);
            kDiskKernel[5] = vec2(-0.32762504,-0.15777591);
            kDiskKernel[6] = vec2(-0.08091656,-0.35451928);
            kDiskKernel[7] = vec2(0.22672352,-0.2843024);
            kDiskKernel[8] = vec2(0.6818182,0.0);
            kDiskKernel[9] = vec2(0.614297,0.29582983);
            kDiskKernel[10] = vec2(0.42510667,0.5330669);
            kDiskKernel[11] = vec2(0.15171885,0.6647236);
            kDiskKernel[12] = vec2(-0.15171883,0.6647236);
            kDiskKernel[13] = vec2(-0.4251068,0.53306687);
            kDiskKernel[14] = vec2(-0.614297,0.29582986);
            kDiskKernel[15] = vec2(-0.6818182,0.0);
            kDiskKernel[16] = vec2(-0.614297,-0.29582983);
            kDiskKernel[17] = vec2(-0.42510656,-0.53306705);
            kDiskKernel[18] = vec2(-0.15171856,-0.66472363);
            kDiskKernel[19] = vec2(0.1517192,-0.6647235);
            kDiskKernel[20] = vec2(0.4251066,-0.53306705);
            kDiskKernel[21] = vec2(0.614297,-0.29582983);
            kDiskKernel[22] = vec2(1.0,0.0);
            kDiskKernel[23] = vec2(0.9555728,0.2947552);
            kDiskKernel[24] = vec2(0.82623875,0.5633201);
            kDiskKernel[25] = vec2(0.6234898,0.7818315);
            kDiskKernel[26] = vec2(0.36534098,0.93087375);
            kDiskKernel[27] = vec2(0.07473,0.9972038);
            kDiskKernel[28] = vec2(-0.22252095,0.9749279);
            kDiskKernel[29] = vec2(-0.50000006,0.8660254);
            kDiskKernel[30] = vec2(-0.73305196,0.6801727);
            kDiskKernel[31] = vec2(-0.90096885,0.43388382);
            kDiskKernel[32] = vec2(-0.98883086,0.14904208);
            kDiskKernel[33] = vec2(-0.9888308,-0.14904249);
            kDiskKernel[34] = vec2(-0.90096885,-0.43388376);
            kDiskKernel[35] = vec2(-0.73305184,-0.6801728);
            kDiskKernel[36] = vec2(-0.4999999,-0.86602545);
            kDiskKernel[37] = vec2(-0.222521,-0.9749279);
            kDiskKernel[38] = vec2(0.07473029,-0.99720377);
            kDiskKernel[39] = vec2(0.36534148,-0.9308736);
            kDiskKernel[40] = vec2(0.6234897,-0.7818316);
            kDiskKernel[41] = vec2(0.8262388,-0.56332);
            kDiskKernel[42] = vec2(0.9555729,-0.29475483);
        #endif
        
        #ifdef KERNEL_VERYLARGE
        const int kSampleCount = 71;
        vec2 kDiskKernel[71];
            kDiskKernel[0] = vec2(0.0,0.0);
            kDiskKernel[1] = vec2(0.2758621,0.0);
            kDiskKernel[2] = vec2(0.1719972,0.21567768);
            kDiskKernel[3] = vec2(-0.061385095,0.26894566);
            kDiskKernel[4] = vec2(-0.24854316,0.1196921);
            kDiskKernel[5] = vec2(-0.24854316,-0.11969208);
            kDiskKernel[6] = vec2(-0.061384983,-0.2689457);
            kDiskKernel[7] = vec2(0.17199717,-0.21567771);
            kDiskKernel[8] = vec2(0.51724136,0.0);
            kDiskKernel[9] = vec2(0.46601835,0.22442262);
            kDiskKernel[10] = vec2(0.32249472,0.40439558);
            kDiskKernel[11] = vec2(0.11509705,0.50427306);
            kDiskKernel[12] = vec2(-0.11509704,0.50427306);
            kDiskKernel[13] = vec2(-0.3224948,0.40439552);
            kDiskKernel[14] = vec2(-0.46601835,0.22442265);
            kDiskKernel[15] = vec2(-0.51724136,0.0);
            kDiskKernel[16] = vec2(-0.46601835,-0.22442262);
            kDiskKernel[17] = vec2(-0.32249463,-0.40439564);
            kDiskKernel[18] = vec2(-0.11509683,-0.5042731);
            kDiskKernel[19] = vec2(0.11509732,-0.504273);
            kDiskKernel[20] = vec2(0.32249466,-0.40439564);
            kDiskKernel[21] = vec2(0.46601835,-0.22442262);
            kDiskKernel[22] = vec2(0.7586207,0.0);
            kDiskKernel[23] = vec2(0.7249173,0.22360738);
            kDiskKernel[24] = vec2(0.6268018,0.4273463);
            kDiskKernel[25] = vec2(0.47299224,0.59311354);
            kDiskKernel[26] = vec2(0.27715522,0.7061801);
            kDiskKernel[27] = vec2(0.056691725,0.75649947);
            kDiskKernel[28] = vec2(-0.168809,0.7396005);
            kDiskKernel[29] = vec2(-0.3793104,0.65698475);
            kDiskKernel[30] = vec2(-0.55610836,0.51599306);
            kDiskKernel[31] = vec2(-0.6834936,0.32915324);
            kDiskKernel[32] = vec2(-0.7501475,0.113066405);
            kDiskKernel[33] = vec2(-0.7501475,-0.11306671);
            kDiskKernel[34] = vec2(-0.6834936,-0.32915318);
            kDiskKernel[35] = vec2(-0.5561083,-0.5159932);
            kDiskKernel[36] = vec2(-0.37931028,-0.6569848);
            kDiskKernel[37] = vec2(-0.16880904,-0.7396005);
            kDiskKernel[38] = vec2(0.056691945,-0.7564994);
            kDiskKernel[39] = vec2(0.2771556,-0.7061799);
            kDiskKernel[40] = vec2(0.47299215,-0.59311366);
            kDiskKernel[41] = vec2(0.62680185,-0.4273462);
            kDiskKernel[42] = vec2(0.72491735,-0.22360711);
            kDiskKernel[43] = vec2(1.0,0.0);
            kDiskKernel[44] = vec2(0.9749279,0.22252093);
            kDiskKernel[45] = vec2(0.90096885,0.43388376);
            kDiskKernel[46] = vec2(0.7818315,0.6234898);
            kDiskKernel[47] = vec2(0.6234898,0.7818315);
            kDiskKernel[48] = vec2(0.43388364,0.9009689);
            kDiskKernel[49] = vec2(0.22252098,0.9749279);
            kDiskKernel[50] = vec2(0.0,1.0);
            kDiskKernel[51] = vec2(-0.22252095,0.9749279);
            kDiskKernel[52] = vec2(-0.43388385,0.90096885);
            kDiskKernel[53] = vec2(-0.62349,0.7818314);
            kDiskKernel[54] = vec2(-0.7818317,0.62348956);
            kDiskKernel[55] = vec2(-0.90096885,0.43388382);
            kDiskKernel[56] = vec2(-0.9749279,0.22252093);
            kDiskKernel[57] = vec2(-1.0,0.0);
            kDiskKernel[58] = vec2(-0.9749279,-0.22252087);
            kDiskKernel[59] = vec2(-0.90096885,-0.43388376);
            kDiskKernel[60] = vec2(-0.7818314,-0.6234899);
            kDiskKernel[61] = vec2(-0.6234896,-0.7818316);
            kDiskKernel[62] = vec2(-0.43388346,-0.900969);
            kDiskKernel[63] = vec2(-0.22252055,-0.974928);
            kDiskKernel[64] = vec2(0.0,-1.0);
            kDiskKernel[65] = vec2(0.2225215,-0.9749278);
            kDiskKernel[66] = vec2(0.4338835,-0.90096897);
            kDiskKernel[67] = vec2(0.6234897,-0.7818316);
            kDiskKernel[68] = vec2(0.78183144,-0.62348986);
            kDiskKernel[69] = vec2(0.90096885,-0.43388376);
            kDiskKernel[70] = vec2(0.9749279,-0.22252086);

        #endif
        vec4 samp0 = texture2D(_MainTex,uv);

        vec4 bgAcc = vec4(0.0); // Background: far field bokeh
        vec4 fgAcc = vec4(0.0); // Foreground: near field bokeh
        for (int si = 0; si < kSampleCount; si++)
        {
            vec2 disp = kDiskKernel[si] * _MaxCoC;
            float dist = length(disp);
    
            vec2 duv = vec2(disp.x * _RcpAspect, disp.y);
            vec4 samp = texture2D(_MainTex, uv + duv);
            
    
            // BG: Compare CoC of the current sample and the center sample
            // and select smaller one.
            float bgCoC = (min(samp0.a, samp.a) *2.0 -1.0)* _MaxCoC;;
            float fgCoC = samp.a * 2.0 -1.0 * _MaxCoC;
           // float bgCoC = max(min(samp0.a, samp.a), 0.0);
            bgCoC = max(bgCoC, 0.0);
            // Compare the CoC to the sample distance.
            // Add a small margin to smooth out.
            float margin = _DoFTex_TexelSize.y * 2.0;
            float bgWeight = clamp((bgCoC   - dist + margin) / margin,0.0,1.0);
            float fgWeight = clamp((-fgCoC - dist + margin) / margin,0.0,1.0);
    
            // Cut influence from focused areas because they're darkened by CoC
            // premultiplying. This is only needed for near field.
            fgWeight *= step(_DoFTex_TexelSize.y, -fgCoC);
    
            // Accumulation
            bgAcc += vec4(samp.rgb, 1.0) * bgWeight;
            fgAcc += vec4(samp.rgb, 1.0) * fgWeight;
   
        }

        // Get the weighted average.
        bgAcc.rgb /= bgAcc.a + (bgAcc.a == 0.0 ? 1.0:0.0); // zero-div guard
        fgAcc.rgb /= fgAcc.a + (fgAcc.a == 0.0 ? 1.0:0.0); // zero-div guard


        // BG: Calculate the alpha value only based on the center CoC.
        // This is a rather aggressive approximation but provides stable results.
        bgAcc.a = smoothstep(_DoFTex_TexelSize.y, _DoFTex_TexelSize.y * 2.0, samp0.a);
    
        // FG: Normalize the total of the weights.
        fgAcc.a *= PI / float(kSampleCount);
    
        // Alpha premultiplying
        float alpha = clamp(fgAcc.a,0.0,1.0);
        vec3 rgb = mix(bgAcc.rgb, fgAcc.rgb, alpha);

        gl_FragColor = vec4(rgb,alpha);
        
    }
]];


local  postBlur_FS= [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _DoFTex_TexelSize;

    void main () {

        vec4 duv = _DoFTex_TexelSize.xyxy * vec4(0.5, 0.5, -0.5, 0.0);
        vec4 acc;
        acc  = texture2D(_MainTex, uv - duv.xy);
        acc += texture2D(_MainTex, uv - duv.zy);
        acc += texture2D(_MainTex, uv + duv.zy);
        acc += texture2D(_MainTex, uv + duv.xy);

        gl_FragColor = acc * 0.25;
    }
]];




local  Combine_FS= [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform sampler2D _DepthOfFieldTex;
    uniform sampler2D _CoCTex;
    uniform float _MaxCoC;
    uniform vec4 _DoFTex_TexelSize;

    float Max3(float a,float b,float c)
    {
        return max(max(a,b),c);
    }

    void main () {
        
        vec4 dof =texture2D(_DepthOfFieldTex,uv);
        float coc =texture2D(_CoCTex,uv).r;
        coc = (coc - 0.5) * 2.0 ;

        float ffa = smoothstep(0.1,1.0,coc);
        vec4 color = texture2D(_MainTex,uv);
        /*
        #if defined(UNITY_COLORSPACE_GAMMA)
        color = SRGBToLinear(color);
        #endif
        */
        float alpha = Max3(dof.r, dof.g, dof.b);
        color = mix(color, vec4(dof.rgb, alpha), ffa + dof.a - ffa * dof.a);

        /*
        #if defined(UNITY_COLORSPACE_GAMMA)
        color = LinearToSRGB(color);
        #endif
        */

        gl_FragColor = vec4(color.rgb,1.0);

    }
]];

DepthOfFieldShader = ScriptableObject (BaseShader);

function DepthOfFieldShader : getMaterial()
    if self.material == nil then
        local material = CreateEmptyMaterial("depthOfField");
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, calcu_coc_FS);
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, prefilter_FS);
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, bokehBlur_FS);
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, postBlur_FS);
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, Combine_FS);


        self.material = material
        local macrosVector = Amaz.StringVector()
        macrosVector:pushBack("KERNEL_SMALL")
        macrosVector:pushBack("KERNEL_MEDIUM")
        macrosVector:pushBack("KERNEL_LARGE")
        macrosVector:pushBack("KERNEL_VERYLARGE")
        MaterialSetMacroVector(self.material,2,"gles2",macrosVector)

    end
    return self.material;
end