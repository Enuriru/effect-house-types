kFxaaVS = [[
attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 v_uv;
void main() {
    gl_Position = vec4(inPosition, 1.0);
    v_uv = inTexCoord;
}
]]

kFxaaFS = [[
#version 300 es
precision highp float;    
in vec2 v_uv;
uniform sampler2D _MainTex;
uniform vec2  u_texture_size;
layout(location = 0) out vec4 o_fragColor;

const ivec2 P_OFF[6] = ivec2[](
    ivec2(-1, -1),
    ivec2(1, 1),
    ivec2(0, -1),
    ivec2(-1, 0),
    ivec2(1, -1),
    ivec2(-1, 1)
);

/*--------------------------dither ---------------------------*/
/*vec3 Dither(vec3 color, vec2 uv)
{

}*/

/*----------------------------------------------------------*/
#ifdef FXAA_KEEP_ALPHA
#define FXAA_GREEN_AS_LUMA 0
#else
#define FXAA_GREEN_AS_LUMA 1
#endif
/*-----------------------------------------------------------*/

/*#ifndef FXAA_LOW
#define FXAA_QUALITY__PRESET 12
#define FXAA_QUALITY_SUBPIX 1.0
#define FXAA_QUALITY_EDGE_THRESHOLD 0.166
#define FXAA_QUALITY_EDGE_THRESHOLD_MIN 0.0625
#else*/
#define FXAA_QUALITY__PRESET 28
#define FXAA_QUALITY_SUBPIX 1.8
#define FXAA_QUALITY_EDGE_THRESHOLD 0.063
#define FXAA_QUALITY_EDGE_THRESHOLD_MIN 0.0312
//#endif
/*------------------------------------------------------------*/
#if (FXAA_QUALITY__PRESET == 12)
#define FXAA_QUALITY__PS 5
#define FXAA_QUALITY__P0 1.0
#define FXAA_QUALITY__P1 1.5
#define FXAA_QUALITY__P2 2.0
#define FXAA_QUALITY__P3 4.0
#define FXAA_QUALITY__P4 12.0
#endif
/*-------------------------------------------------------------*/
#if (FXAA_QUALITY__PRESET == 28)
#define FXAA_QUALITY__PS 11
#define FXAA_QUALITY__P0 1.0
#define FXAA_QUALITY__P1 1.5
#define FXAA_QUALITY__P2 2.0
#define FXAA_QUALITY__P3 2.0
#define FXAA_QUALITY__P4 2.0
#define FXAA_QUALITY__P5 2.0
#define FXAA_QUALITY__P6 2.0
#define FXAA_QUALITY__P7 2.0
#define FXAA_QUALITY__P8 2.0
#define FXAA_QUALITY__P9 4.0
#define FXAA_QUALITY__P10 8.0
#endif
/*--------------------------------------------------------------*/
#if (FXAA_GREEN_AS_LUMA == 0)
float FxaaLuma(vec4 rgba) 
{
    return rgba.w;
}
#else
float FxaaLuma(vec4 rgba)
{
    return rgba.y;
}
#endif

/*----------------------------------------------------------------*/
//vec4 FxaaPixelShader(vec2 uv, vec4 pos, sampler2D tex, sampler2D texExpBiasNegOne, sampler2D texExpBiasNegTwo, vec2 qualityRcpFrame, vec4 rcpFrameOpt, vec4 rcpFrameOpt2, vec4 rcpFrame360Opt2, float qualitySubpix, float edgeThreshold, float edgeThresholdMin, float edgeSharpness, float cedgeThreshold, float cedgeThresholdMin, vec4 constDir)
vec4 FxaaPixelShader(vec2 uv, sampler2D tex, vec2 qualityRcpFrame, float edgeThreshold, float edgeThresholdMin, float qualitySubpix)
{
    vec2 posM;
    posM.x = uv.x;
    posM.y = uv.y;

    //if no fxaa gather alpha
    vec4 rgbyM = texture(tex, posM, 0.0);
#if (FXAA_GREEN_AS_LUMA == 0)
#define lumaM rgbyM.w
#else
#define lumaM rgbyM.y
#endif
    
    float lumaS = FxaaLuma(textureLod(tex, posM + vec2(0.0, 1.0)  * qualityRcpFrame.xy, 0.0));
    float lumaE = FxaaLuma(textureLod(tex, posM + vec2(1.0, 0.0)  * qualityRcpFrame.xy, 1.0));
    float lumaN = FxaaLuma(textureLod(tex, posM + vec2(0.0, -1.0) * qualityRcpFrame.xy, 1.0));
    float lumaW = FxaaLuma(textureLod(tex, posM + vec2(-1.0, 0.0) * qualityRcpFrame.xy, 1.0));

    /*---------------------------------------------------------*/
    float maxSM = max(lumaS, lumaM);
    float minSM = min(lumaS, lumaM);
    float maxESM = max(lumaE, maxSM);
    float minESM = min(lumaE, minSM);
    float maxWN = max(lumaN, lumaW);
    float minWN = min(lumaN, lumaW);
    float rangeMax = max(maxWN, maxESM);
    float rangeMin = min(minWN, minESM);
    float rangeMaxScaled = rangeMax * edgeThreshold;
    float range = rangeMax - rangeMin;
    float rangeMaxClamped = max(edgeThresholdMin, rangeMaxScaled);
    bool earlyExit = range < rangeMaxClamped;
    /*----------------------------------------------------------*/
    if(earlyExit)
    {
        //discard;
        return rgbyM;
    }

    float lumaNW = FxaaLuma(textureLod(tex, posM + ivec2(-1, -1) * qualityRcpFrame.xy, 1.0));
    float lumaSE = FxaaLuma(textureLod(tex, posM + vec2(1.0, 1.0) * qualityRcpFrame.xy, 1.0));
    float lumaNE = FxaaLuma(textureLod(tex, posM + vec2(1.0, -1.0) * qualityRcpFrame.xy, 1.0));
    float lumaSW = FxaaLuma(textureLod(tex, posM + vec2(-1.0, 1.0) * qualityRcpFrame.xy, 1.0));

    /*-----------------------------------------------------------*/
    float lumaNS = lumaN + lumaS;
    float lumaWE = lumaW + lumaE;
    float subpixRcpRange = 1.0/range;
    float subpixNSWE = lumaNS + lumaWE;
    float edgeHorz1 = (-2.0 * lumaM) + lumaNS;
    float edgeVert1 = (-2.0 * lumaM) + lumaWE;
    /*----------------------------------------------------------*/
    float lumaNESE = lumaNE + lumaSE;
    float lumaNWNE = lumaNW + lumaNE;
    float edgeHorz2 = (-2.0 * lumaE) + lumaNESE;
    float edgeVert2 = (-2.0 * lumaN) + lumaNWNE;
    /*--------------------------------------------------------------*/
    float lumaNWSW = lumaNW + lumaSW;
    float lumaSWSE = lumaSW + lumaSE;
    float edgeHorz4 = (abs(edgeHorz1) * 2.0) + abs(edgeHorz2);
    float edgeVert4 = (abs(edgeVert1) * 2.0) + abs(edgeVert2);
    float edgeHorz3 = (-2.0 * lumaW) + lumaNWSW;
    float edgeVert3 = (-2.0 * lumaS) + lumaSWSE;
    float edgeHorz = abs(edgeHorz3) + edgeHorz4;
    float edgeVert = abs(edgeVert3) + edgeVert4;
    /*---------------------------------------------------------------*/
    float subpixNWSWNESE = lumaNWSW + lumaNESE;
    float lengthSign = qualityRcpFrame.x;
    bool horzSpan = edgeHorz >= edgeVert;
    float subpixA = subpixNSWE * 2.0 + subpixNWSWNESE;
    /*-----------------------------------------------------------------*/
    if(!horzSpan)lumaN = lumaW;
    if(!horzSpan) lumaS = lumaE;
    if(horzSpan) lengthSign = qualityRcpFrame.y;
    float subpixB = (subpixA * (1.0/12.0)) - lumaM;
    /*-----------------------------------------------------------------*/
    float gradientN = lumaN - lumaM;
    float gradientS = lumaS - lumaM;
    float lumaNN = lumaN + lumaM;
    float lumaSS = lumaS + lumaM;
    bool pairN = abs(gradientN) >= abs(gradientS);
    float gradient = max(abs(gradientN), abs(gradientS));
    if(pairN) lengthSign = - lengthSign;
    float subpixC = clamp(abs(subpixB)*subpixRcpRange, 0.0, 1.0);
    /*------------------------------------------------------------------*/
    vec2 posB;
    posB.x = posM.x;
    posB.y = posM.y;
    vec2 offNP;
    offNP.x = (!horzSpan) ? 0.0 : qualityRcpFrame.x;
    offNP.y = (horzSpan) ? 0.0 : qualityRcpFrame.y;
    if(!horzSpan) posB.x += lengthSign * 0.5;
    if(horzSpan) posB.y += lengthSign * 0.5;
    /*-------------------------------------------------------------------*/
    vec2 posN;
    posN.x = posB.x - offNP.x * FXAA_QUALITY__P0;
    posN.y = posB.y - offNP.y * FXAA_QUALITY__P0;
    vec2 posP;
    posP.x = posB.x - offNP.x * FXAA_QUALITY__P0;
    posP.y = posB.y - offNP.y * FXAA_QUALITY__P0;
    float subpixD = ((-2.0)*subpixC) + 3.0;
    float lumaEndN = FxaaLuma(textureLod(tex, posN, 0.0));
    float subpixE = subpixC * subpixC;
    float lumaEndP = FxaaLuma(textureLod(tex, posP, 0.0));
    if (!pairN) lumaNN = lumaSS;
    float gradientScaled = gradient * 1.0 /4.0;
    float lumaMM = lumaM - lumaNN * 0.5;
    float subpixF = subpixD * subpixE;
    bool lumaMLTZero = lumaMM < 0.0;
    /*---------------------------------------------------------*/
    lumaEndN -= lumaNN * 0.5;
    lumaEndP -= lumaNN * 0.5;
    bool doneN = abs(lumaEndN) >= gradientScaled;
    bool doneP = abs(lumaEndP) >= gradientScaled;
    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P1;
    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P1;
    bool doneNP = (!doneN) || (!doneP);
    if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P1;
    if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P1;
    /*-----------------------------------------------------------*/
    if(doneNP)
    {
        if(!doneN) lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
        if(!doneP) lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
        doneN = abs(lumaEndN) >= gradientScaled;
        doneP = abs(lumaEndP) >= gradientScaled;
        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P2;
        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P2;
        doneNP = (!doneN) || (!doneP);
        if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P2;
        if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P2;
#if (FXAA_QUALITY__PS > 3)
        if(doneNP) 
        {
            if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
            if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
            doneN = abs(lumaEndN) >= gradientScaled;
            doneP = abs(lumaEndP) >= gradientScaled;
            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P3;
            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P3;
            doneNP = (!doneN) || (!doneP);
            if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P3;
            if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P3;
            /*-----------------------------------------------------------*/
#if (FXAA_QUALITY__PS > 4)
            if(doneNP)
            {
                if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                doneN = abs(lumaEndN) >= gradientScaled;
                doneP = abs(lumaEndP) >= gradientScaled;
                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P4;
                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P4;
                doneNP = (!doneN) || (!doneP);
                if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P4;
                if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P4;
#if (FXAA_QUALITY__PS > 5)
                if(doneNP)
                {
                    if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                    if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                    doneN = abs(lumaEndN) >= gradientScaled;
                    doneP = abs(lumaEndP) >= gradientScaled;
                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P5;
                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P5;
                    doneNP = (!doneN) || (!doneP);
                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P5;
                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P5;
#if (FXAA_QUALITY__PS > 6)
                    if(doneNP)
                    {
                        if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                        if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                        doneN = abs(lumaEndN) >= gradientScaled;
                        doneP = abs(lumaEndP) >= gradientScaled;
                        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P6;
                        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P6;
                        doneNP = (!doneN) || (!doneP);
                        if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P6;
                        if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P6;
#if (FXAA_QUALITY__PS > 7)
                        if(doneNP)
                        {
                            if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                            if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                            doneN = abs(lumaEndN) >= gradientScaled;
                            doneP = abs(lumaEndP) >= gradientScaled;
                            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P7;
                            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P7;
                            doneNP = (!doneN) || (!doneP);
                            if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P7;
                            if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P7;
                            if(doneNP)
                            {
#if (FXAA_QUALITY__PS > 8)
                                if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                                if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                                doneN = abs(lumaEndN) >= gradientScaled;
                                doneP = abs(lumaEndP) >= gradientScaled;
                                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P8;
                                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P8;
                                doneNP = (!doneN) || (!doneP);
                                if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P8;
                                if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P8;
#if (FXAA_QUALITY__PS > 9)
                                if(doneNP)
                                {
                                    if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                                    if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                                    doneN = abs(lumaEndN) >= gradientScaled;
                                    doneP = abs(lumaEndP) >= gradientScaled;
                                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P9;
                                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P9;
                                    doneNP = (!doneN) || (!doneP);
                                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P9;
                                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P9;
 #if (FXAA_QUALITY__PS > 10) 
                                    if(doneNP)
                                    {
                                        if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                                        if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                                        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                                        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                                        doneN = abs(lumaEndN) >= gradientScaled;
                                        doneP = abs(lumaEndP) >= gradientScaled;
                                        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P10;
                                        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P10;
                                        doneNP = (!doneN) || (!doneP);
                                        if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P10;
                                        if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P10;
#if (FXAA_QUALITY__PS > 11)
                                        if(doneNP)
                                        {
                                            if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                                            if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                                            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                                            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                                            doneN = abs(lumaEndN) >= gradientScaled;
                                            doneP = abs(lumaEndP) >= gradientScaled;
                                            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P11;
                                            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P11;
                                            doneNP = (!doneN) || (!doneP);
                                            if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P11;
                                            if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P11;
#if (FXAA_QUALITY__PS > 12)                                            
                                            if(doneNP)
                                            {
                                                if(!doneN)lumaEndN = FxaaLuma(textureLod(tex, posN.xy, 0.0));
                                                if(!doneP)lumaEndP = FxaaLuma(textureLod(tex, posP.xy, 0.0));
                                                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;
                                                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;
                                                doneN = abs(lumaEndN) >= gradientScaled;
                                                doneP = abs(lumaEndP) >= gradientScaled;
                                                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY__P12;
                                                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY__P12;
                                                doneNP = (!doneN) || (!doneP);
                                                if(!doneP) posP.x += offNP.x * FXAA_QUALITY__P12;
                                                if(!doneP) posP.y += offNP.y * FXAA_QUALITY__P12;
                                            }
#endif  //FXAA_QUALITY__PS_12                                            
                                        }
#endif //FXAA_QUALITY__PS_11                                                          
                                    }
#endif // FXAA_QUALITY__PS_10                                                                
                                }
#endif  //FXAA_QUALITY__PS_9 
                            }
#endif //FXAA_QUALITY__PS_8                            
                        }
#endif //FXAA_QUALITY__PS_7
                    }
#endif //FXAA_QUALITY__PS_6
                }
#endif //FXAA_QUALITY__PS_5
            }
#endif //FXAA_QUALITY__PS_4
        } 
#endif //FXAA_QUALITY__PS_3
    }
    /*------------------------------------------------------------------------------*/
    float dstN = posM.x - posN.x;
    float dstP = posP.x - posM.x;
    if(!horzSpan) dstN = posM.y - posN.y;
    if(!horzSpan) dstP = posP.y - posM.y;
    /*--------------------------------------------------------------------------------*/
    bool goodSpanN = (lumaEndN < 0.0) != lumaMLTZero;
    float spanLength = (dstP + dstN);
    bool goodSpanP = (lumaEndP < 0.0) != lumaMLTZero;
    float spanLengthRcp = 1.0 / spanLength;
    /*---------------------------------------------------------------------------------*/
    bool directionN = dstN < dstP;
    float dst = min(dstN , dstP);
    bool goodSpan = directionN ? goodSpanN : goodSpanP;
    float subpixG = subpixF * subpixF;
    float pixelOffset = (dst * (-spanLengthRcp)) + 0.5;
    float subpixH = subpixG * qualitySubpix;
    /*------------------------------------------------------------------------------*/
    float pixelOffsetGood = goodSpan ? pixelOffset : 0.0;
    float pixelOffsetSubpix = max(pixelOffsetGood, subpixH);
    if(!horzSpan) posM.x += pixelOffsetSubpix * lengthSign;
    if(horzSpan) posM.y += pixelOffsetSubpix * lengthSign;
    
    //return vec4(texture(tex, posM.xy, 0.0).rgba);
    return vec4(texture(tex, posM.xy, 0.0).rgb, 1.0);    
}

void main()
{
    vec4 color;
    vec2 mainTexTexel = vec2(1.0, 1.0)/u_texture_size.xy;
    /*color = FxaaPixelShader(
        uv, 
        vec4(0.0), 
        _MainTex, 
        _MainTex, 
        _MainTex, 
        mainTexTexelSize.xy, 
        vec4(0.0), 
        vec4(0.0),
        vec4(0.0), 
        FXAA_QUALITY_SUBPIX,
        FXAA_QUALITY_EDGE_THRESHOLD,
        FXAA_QUALITY_EDGE_THRESHOLD_MIN,
        0.0,
        0.0,
        0.0,
        vec4(0.0)
        );*/

    color = FxaaPixelShader(v_uv, _MainTex, mainTexTexel, FXAA_QUALITY_EDGE_THRESHOLD, FXAA_QUALITY_EDGE_THRESHOLD_MIN, FXAA_QUALITY_SUBPIX);
    o_fragColor = color;
}
]]

kFxaaFS1 = [[
precision highp float;    
varying vec2 v_uv;
uniform sampler2D _MainTex;
uniform vec2  u_texture_size;
uniform vec4  u_ScreenParams;

#define EDGE_STEP_COUNT 10
#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 4.0
#define EDGE_GUESS 8.0


const float _ContrastThreshold = 0.0312;
const float _RelativeThreshold = 0.063;
const float _SubpixelBlending = 1.0;

struct LuminanceData {
    float m, n, e, s, w;
    float highest, lowest, contrast;
    float ne, nw, se, sw;
};

struct EdgeData
{
    bool isHorizontal;
    float pixelStep;
    float oppositeLuminance, gradient;
};

vec4 Sample(vec2 uv)
{
    return texture2D(_MainTex, uv);
}

float SampleLuminance(vec2 uv)
{
    //default luminance green
    return Sample(uv).g;
}

float SampleLuminance(vec2 uv, float uOffset, float vOffset)
{
    vec2 texture_texelSize = u_ScreenParams.zw - vec2(1.0);
    uv += texture_texelSize * vec2(uOffset, vOffset);
    return SampleLuminance(uv);
}

LuminanceData SampleLuminanceNeighborhood(vec2 uv)
{
    LuminanceData l;
    l.m = SampleLuminance(uv);
    l.n = SampleLuminance(uv, 0.0, 1.0);
    l.e = SampleLuminance(uv, 1.0, 0.0);
    l.s = SampleLuminance(uv, 0.0, -1.0);
    l.w = SampleLuminance(uv, -1.0, 0.0);

    l.ne = SampleLuminance(uv, 1.0, 1.0);
    l.nw = SampleLuminance(uv, -1.0, 1.0);
    l.se = SampleLuminance(uv, 1.0, -1.0);
    l.sw = SampleLuminance(uv, -1.0, -1.0);

    l.highest = max(max(max(max(l.n, l.e), l.s), l.w), l.m);
    l.lowest = min(min(min(min(l.n, l.e), l.s), l.w), l.m);

    l.contrast = l.highest - l.lowest;
    return l;
}

float DeterminPixelBlendFactor(LuminanceData l)
{
    float f = 2.0 * (l.n + l.e + l.s + l.w);
    f += l.ne + l.nw + l.se + l.sw;
    f *= 1.0/12.0;
    f = abs(f - l.m);
    f = clamp(f/l.contrast, 0.0, 1.0);
    float blendFactor = smoothstep(0.0, 1.0, f);
    return blendFactor * blendFactor * _SubpixelBlending;
}

EdgeData DeterminEdge(LuminanceData l)
{
    EdgeData e;
    vec2 texture_texelSize = u_ScreenParams.zw - vec2(1.0);
    float horizontal = 
        abs(l.n + l.s - 2.0 * l.m) * 2.0 + 
        abs(l.ne + l.se - 2.0 * l.e) +
        abs(l.nw + l.sw - 2.0 * l.w);
    float vertical = 
        abs(l.e + l.w - 2.0 * l.m) * 2.0 + 
        abs(l.ne + l.nw - 2.0 * l.n) + 
        abs(l.se + l.sw - 2.0 * l.s);
    if(horizontal >= vertical)
    {
        e.isHorizontal = true;
    }else{
        e.isHorizontal = false;
    }
    
    float pLuminance = e.isHorizontal ? l.n : l.e;
    float nLuminance = e.isHorizontal ? l.s : l.w;
    float pGradient = abs(pLuminance - l.m);
    float nGradient = abs(nLuminance - l.m);

    e.pixelStep = e.isHorizontal ? texture_texelSize.y : texture_texelSize.x;
    if(pGradient < nGradient)
    {
        e.pixelStep = -e.pixelStep;
        e.oppositeLuminance = nLuminance;
        e.gradient = nGradient;
    }else
    {
        e.oppositeLuminance = pLuminance;
        e.gradient = pGradient;
    }

    return e;
}

float DeterminEdgeBlendFactor(LuminanceData l, EdgeData e, vec2 uv)
{
    float edgeSteps[10];
    edgeSteps[0] = 1.0;
    edgeSteps[1] = 1.5;
    edgeSteps[2] = 2.0;
    edgeSteps[3] = 2.0;
    edgeSteps[4] = 2.0;
    edgeSteps[5] = 2.0;
    edgeSteps[6] = 2.0;
    edgeSteps[7] = 2.0;
    edgeSteps[8] = 2.0;
    edgeSteps[9] = 4.0;

    vec2 uvEdge = uv;
    vec2 edgeStep;
    vec2 texture_texelSize = u_ScreenParams.zw - vec2(1.0);
    if(e.isHorizontal)
    {
        uvEdge.y += e.pixelStep * 0.5;
        edgeStep = vec2(texture_texelSize.x , 0.0);
    }else{
        uvEdge.x += e.pixelStep * 0.5;
        edgeStep = vec2(0.0, texture_texelSize.y);
    }

    float edgeLuminance = (l.m + e.oppositeLuminance) * 0.5;
    float gradientThreshold = e.gradient * 0.25;

    vec2 puv = uvEdge + edgeStep * edgeSteps[0];
    float pLuminanceDelta = SampleLuminance(puv) - edgeLuminance;
    bool pAtEnd = abs(pLuminanceDelta) >= gradientThreshold;

    for(int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++)
    {
        puv += edgeStep * edgeSteps[i];
        pLuminanceDelta = SampleLuminance(puv) - edgeLuminance;
        pAtEnd = abs(pLuminanceDelta) >= gradientThreshold;
    }

    if(!pAtEnd)
    {
        puv += edgeStep * EDGE_GUESS;
    }

    vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
    float nLuminanceDelta = SampleLuminance(nuv) - edgeLuminance;
    bool nAtEnd = abs(nLuminanceDelta) >= gradientThreshold;

    for(int i = 0; i < EDGE_STEP_COUNT && !nAtEnd; i++)
    {
        nuv -= edgeStep * edgeSteps[i];
        nLuminanceDelta = SampleLuminance(nuv) - edgeLuminance;
        nAtEnd = abs(nLuminanceDelta) >= gradientThreshold;
    }

    if(!nAtEnd){
        nuv -= edgeStep * EDGE_GUESS;
    }



    float pDistance, nDistance;
    if(e.isHorizontal)
    {
        pDistance = puv.x - uv.x;
        nDistance = uv.x - nuv.x;
    }else{
        pDistance = puv.y - uv.y;
        nDistance = uv.y - nuv.y;
    }

    float shortestDistance;
    bool deltaSign;
    if(pDistance <= nDistance)
    {
        shortestDistance = pDistance;
        deltaSign = pLuminanceDelta >= 0.0;
    }
    else
    {
        shortestDistance = nDistance;
        deltaSign = nLuminanceDelta >= 0.0;
    }


    if(deltaSign == (l.m - edgeLuminance >= 0.0)){
        return 0.0;
    }

    
    return 0.5 - shortestDistance /(pDistance + nDistance);
    return 0.0;
}

bool ShouldSkipPixel(LuminanceData l)
{
    float threshold = 
        max(_ContrastThreshold, _RelativeThreshold * l.highest);
    return l.contrast < threshold;
}

vec4 ApplyFXAA(vec2 uv)
{
    LuminanceData l = SampleLuminanceNeighborhood(uv);

    if(ShouldSkipPixel(l))
    {
        return Sample(uv);
    }

    float pixelBlend = DeterminPixelBlendFactor(l);
    EdgeData e = DeterminEdge(l);
    
    float edgeBlend = DeterminEdgeBlendFactor(l, e, uv);
    float finalBlend = max(pixelBlend, edgeBlend);

    if(e.isHorizontal)
    {
        uv.y += e.pixelStep * finalBlend;
    }
    else
    {
        uv.x += e.pixelStep * finalBlend;
    }

    return Sample(uv);
}

void main()
{
    vec4 color = ApplyFXAA(v_uv);
    gl_FragColor = color;
}
]]



FxaaShader = ScriptableObject(BaseShader)

function FxaaShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("Fxaa")
        -- 0. Fxaa Pass
        AddPassToMaterial(material, "gles2", kFxaaVS, kFxaaFS1)
        self.material = material
    end
    return self.material
end