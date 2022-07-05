const kBloomVS = "\
    attribute vec3 inPosition;\n \
    attribute vec2 inTexCoord;\n \
    varying vec2 uv;\n \
    void main() {\n \
        gl_Position = vec4(inPosition, 1.0);\n \
        uv = inTexCoord;\n \
    }\n \
    "

const kExtractBrightFastModeFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_userprop;\n \
    uniform vec2 u_texture_size;\n \
    uniform vec4 u_threshold;\n \
    uniform vec4 u_clamp;\n \
    uniform sampler2D _MainTex;\n \
    uniform sampler2D _BloomMask;\n \
    \n \
    vec4 DownsampleBox4Tap(vec2 texelSize)\n \
    {\n \
        vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0);\n \
    \n \
        vec4 s;\n \
    \n \
        s = texture2D(_MainTex, uv + d.xy);\n \
        s += texture2D(_MainTex, uv + d.zy);\n \
        s += texture2D(_MainTex, uv + d.xw);\n \
        s += texture2D(_MainTex, uv + d.zw);\n \
    \n \
        return s * (1.0 / 4.0);\n \
    }\n \
    \n \
    //colorTobright\n \
    float PixelBrightness(vec3 color, float useHSV)\n \
    {\n \
        float br = 0.0;\n \
        if(useHSV > 0.5)\n \
        {\n \
            //rgb to hsv\n \
            br = max(color.r, color.g);\n \
            br = max(br, color.b);\n \
        }else\n \
        {\n \
            //rgb to Luminance\n \
            br = dot(color, vec3(0.2126, 0.7152, 0.0722));\n \
        }\n \
        return br;\n \
    }\n \
    \n \
    //\n \
    // Quadratic color thresholding\n \
    // curve = (threshold - knee, knee * 2, 0.25 / knee)\n \
    //\n \
    vec4 QuadraticThreshold(vec4 color, float threshold, vec3 curve, float useHSV)\n \
    {\n \
        // Pixel brightness\n \
        float br = PixelBrightness(color.rgb, useHSV);\n \
    \n \
        // Under-threshold part: quadratic curve\n \
        float rq = clamp(br - curve.x, 0.0, curve.y);\n \
        rq = curve.z * rq * rq;\n \
    \n \
        // Combine and apply the brightness response curve.\n \
        color *= max(rq, br - threshold) / max(br, 1.0e-4);\n \
    \n \
        return color;\n \
    }\n \
    \n \
    vec4 Prefilter(vec4 color, float useHSV)\n \
    {\n \
    //     half autoExposure = SAMPLE_TEXTURE2D(_AutoExposureTex, sampler_AutoExposureTex, uv).r;\n \
    //     color *= autoExposure;\n \
        color = min(vec4(u_clamp.x), color); // clamp to max\n \
        color = QuadraticThreshold(color, u_threshold.x, u_threshold.yzw, useHSV);\n \
        return color;\n \
    }\n \
    \n \
    void main()\n \
    {\n \
    //u_userprop:(u_usemask, u_brightfunc)\n \
        vec4 color = DownsampleBox4Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));\n \
        float mask = 1.0;\n \
        if(u_userprop.x > 0.5)\n \
        {\n \
            mask = texture2D(_BloomMask, uv).r;\n \
        }\n \
        color = color * mask;\n \
        color = clamp(color, vec4(0.0), vec4(65504.0)); // (2 - 2^-10) * 2^15\n \
        color = Prefilter(color, u_userprop.y);\n \
        gl_FragColor = color;\n \
    }    \n \
    "
const kExtractBrightFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_userprop;\n \
    uniform vec2 u_texture_size;\n \
    uniform vec4 u_threshold;\n \
    uniform vec4 u_clamp;\n \
    uniform sampler2D _MainTex;\n \
    uniform sampler2D _BloomMask;\n \
    \n \
    vec4 DownsampleBox13Tap(vec2 texelSize)\n \
    {\n \
    \n \
        vec4 A = texture2D(_MainTex, uv + texelSize * (-1.0, -1.0));\n \
        vec4 B = texture2D(_MainTex, uv + texelSize * ( 0.0, -1.0));\n \
        vec4 C = texture2D(_MainTex, uv + texelSize * ( 1.0, -1.0));\n \
        vec4 D = texture2D(_MainTex, uv + texelSize * (-0.5, -0.5));\n \
        vec4 E = texture2D(_MainTex, uv + texelSize * ( 0.5, -0.5));\n \
        vec4 F = texture2D(_MainTex, uv + texelSize * (-1.0,  0.0));\n \
        vec4 G = texture2D(_MainTex, uv);\n \
        vec4 H = texture2D(_MainTex, uv + texelSize * ( 1.0,  0.0));\n \
        vec4 I = texture2D(_MainTex, uv + texelSize * (-0.5,  0.5));\n \
        vec4 J = texture2D(_MainTex, uv + texelSize * ( 0.5,  0.5));\n \
        vec4 K = texture2D(_MainTex, uv + texelSize * (-1.0,  1.0));\n \
        vec4 L = texture2D(_MainTex, uv + texelSize * ( 0.0,  1.0));\n \
        vec4 M = texture2D(_MainTex, uv + texelSize * ( 1.0,  1.0));\n \
    \n \
        vec2 div = (1.0 / 4.0) * vec2(0.5, 0.125);\n \
    \n \
        vec4 o = (D + E + I + J) * div.x;\n \
        o += (A + B + G + F) * div.y;\n \
        o += (B + C + H + G) * div.y;\n \
        o += (F + G + L + K) * div.y;\n \
        o += (G + H + M + L) * div.y;\n \
    \n \
        return o;\n \
    }\n \
    \n \
    //colorTobright\n \
    float PixelBrightness(vec3 color, float useHSV)\n \
    {\n \
        float br = 0.0;\n \
        if(useHSV < 0.5)\n \
        {\n \
            //rgb to hsv\n \
            br = max(color.r, color.g);\n \
            br = max(br, color.b);\n \
        }else\n \
        {\n \
            //rgb to Luminance\n \
            br = dot(color, vec3(0.2126, 0.7152, 0.0722));\n \
        }\n \
        return br;\n \
    }\n \
    \n \
    //\n \
    // Quadratic color thresholding\n \
    // curve = (threshold - knee, knee * 2, 0.25 / knee)\n \
    //\n \
    vec4 QuadraticThreshold(vec4 color, float threshold, vec3 curve, float useHSV)\n \
    {\n \
        // Pixel brightness\n \
        float br = PixelBrightness(color.rgb, useHSV);\n \
    \n \
        // Under-threshold part: quadratic curve\n \
        float rq = clamp(br - curve.x, 0.0, curve.y);\n \
        rq = curve.z * rq * rq;\n \
    \n \
        // Combine and apply the brightness response curve.\n \
        color *= max(rq, br - threshold) / max(br, 1.0e-4);\n \
    \n \
        return color;\n \
    }\n \
    \n \
    vec4 Prefilter(vec4 color, float useHSV)\n \
    {\n \
    //     half autoExposure = SAMPLE_TEXTURE2D(_AutoExposureTex, sampler_AutoExposureTex, uv).r;\n \
    //     color *= autoExposure;\n \
        color = min(vec4(u_clamp.x), color); // clamp to max\n \
        color = QuadraticThreshold(color, u_threshold.x, u_threshold.yzw, useHSV);\n \
        return color;\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = DownsampleBox13Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));\n \
        float mask = 1.0;\n \
        if(u_userprop.x > 0.5)\n \
        {\n \
            mask = texture2D(_BloomMask, uv).r;\n \
        }\n \
        color = color * mask;\n \
        color = clamp(color, vec4(0.0), vec4(65504.0)); // (2 - 2^-10) * 2^15\n \
        color = Prefilter(color, u_userprop.y);\n \
        gl_FragColor = color;\n \
    }\n \
    "
const kDownSampleFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_texture_size;\n \
    uniform sampler2D _MainTex;\n \
    \n \
    const float  kGamma = 1.5;\n \
    \n \
    vec4 DownsampleBox13Tap(vec2 texelSize)\n \
    {\n \
        vec4 A = texture2D(_MainTex, uv + texelSize * (-1.0, -1.0));\n \
        A = vec4(pow(A.rgb, vec3(kGamma)), A.a);\n \
        vec4 B = texture2D(_MainTex, uv + texelSize * ( 0.0, -1.0));\n \
        B = vec4(pow(B.rgb, vec3(kGamma)), B.a);\n \
        vec4 C = texture2D(_MainTex, uv + texelSize * ( 1.0, -1.0));\n \
        C = vec4(pow(C.rgb, vec3(kGamma)), C.a);\n \
        vec4 D = texture2D(_MainTex, uv + texelSize * (-0.5, -0.5));\n \
        D = vec4(pow(D.rgb, vec3(kGamma)), D.a);\n \
        vec4 E = texture2D(_MainTex, uv + texelSize * ( 0.5, -0.5));\n \
        E = vec4(pow(E.rgb, vec3(kGamma)), E.a);\n \
        vec4 F = texture2D(_MainTex, uv + texelSize * (-1.0,  0.0));\n \
        F = vec4(pow(F.rgb, vec3(kGamma)), F.a);\n \
        vec4 G = texture2D(_MainTex, uv);\n \
        G = vec4(pow(G.rgb, vec3(kGamma)), G.a);\n \
        vec4 H = texture2D(_MainTex, uv + texelSize * ( 1.0,  0.0));\n \
        H = vec4(pow(H.rgb, vec3(kGamma)), H.a); \n \
        vec4 I = texture2D(_MainTex, uv + texelSize * (-0.5,  0.5));\n \
        I = vec4(pow(I.rgb, vec3(kGamma)), I.a);\n \
        vec4 J = texture2D(_MainTex, uv + texelSize * ( 0.5,  0.5));\n \
        J = vec4(pow(J.rgb, vec3(kGamma)), J.a);\n \
        vec4 K = texture2D(_MainTex, uv + texelSize * (-1.0,  1.0));\n \
        K = vec4(pow(K.rgb, vec3(kGamma)), K.a);\n \
        vec4 L = texture2D(_MainTex, uv + texelSize * ( 0.0,  1.0));\n \
        L = vec4(pow(L.rgb, vec3(kGamma)), L.a);\n \
        vec4 M = texture2D(_MainTex, uv + texelSize * ( 1.0,  1.0));\n \
        M = vec4(pow(M.rgb, vec3(kGamma)), M.a);\n \
        vec2 div = (1.0 / 4.0) * vec2(0.5, 0.125);\n \
    \n \
        vec4 o = (D + E + I + J) * div.x;\n \
        o += (A + B + G + F) * div.y;\n \
        o += (B + C + H + G) * div.y;\n \
        o += (F + G + L + K) * div.y;\n \
        o += (G + H + M + L) * div.y;\n \
    \n \
        return o;\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = DownsampleBox13Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));\n \
        gl_FragColor = vec4(pow(color.rgb, vec3(1.0/kGamma)), color.a);\n \
    }\n \
    "
    const kDownSampleFastModeFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_texture_size;\n \
    uniform sampler2D _MainTex;\n \
    \n \
    const float  kGamma = 1.5;\n \
    \n \
    vec4 DownsampleBox4Tap(vec2 texelSize)\n \
    {\n \
        vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0);\n \
    \n \
        vec4 s;\n \
        vec4 c;\n \
        c = texture2D(_MainTex, uv + d.xy);\n \
        s = vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.zy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.xw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.zw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
    \n \
        return s * (1.0 / 4.0);\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = DownsampleBox4Tap(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y));\n \
        gl_FragColor = vec4(pow(color.rgb, vec3(1.0/kGamma)), color.a);\n \
    }   \n \
    "

    const kUpSampleFastModeFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_texture_size;\n \
    uniform sampler2D _MainTex;\n \
    uniform sampler2D _BloomTex;\n \
    uniform float u_sample_scale;\n \
    \n \
    const float  kGamma = 1.5;\n \
    \n \
    vec4 UpsampleBox(vec2 texelSize, vec4 sampleScale)\n \
    {\n \
        vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0) * (sampleScale * 0.5);\n \
    \n \
        vec4 s;\n \
        vec4 c;\n \
        c = texture2D(_MainTex, uv + d.xy);\n \
        s =  vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.zy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.xw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.zw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
    \n \
        return s * (1.0 / 4.0);\n \
    }\n \
    \n \
    vec4 Combine(vec4 bloom)\n \
    {\n \
        vec4 c = texture2D(_BloomTex, uv);\n \
        vec4 s = vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        return bloom + s;\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = UpsampleBox(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));\n \
        vec4 c = Combine(color);\n \
        gl_FragColor = vec4(pow(c.rgb, vec3(1.0/kGamma)), c.a);\n \
    }\n \
    "

    const kUpSampleFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_texture_size;\n \
    uniform sampler2D _MainTex;\n \
    uniform sampler2D _BloomTex;\n \
    uniform float u_sample_scale;\n \
    \n \
    const float  kGamma = 1.5;\n \
    \n \
    vec4 UpsampleTent(vec2 texelSize, vec4 sampleScale)\n \
    {\n \
        vec4 d = texelSize.xyxy * vec4(1.0, 1.0, -1.0, 0.0) * sampleScale;\n \
    \n \
        vec4 s;\n \
        vec4 c;\n \
        c = texture2D(_MainTex, uv - d.xy);\n \
        s =  vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv - d.wy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a) * 2.0;\n \
        c = texture2D(_MainTex, uv - d.zy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
    \n \
        c = texture2D(_MainTex, uv + d.zw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a) * 2.0;\n \
        c = texture2D(_MainTex, uv       );\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a) * 4.0;\n \
        c = texture2D(_MainTex, uv + d.xw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a) * 2.0;\n \
    \n \
        c = texture2D(_MainTex, uv + d.zy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.wy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a) * 2.0;\n \
        c = texture2D(_MainTex, uv + d.xy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
    \n \
        return s * (1.0 / 16.0);\n \
    }\n \
    \n \
    vec4 Combine(vec4 bloom)\n \
    {\n \
        vec4 c = texture2D(_BloomTex, uv);\n \
        vec4 color = vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        return bloom + color;\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = UpsampleTent(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));\n \
        vec4 c = Combine(color);\n \
        gl_FragColor = vec4(pow(c.rgb, vec3(1.0/kGamma)), c.a);\n \
    }\n \
    "

    const kUpSampleFinalFastModeFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_texture_size;\n \
    uniform sampler2D _MainTex;\n \
    uniform vec4 u_bloom_color;\n \
    uniform float u_intensity;\n \
    uniform float u_sample_scale;\n \
    \n \
    const float  kGamma = 1.5;\n \
    \n \
    vec4 UpsampleBox(vec2 texelSize, vec4 sampleScale)\n \
    {\n \
        vec4 d = texelSize.xyxy * vec4(-1.0, -1.0, 1.0, 1.0) * (sampleScale * 0.5);\n \
    \n \
        vec4 s;\n \
        vec4 c;\n \
        c = texture2D(_MainTex, uv + d.xy);\n \
        s =  vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.zy);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.xw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
        c = texture2D(_MainTex, uv + d.zw);\n \
        s += vec4(pow(c.rgb, vec3(kGamma)), c.a);\n \
    \n \
        return s * (1.0 / 4.0);\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = UpsampleBox(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));\n \
        color.rgb = color.rgb * u_bloom_color.rgb * u_intensity;\n \
        color.a *= u_bloom_color.a;\n \
        gl_FragColor =  vec4(pow(color.rgb, vec3(1.0/kGamma)), color.a);\n \
    }\n \
    "

    const kUpSampleFinalFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform vec2 u_texture_size;\n \
    uniform sampler2D _MainTex;\n \
    uniform vec4 u_bloom_color;\n \
    uniform float u_intensity;\n \
    uniform float u_sample_scale;\n \
    \n \
    const float  kGamma = 1.5;\n \
    \n \
    vec4 UpsampleTent(vec2 texelSize, vec4 sampleScale)\n \
    {\n \
        vec4 d = texelSize.xyxy * vec4(1.0, 1.0, -1.0, 0.0) * sampleScale;\n \
    \n \
        vec4 s;\n \
        s =  pow(texture2D(_MainTex, uv - d.xy), vec4(kGamma));\n \
        s += pow(texture2D(_MainTex, uv - d.wy), vec4(kGamma)) * 2.0;\n \
        s += pow(texture2D(_MainTex, uv - d.zy), vec4(kGamma));\n \
    \n \
        s += pow(texture2D(_MainTex, uv + d.zw), vec4(kGamma)) * 2.0;\n \
        s += pow(texture2D(_MainTex, uv       ), vec4(kGamma)) * 4.0;\n \
        s += pow(texture2D(_MainTex, uv + d.xw), vec4(kGamma)) * 2.0;\n \
    \n \
        s += pow(texture2D(_MainTex, uv + d.zy), vec4(kGamma));\n \
        s += pow(texture2D(_MainTex, uv + d.wy), vec4(kGamma)) * 2.0;\n \
        s += pow(texture2D(_MainTex, uv + d.xy), vec4(kGamma));\n \
    \n \
        return s * (1.0 / 16.0);\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color = UpsampleTent(vec2(1.0/u_texture_size.x, 1.0/u_texture_size.y), vec4(u_sample_scale));\n \
        color.rgb = color.rgb * u_bloom_color.rgb * u_intensity;\n \
        color.a *= u_bloom_color.a;\n \
        gl_FragColor = pow(color, vec4(1.0/kGamma));\n \
    }\n \
    "

    const kBloomFS = "\
    #ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec2 uv;\n \
    uniform float u_hdr;\n \
    uniform sampler2D _MainTex;\n \
    uniform sampler2D _PreviewTex;\n \
    \n \
    const float kGamma = 1.0;\n \
    \n \
    vec3 jodieReinhardTonemap(vec3 c){\n \
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n \
        vec3 tc = c / (c + 1.0);\n \
    \n \
        return mix(c / (l + 1.0), tc, tc);\n \
    }\n \
    \n \
    vec3 blendScreen(vec3 base, vec3 blend, float opacity)\n \
    {\n \
        return vec3(1.0,1.0,1.0)-((vec3(1.0,1.0,1.0)-base)*(vec3(1.0,1.0,1.0)-blend*opacity));\n \
    }\n \
    \n \
    float LinearToSRGB(float a)\n \
    {\n \
        if(a < 0.0031308)\n \
        {\n \
            return a * 12.92;\n \
        }\n \
        else\n \
        {\n \
            return max(1.055 * pow(a, 1.0/2.4) - 0.055, 0.0);\n \
        }\n \
    }\n \
    \n \
    vec4 LinearToSRGB(vec4 c)\n \
    {\n \
        return vec4(LinearToSRGB(c.r),LinearToSRGB(c.g),LinearToSRGB(c.b), c.a);\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 bloomColor = texture2D(_MainTex,uv);\n \
        vec4 originColor = texture2D(_PreviewTex, uv);\n \
        vec4 color1 = originColor;\n \
        vec4 color2 = pow(bloomColor, vec4(kGamma));\n \
        // vec4 color2 = pow(bloomColor, vec4(2.2));\n \
        if(u_hdr > 0.0)\n \
        {\n \
            color2.rgb = jodieReinhardTonemap(color2.rgb);\n \
        }\n \
        gl_FragColor = vec4((color2 + color1).rgb, color1.a);\n \
    }\n \
    "

exports.kBloomVS = kBloomVS
exports.kExtractBrightFastModeFS = kExtractBrightFastModeFS
exports.kExtractBrightFS = kExtractBrightFS
exports.kDownSampleFastModeFS = kDownSampleFastModeFS
exports.kDownSampleFS = kDownSampleFS
exports.kUpSampleFastModeFS = kUpSampleFastModeFS
exports.kUpSampleFS = kUpSampleFS
exports.kUpSampleFinalFastModeFS = kUpSampleFinalFastModeFS
exports.kUpSampleFinalFS = kUpSampleFinalFS
exports.kBloomFS = kBloomFS
