const kFxaaVS = " \
    attribute vec3 inPosition;\n \
    attribute vec2 inTexCoord;\n \
    varying vec2 v_uv;\n \
    void main() {\n \
        gl_Position = vec4(inPosition, 1.0);\n \
        v_uv = inTexCoord;\n \
    }\n \
    "
    const kFxaaFS = "\
    #version 300 es\n \
    precision highp float;    \n \
    in vec2 v_uv;\n \
    uniform sampler2D _MainTex;\n \
    uniform vec2  u_texture_size;\n \
    layout(location = 0) out vec4 o_fragColor;\n \
    \n \
    const ivec2 P_OFF[6] = ivec2[](\n \
        ivec2(-1, -1),\n \
        ivec2(1, 1),\n \
        ivec2(0, -1),\n \
        ivec2(-1, 0),\n \
        ivec2(1, -1),\n \
        ivec2(-1, 1)\n \
    );\n \
    \n \
    /*--------------------------dither ---------------------------*/\n \
    /*vec3 Dither(vec3 color, vec2 uv)\n \
    {\n \
    \n \
    }*/\n \
    \n \
    /*----------------------------------------------------------*/\n \
    #ifdef FXAA_KEEP_ALPHA\n \
    #define FXAA_GREEN_AS_LUMA 0\n \
    #else\n \
    #define FXAA_GREEN_AS_LUMA 1\n \
    #endif\n \
    /*-----------------------------------------------------------*/\n \
    \n \
    /*#ifndef FXAA_LOW\n \
    #define FXAA_QUALITY__PRESET 12\n \
    #define FXAA_QUALITY_SUBPIX 1.0\n \
    #define FXAA_QUALITY_EDGE_THRESHOLD 0.166\n \
    #define FXAA_QUALITY_EDGE_THRESHOLD_MIN 0.0625\n \
    #else*/\n \
    #define FXAA_QUALITY__PRESET 28\n \
    #define FXAA_QUALITY_SUBPIX 1.8\n \
    #define FXAA_QUALITY_EDGE_THRESHOLD 0.063\n \
    #define FXAA_QUALITY_EDGE_THRESHOLD_MIN 0.0312\n \
    //#endif\n \
    /*------------------------------------------------------------*/\n \
    #if (FXAA_QUALITY__PRESET == 12)\n \
    #define FXAA_QUALITY__PS 5\n \
    #define FXAA_QUALITY__P0 1.0\n \
    #define FXAA_QUALITY__P1 1.5\n \
    #define FXAA_QUALITY__P2 2.0\n \
    #define FXAA_QUALITY__P3 4.0\n \
    #define FXAA_QUALITY__P4 12.0\n \
    #endif\n \
    /*-------------------------------------------------------------*/\n \
    #if (FXAA_QUALITY__PRESET == 28)\n \
    #define FXAA_QUALITY__PS 11\n \
    #define FXAA_QUALITY__P0 1.0\n \
    #define FXAA_QUALITY__P1 1.5\n \
    #define FXAA_QUALITY__P2 2.0\n \
    #define FXAA_QUALITY__P3 2.0\n \
    #define FXAA_QUALITY__P4 2.0\n \
    #define FXAA_QUALITY__P5 2.0\n \
    #define FXAA_QUALITY__P6 2.0\n \
    #define FXAA_QUALITY__P7 2.0\n \
    #define FXAA_QUALITY__P8 2.0\n \
    #define FXAA_QUALITY__P9 4.0\n \
    #define FXAA_QUALITY__P10 8.0\n \
    #endif\n \
    /*--------------------------------------------------------------*/\n \
    #if (FXAA_GREEN_AS_LUMA == 0)\n \
    float FxaaLuma(vec4 rgba) \n \
    {\n \
        return rgba.w;\n \
    }\n \
    #else\n \
    float FxaaLuma(vec4 rgba)\n \
    {\n \
        return rgba.y;\n \
    }\n \
    #endif\n \
    \n \
    /*----------------------------------------------------------------*/\n \
    //vec4 FxaaPixelShader(vec2 uv, vec4 pos, sampler2D tex, sampler2D texExpBiasNegOne, sampler2D texExpBiasNegTwo, vec2 qualityRcpFrame, vec4 rcpFrameOpt, vec4 rcpFrameOpt2, vec4 rcpFrame360Opt2, float qualitySubpix, float edgeThreshold, float edgeThresholdMin, float edgeSharpness, float cedgeThreshold, float cedgeThresholdMin, vec4 constDir)\n \
    vec4 FxaaPixelShader(vec2 uv, sampler2D tex, vec2 qualityRcpFrame, float edgeThreshold, float edgeThresholdMin, float qualitySubpix)\n \
    {\n \
        vec2 posM;\n \
        posM.x = uv.x;\n \
        posM.y = uv.y;\n \
    \n \
        //if no fxaa gather alpha\n \
        vec4 rgbyM = texture(tex, posM, 0.0);\n \
    #if (FXAA_GREEN_AS_LUMA == 0)\n \
    #define lumaM rgbyM.w\n \
    #else\n \
    #define lumaM rgbyM.y\n \
    #endif\n \
        \n \
        float lumaS = FxaaLuma(textureLod(tex, posM + vec2(0.0, 1.0)  * qualityRcpFrame.xy, 0.0));\n \
        float lumaE = FxaaLuma(textureLod(tex, posM + vec2(1.0, 0.0)  * qualityRcpFrame.xy, 1.0));\n \
        float lumaN = FxaaLuma(textureLod(tex, posM + vec2(0.0, -1.0) * qualityRcpFrame.xy, 1.0));\n \
        float lumaW = FxaaLuma(textureLod(tex, posM + vec2(-1.0, 0.0) * qualityRcpFrame.xy, 1.0));\n \
    \n \
        /*---------------------------------------------------------*/\n \
        float maxSM = max(lumaS, lumaM);\n \
        float minSM = min(lumaS, lumaM);\n \
        float maxESM = max(lumaE, maxSM);\n \
        float minESM = min(lumaE, minSM);\n \
        float maxWN = max(lumaN, lumaW);\n \
        float minWN = min(lumaN, lumaW);\n \
        float rangeMax = max(maxWN, maxESM);\n \
        float rangeMin = min(minWN, minESM);\n \
        float rangeMaxScaled = rangeMax * edgeThreshold;\n \
        float range = rangeMax - rangeMin;\n \
        float rangeMaxClamped = max(edgeThresholdMin, rangeMaxScaled);\n \
        bool earlyExit = range < rangeMaxClamped;\n \
        /*----------------------------------------------------------*/\n \
        if(earlyExit)\n \
        {\n \
            //discard;\n \
            return rgbyM;\n \
        }\n \
    \n \
        float lumaNW = FxaaLuma(textureLod(tex, posM + ivec2(-1, -1) * qualityRcpFrame.xy, 1.0));\n \
        float lumaSE = FxaaLuma(textureLod(tex, posM + vec2(1.0, 1.0) * qualityRcpFrame.xy, 1.0));\n \
        float lumaNE = FxaaLuma(textureLod(tex, posM + vec2(1.0, -1.0) * qualityRcpFrame.xy, 1.0));\n \
        float lumaSW = FxaaLuma(textureLod(tex, posM + vec2(-1.0, 1.0) * qualityRcpFrame.xy, 1.0));\n \
    \n \
        /*-----------------------------------------------------------*/\n \
        float lumaNS = lumaN + lumaS;\n \
        float lumaWE = lumaW + lumaE;\n \
        float subpixRcpRange = 1.0/range;\n \
        float subpixNSWE = lumaNS + lumaWE;\n \
        float edgeHorz1 = (-2.0 * lumaM) + lumaNS;\n \
        float edgeVert1 = (-2.0 * lumaM) + lumaWE;\n \
        /*----------------------------------------------------------*/\n \
        float lumaNESE = lumaNE + lumaSE;\n \
        float lumaNWNE = lumaNW + lumaNE;\n \
        float edgeHorz2 = (-2.0 * lumaE) + lumaNESE;\n \
        float edgeVert2 = (-2.0 * lumaN) + lumaNWNE;\n \
        /*--------------------------------------------------------------*/\n \
        float lumaNWSW = lumaNW + lumaSW;\n \
        float lumaSWSE = lumaSW + lumaSE;\n \
        float edgeHorz4 = (abs(edgeHorz1) * 2.0) + abs(edgeHorz2);\n \
        float edgeVert4 = (abs(edgeVert1) * 2.0) + abs(edgeVert2);\n \
        float edgeHorz3 = (-2.0 * lumaW) + lumaNWSW;\n \
        float edgeVert3 = (-2.0 * lumaS) + lumaSWSE;\n \
        float edgeHorz = abs(edgeHorz3) + edgeHorz4;\n \
        float edgeVert = abs(edgeVert3) + edgeVert4;\n \
        /*---------------------------------------------------------------*/\n \
        float subpixNWSWNESE = lumaNWSW + lumaNESE;\n \
        float lengthSign = qualityRcpFrame.x;\n \
        bool horzSpan = edgeHorz >= edgeVert;\n \
        float subpixA = subpixNSWE * 2.0 + subpixNWSWNESE;\n \
        /*-----------------------------------------------------------------*/\n \
        if(!horzSpan)lumaN = lumaW;\n \
        if(!horzSpan) lumaS = lumaE;\n \
        if(horzSpan) lengthSign = qualityRcpFrame.y;\n \
        float subpixB = (subpixA * (1.0/12.0)) - lumaM;\n \
        /*-----------------------------------------------------------------*/\n \
        float gradientN = lumaN - lumaM;\n \
        float gradientS = lumaS - lumaM;\n \
        float lumaNN = lumaN + lumaM;\n \
        float lumaSS = lumaS + lumaM;\n \
        bool pairN = abs(gradientN) >= abs(gradientS);\n \
        float gradient = max(abs(gradientN), abs(gradientS));\n \
        if(pairN) lengthSign = - lengthSign;\n \
        float subpixC = clamp(abs(subpixB)*subpixRcpRange, 0.0, 1.0);\n \
        /*------------------------------------------------------------------*/\n \
        vec2 posB;\n \
        posB.x = posM.x;\n \
        posB.y = posM.y;\n \
        vec2 offNP;\n \
        offNP.x = (!horzSpan) ? 0.0 : qualityRcpFrame.x;\n \
        offNP.y = (horzSpan) ? 0.0 : qualityRcpFrame.y;\n \
        if(!horzSpan) posB.x += lengthSign * 0.5;\n \
        if(horzSpan) posB.y += lengthSign * 0.5;\n \
        /*-------------------------------------------------------------------*/\n \
        vec2 posN;\n \
        posN.x = posB.x - offNP.x * FXAA_QUALITY__P0;\n \
        posN.y = posB.y - offNP.y * FXAA_QUALITY__P0;\n \
        vec2 posP;\n \
        posP.x = posB.x - offNP.x * FXAA_QUALITY__P0;\n \
        posP.y = posB.y - offNP.y * FXAA_QUALITY__P0;\n \
        float subpixD = ((-2.0)*subpixC) + 3.0;\n \
        float lumaEndN = FxaaLuma(textureLod(tex, posN, 0.0));\n \
        float subpixE = subpixC * subpixC;\n \
        float lumaEndP = FxaaLuma(textureLod(tex, posP, 0.0));\n \
        if (!pairN) lumaNN = lumaSS;\n \
        float gradientScaled = gradient * 1.0 /4.0;\n \
        float lumaMM = lumaM - lumaNN * 0.5;\n \
        float subpixF = subpixD * subpixE;\n \
        bool lumaMLTZero = lumaMM < 0.0;\n \
        /*---------------------------------------------------------*/\n \
        lumaEndN -= lumaNN * 0.5;\n \
        lumaEndP -= lumaNN * 0.5;\n \
        bool doneN = abs(lumaEndN) >= gradientScaled;\n \
        bool doneP = abs(lumaEndP) >= gradientScaled;\n \
        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P1;\n \
        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P1;\n \
        bool doneNP = (!doneN) || (!doneP);\n \
        if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P1;\n \
        if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P1;\n \
        /*-----------------------------------------------------------*/\n \
        if(doneNP)\n \
        {\n \
            if(!doneN) lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
            if(!doneP) lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
            doneN = abs(lumaEndN) >= gradientScaled;\n \
            doneP = abs(lumaEndP) >= gradientScaled;\n \
            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P2;\n \
            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P2;\n \
            doneNP = (!doneN) || (!doneP);\n \
            if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P2;\n \
            if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P2;\n \
    #if (FXAA_QUALITY__PS > 3)\n \
            if(doneNP) \n \
            {\n \
                if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                doneN = abs(lumaEndN) >= gradientScaled;\n \
                doneP = abs(lumaEndP) >= gradientScaled;\n \
                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P3;\n \
                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P3;\n \
                doneNP = (!doneN) || (!doneP);\n \
                if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P3;\n \
                if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P3;\n \
                /*-----------------------------------------------------------*/\n \
    #if (FXAA_QUALITY__PS > 4)\n \
                if(doneNP)\n \
                {\n \
                    if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                    if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                    doneN = abs(lumaEndN) >= gradientScaled;\n \
                    doneP = abs(lumaEndP) >= gradientScaled;\n \
                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P4;\n \
                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P4;\n \
                    doneNP = (!doneN) || (!doneP);\n \
                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P4;\n \
                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P4;\n \
    #if (FXAA_QUALITY__PS > 5)\n \
                    if(doneNP)\n \
                    {\n \
                        if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                        if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                        doneN = abs(lumaEndN) >= gradientScaled;\n \
                        doneP = abs(lumaEndP) >= gradientScaled;\n \
                        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P5;\n \
                        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P5;\n \
                        doneNP = (!doneN) || (!doneP);\n \
                        if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P5;\n \
                        if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P5;\n \
    #if (FXAA_QUALITY__PS > 6)\n \
                        if(doneNP)\n \
                        {\n \
                            if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                            if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                            doneN = abs(lumaEndN) >= gradientScaled;\n \
                            doneP = abs(lumaEndP) >= gradientScaled;\n \
                            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P6;\n \
                            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P6;\n \
                            doneNP = (!doneN) || (!doneP);\n \
                            if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P6;\n \
                            if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P6;\n \
    #if (FXAA_QUALITY__PS > 7)\n \
                            if(doneNP)\n \
                            {\n \
                                if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                                if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                                doneN = abs(lumaEndN) >= gradientScaled;\n \
                                doneP = abs(lumaEndP) >= gradientScaled;\n \
                                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P7;\n \
                                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P7;\n \
                                doneNP = (!doneN) || (!doneP);\n \
                                if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P7;\n \
                                if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P7;\n \
                                if(doneNP)\n \
                                {\n \
    #if (FXAA_QUALITY__PS > 8)\n \
                                    if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                                    if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                                    doneN = abs(lumaEndN) >= gradientScaled;\n \
                                    doneP = abs(lumaEndP) >= gradientScaled;\n \
                                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P8;\n \
                                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P8;\n \
                                    doneNP = (!doneN) || (!doneP);\n \
                                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P8;\n \
                                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P8;\n \
    #if (FXAA_QUALITY__PS > 9)\n \
                                    if(doneNP)\n \
                                    {\n \
                                        if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                                        if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                                        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                                        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                                        doneN = abs(lumaEndN) >= gradientScaled;\n \
                                        doneP = abs(lumaEndP) >= gradientScaled;\n \
                                        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P9;\n \
                                        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P9;\n \
                                        doneNP = (!doneN) || (!doneP);\n \
                                        if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P9;\n \
                                        if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P9;\n \
    #if (FXAA_QUALITY__PS > 10) \n \
                                        if(doneNP)\n \
                                        {\n \
                                            if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                                            if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                                            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                                            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                                            doneN = abs(lumaEndN) >= gradientScaled;\n \
                                            doneP = abs(lumaEndP) >= gradientScaled;\n \
                                            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P10;\n \
                                            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P10;\n \
                                            doneNP = (!doneN) || (!doneP);\n \
                                            if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P10;\n \
                                            if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P10;\n \
    #if (FXAA_QUALITY__PS > 11)\n \
                                            if(doneNP)\n \
                                            {\n \
                                                if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                                                if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                                                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                                                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                                                doneN = abs(lumaEndN) >= gradientScaled;\n \
                                                doneP = abs(lumaEndP) >= gradientScaled;\n \
                                                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P11;\n \
                                                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P11;\n \
                                                doneNP = (!doneN) || (!doneP);\n \
                                                if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P11;\n \
                                                if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P11;\n \
    #if (FXAA_QUALITY__PS > 12)                                            \n \
                                                if(doneNP)\n \
                                                {\n \
                                                    if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));\n \
                                                    if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));\n \
                                                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;\n \
                                                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;\n \
                                                    doneN = abs(lumaEndN) >= gradientScaled;\n \
                                                    doneP = abs(lumaEndP) >= gradientScaled;\n \
                                                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P12;\n \
                                                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P12;\n \
                                                    doneNP = (!doneN) || (!doneP);\n \
                                                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P12;\n \
                                                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P12;\n \
                                                }\n \
    #endif  //FXAA_QUALITY__PS_12                                            \n \
                                            }\n \
    #endif //FXAA_QUALITY__PS_11                                                          \n \
                                        }\n \
    #endif // FXAA_QUALITY__PS_10                                                                \n \
                                    }\n \
    #endif  //FXAA_QUALITY__PS_9 \n \
                                }\n \
    #endif //FXAA_QUALITY__PS_8                            \n \
                            }\n \
    #endif //FXAA_QUALITY__PS_7\n \
                        }\n \
    #endif //FXAA_QUALITY__PS_6\n \
                    }\n \
    #endif //FXAA_QUALITY__PS_5\n \
                }\n \
    #endif //FXAA_QUALITY__PS_4\n \
            } \n \
    #endif //FXAA_QUALITY__PS_3\n \
        }\n \
        /*------------------------------------------------------------------------------*/\n \
        float dstN = posM.x - posN.x;\n \
        float dstP = posP.x - posM.x;\n \
        if(!horzSpan) dstN = posM.y - posN.y;\n \
        if(!horzSpan) dstP = posP.y - posM.y;\n \
        /*--------------------------------------------------------------------------------*/\n \
        bool goodSpanN = (lumaEndN < 0.0) != lumaMLTZero;\n \
        float spanLength = (dstP + dstN);\n \
        bool goodSpanP = (lumaEndP < 0.0) != lumaMLTZero;\n \
        float spanLengthRcp = 1.0 / spanLength;\n \
        /*---------------------------------------------------------------------------------*/\n \
        bool directionN = dstN < dstP;\n \
        float dst = min(dstN , dstP);\n \
        bool goodSpan = directionN ? goodSpanN : goodSpanP;\n \
        float subpixG = subpixF * subpixF;\n \
        float pixelOffset = (dst * (-spanLengthRcp)) + 0.5;\n \
        float subpixH = subpixG * qualitySubpix;\n \
        /*------------------------------------------------------------------------------*/\n \
        float pixelOffsetGood = goodSpan ? pixelOffset : 0.0;\n \
        float pixelOffsetSubpix = max(pixelOffsetGood, subpixH);\n \
        if(!horzSpan) posM.x += pixelOffsetSubpix * lengthSign;\n \
        if(horzSpan) posM.y += pixelOffsetSubpix * lengthSign;\n \
        \n \
        //return vec4(texture(tex, posM.xy, 0.0).rgba);\n \
        return vec4(texture(tex, posM.xy, 0.0).rgb, 1.0);    \n \
    }\n \
    \n \
    void main()\n \
    {\n \
        vec4 color;\n \
        vec2 mainTexTexel = vec2(1.0, 1.0)/u_texture_size.xy;\n \
        /*color = FxaaPixelShader(\n \
            uv, \n \
            vec4(0.0), \n \
            _MainTex, \n \
            _MainTex, \n \
            _MainTex, \n \
            mainTexTexelSize.xy, \n \
            vec4(0.0), \n \
            vec4(0.0),\n \
            vec4(0.0), \n \
            FXAA_QUALITY_SUBPIX,\n \
            FXAA_QUALITY_EDGE_THRESHOLD,\n \
            FXAA_QUALITY_EDGE_THRESHOLD_MIN,\n \
            0.0,\n \
            0.0,\n \
            0.0,\n \
            vec4(0.0)\n \
            );*/\n \
    \n \
        color = FxaaPixelShader(v_uv, _MainTex, mainTexTexel, FXAA_QUALITY_EDGE_THRESHOLD, FXAA_QUALITY_EDGE_THRESHOLD_MIN, FXAA_QUALITY_SUBPIX);\n \
        o_fragColor = color;\n \
    }\n \
    "

    const kFxaaFS1 = "\
    precision highp float;    \n \
    varying vec2 v_uv;\n \
    uniform sampler2D _MainTex;\n \
    uniform vec2  u_texture_size;\n \
    uniform vec4  u_ScreenParams;\n \
    \n \
    #define EDGE_STEP_COUNT 10\n \
    #define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 4.0\n \
    #define EDGE_GUESS 8.0\n \
    \n \
    \n \
    const float _ContrastThreshold = 0.0312;\n \
    const float _RelativeThreshold = 0.063;\n \
    const float _SubpixelBlending = 1.0;\n \
    \n \
    struct LuminanceData {\n \
        float m, n, e, s, w;\n \
        float highest, lowest, contrast;\n \
        float ne, nw, se, sw;\n \
    };\n \
    \n \
    struct EdgeData\n \
    {\n \
        bool isHorizontal;\n \
        float pixelStep;\n \
        float oppositeLuminance, gradient;\n \
    };\n \
    \n \
    vec4 Sample(vec2 uv)\n \
    {\n \
        return texture2D(_MainTex, uv);\n \
    }\n \
    \n \
    float SampleLuminance(vec2 uv)\n \
    {\n \
        //default luminance green\n \
        return Sample(uv).g;\n \
    }\n \
    \n \
    float SampleLuminance(vec2 uv, float uOffset, float vOffset)\n \
    {\n \
        vec2 texture_texelSize = u_ScreenParams.zw - vec2(1.0);\n \
        uv += texture_texelSize * vec2(uOffset, vOffset);\n \
        return SampleLuminance(uv);\n \
    }\n \
    \n \
    LuminanceData SampleLuminanceNeighborhood(vec2 uv)\n \
    {\n \
        LuminanceData l;\n \
        l.m = SampleLuminance(uv);\n \
        l.n = SampleLuminance(uv, 0.0, 1.0);\n \
        l.e = SampleLuminance(uv, 1.0, 0.0);\n \
        l.s = SampleLuminance(uv, 0.0, -1.0);\n \
        l.w = SampleLuminance(uv, -1.0, 0.0);\n \
    \n \
        l.ne = SampleLuminance(uv, 1.0, 1.0);\n \
        l.nw = SampleLuminance(uv, -1.0, 1.0);\n \
        l.se = SampleLuminance(uv, 1.0, -1.0);\n \
        l.sw = SampleLuminance(uv, -1.0, -1.0);\n \
    \n \
        l.highest = max(max(max(max(l.n, l.e), l.s), l.w), l.m);\n \
        l.lowest = min(min(min(min(l.n, l.e), l.s), l.w), l.m);\n \
    \n \
        l.contrast = l.highest - l.lowest;\n \
        return l;\n \
    }\n \
    \n \
    float DeterminPixelBlendFactor(LuminanceData l)\n \
    {\n \
        float f = 2.0 * (l.n + l.e + l.s + l.w);\n \
        f += l.ne + l.nw + l.se + l.sw;\n \
        f *= 1.0/12.0;\n \
        f = abs(f - l.m);\n \
        f = clamp(f/l.contrast, 0.0, 1.0);\n \
        float blendFactor = smoothstep(0.0, 1.0, f);\n \
        return blendFactor * blendFactor * _SubpixelBlending;\n \
    }\n \
    \n \
    EdgeData DeterminEdge(LuminanceData l)\n \
    {\n \
        EdgeData e;\n \
        vec2 texture_texelSize = u_ScreenParams.zw - vec2(1.0);\n \
        float horizontal = \n \
            abs(l.n + l.s - 2.0 * l.m) * 2.0 + \n \
            abs(l.ne + l.se - 2.0 * l.e) +\n \
            abs(l.nw + l.sw - 2.0 * l.w);\n \
        float vertical = \n \
            abs(l.e + l.w - 2.0 * l.m) * 2.0 + \n \
            abs(l.ne + l.nw - 2.0 * l.n) + \n \
            abs(l.se + l.sw - 2.0 * l.s);\n \
        if(horizontal >= vertical)\n \
        {\n \
            e.isHorizontal = true;\n \
        }else{\n \
            e.isHorizontal = false;\n \
        }\n \
        \n \
        float pLuminance = e.isHorizontal ? l.n : l.e;\n \
        float nLuminance = e.isHorizontal ? l.s : l.w;\n \
        float pGradient = abs(pLuminance - l.m);\n \
        float nGradient = abs(nLuminance - l.m);\n \
    \n \
        e.pixelStep = e.isHorizontal ? texture_texelSize.y : texture_texelSize.x;\n \
        if(pGradient < nGradient)\n \
        {\n \
            e.pixelStep = -e.pixelStep;\n \
            e.oppositeLuminance = nLuminance;\n \
            e.gradient = nGradient;\n \
        }else\n \
        {\n \
            e.oppositeLuminance = pLuminance;\n \
            e.gradient = pGradient;\n \
        }\n \
    \n \
        return e;\n \
    }\n \
    \n \
    float DeterminEdgeBlendFactor(LuminanceData l, EdgeData e, vec2 uv)\n \
    {\n \
        float edgeSteps[10];\n \
        edgeSteps[0] = 1.0;\n \
        edgeSteps[1] = 1.5;\n \
        edgeSteps[2] = 2.0;\n \
        edgeSteps[3] = 2.0;\n \
        edgeSteps[4] = 2.0;\n \
        edgeSteps[5] = 2.0;\n \
        edgeSteps[6] = 2.0;\n \
        edgeSteps[7] = 2.0;\n \
        edgeSteps[8] = 2.0;\n \
        edgeSteps[9] = 4.0;\n \
    \n \
        vec2 uvEdge = uv;\n \
        vec2 edgeStep;\n \
        vec2 texture_texelSize = u_ScreenParams.zw - vec2(1.0);\n \
        if(e.isHorizontal)\n \
        {\n \
            uvEdge.y += e.pixelStep * 0.5;\n \
            edgeStep = vec2(texture_texelSize.x , 0.0);\n \
        }else{\n \
            uvEdge.x += e.pixelStep * 0.5;\n \
            edgeStep = vec2(0.0, texture_texelSize.y);\n \
        }\n \
    \n \
        float edgeLuminance = (l.m + e.oppositeLuminance) * 0.5;\n \
        float gradientThreshold = e.gradient * 0.25;\n \
    \n \
        vec2 puv = uvEdge + edgeStep * edgeSteps[0];\n \
        float pLuminanceDelta = SampleLuminance(puv) - edgeLuminance;\n \
        bool pAtEnd = abs(pLuminanceDelta) >= gradientThreshold;\n \
    \n \
        for(int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++)\n \
        {\n \
            puv += edgeStep * edgeSteps[i];\n \
            pLuminanceDelta = SampleLuminance(puv) - edgeLuminance;\n \
            pAtEnd = abs(pLuminanceDelta) >= gradientThreshold;\n \
        }\n \
    \n \
        if(!pAtEnd)\n \
        {\n \
            puv += edgeStep * EDGE_GUESS;\n \
        }\n \
    \n \
        vec2 nuv = uvEdge - edgeStep * edgeSteps[0];\n \
        float nLuminanceDelta = SampleLuminance(nuv) - edgeLuminance;\n \
        bool nAtEnd = abs(nLuminanceDelta) >= gradientThreshold;\n \
    \n \
        for(int i = 0; i < EDGE_STEP_COUNT && !nAtEnd; i++)\n \
        {\n \
            nuv -= edgeStep * edgeSteps[i];\n \
            nLuminanceDelta = SampleLuminance(nuv) - edgeLuminance;\n \
            nAtEnd = abs(nLuminanceDelta) >= gradientThreshold;\n \
        }\n \
    \n \
        if(!nAtEnd){\n \
            nuv -= edgeStep * EDGE_GUESS;\n \
        }\n \
    \n \
    \n \
    \n \
        float pDistance, nDistance;\n \
        if(e.isHorizontal)\n \
        {\n \
            pDistance = puv.x - uv.x;\n \
            nDistance = uv.x - nuv.x;\n \
        }else{\n \
            pDistance = puv.y - uv.y;\n \
            nDistance = uv.y - nuv.y;\n \
        }\n \
    \n \
        float shortestDistance;\n \
        bool deltaSign;\n \
        if(pDistance <= nDistance)\n \
        {\n \
            shortestDistance = pDistance;\n \
            deltaSign = pLuminanceDelta >= 0.0;\n \
        }\n \
        else\n \
        {\n \
            shortestDistance = nDistance;\n \
            deltaSign = nLuminanceDelta >= 0.0;\n \
        }\n \
    \n \
    \n \
        if(deltaSign == (l.m - edgeLuminance >= 0.0)){\n \
            return 0.0;\n \
        }\n \
    \n \
        \n \
        return 0.5 - shortestDistance /(pDistance + nDistance);\n \
        return 0.0;\n \
    }\n \
    \n \
    bool ShouldSkipPixel(LuminanceData l)\n \
    {\n \
        float threshold = \n \
            max(_ContrastThreshold, _RelativeThreshold * l.highest);\n \
        return l.contrast < threshold;\n \
    }\n \
    \n \
    vec4 ApplyFXAA(vec2 uv)\n \
    {\n \
        LuminanceData l = SampleLuminanceNeighborhood(uv);\n \
    \n \
        if(ShouldSkipPixel(l))\n \
        {\n \
            return Sample(uv);\n \
        }\n \
    \n \
        float pixelBlend = DeterminPixelBlendFactor(l);\n \
        EdgeData e = DeterminEdge(l);\n \
        \n \
        float edgeBlend = DeterminEdgeBlendFactor(l, e, uv);\n \
        float finalBlend = max(pixelBlend, edgeBlend);\n \
    \n \
        if(e.isHorizontal)\n \
        {\n \
            uv.y += e.pixelStep * finalBlend;\n \
        }\n \
        else\n \
        {\n \
            uv.x += e.pixelStep * finalBlend;\n \
        }\n \
    \n \
        return Sample(uv);\n \
    }\n \
    \n \
    void main()\n \
    {\n \
        // Avoid u_ScreenParam is undefine, for unknown reasons.\n \
        if (u_ScreenParams.z < 1.0)\n \
        {\n \
            gl_FragColor = Sample(v_uv);\n \
            return;\n \
        }\n \
        vec4 color = ApplyFXAA(v_uv);\n \
        gl_FragColor = color;\n \
    }\n \
    "
    exports.kFxaaVS = kFxaaVS
    exports.kFxaaFS1 = kFxaaFS1