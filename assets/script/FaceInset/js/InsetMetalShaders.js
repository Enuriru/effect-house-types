// Class: InsetShaders
// Static class containing static helper functions for shaders
const InsetShaders_Metal = 
{
    MaskBuilder : 
    {
        VS:`
#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    spvUnsafeArray<float2, NUM_KEYPOINTS> u_Keypoints;
    float3 u_Rotation;
    float u_CenterMode;
    float u_ScreenSpaceMode;
    float u_AspectRatio;
};

struct main0_out
{
    float2 v_UV;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 inPosition [[attribute(0)]];
    float2 inTexCoord [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 _873;
    _873 = float2(0.0);
    for (int _872 = 0; _872 < NUM_KEYPOINTS; )
    {
        _873 += buffer.u_Keypoints[_872];
        _872++;
        continue;
    }
    float2 _440 = _873 / float(NUM_KEYPOINTS);
    float2 _875;
    float2 _876;
    float2 _877;
    float2 _878;
    _878 = float2(0.5, 0.0);
    _877 = float2(0.5, 1.0);
    _876 = float2(0.0, 0.5);
    _875 = float2(1.0, 0.5);
    for (int _874 = 0; _874 < NUM_KEYPOINTS; )
    {
        float _470 = -buffer.u_Rotation.z;
        float _556 = cos(_470);
        float _558 = sin(_470);
        float2 _550 = ((buffer.u_Keypoints[_874] - _440) * float2x2(float2(_556, -_558), float2(_558, _556))) + _440;
        float _477 = _550.x;
        float _497 = _550.y;
        _878 = mix(_878, _550, float2(float(_497 > _878.y)));
        _877 = mix(_877, _550, float2(float(_497 < _877.y)));
        _876 = mix(_876, _550, float2(float(_477 > _876.x)));
        _875 = mix(_875, _550, float2(float(_477 < _875.x)));
        _874++;
        continue;
    }
    float _587 = cos(buffer.u_Rotation.z);
    float _589 = sin(buffer.u_Rotation.z);
    float2x2 _598 = float2x2(float2(_587, -_589), float2(_589, _587));
    float2 _581 = ((_875 - _440) * _598) + _440;
    float2 _612 = ((_876 - _440) * _598) + _440;
    float2 _643 = ((_877 - _440) * _598) + _440;
    float2 _674 = ((_878 - _440) * _598) + _440;
    float _716 = 3.599999904632568359375 * buffer.u_AspectRatio;
    float2 _719 = _581 - _612;
    float2 _722 = _643 - _674;
    float2 _866 = _719;
    _866.x = _719.x * _716;
    float2 _869 = _722;
    _869.x = _722.x * _716;
    float _739 = fast::max(length(_869), length(_866));
    float2 _743 = float2(_739) * float2(0.5);
    float2 _746 = float2(1.0 / buffer.u_AspectRatio, 1.0);
    float2 _748 = _746 * 0.75;
    float2 _879;
    if (buffer.u_CenterMode == 0.0)
    {
        _879 = _440;
    }
    else
    {
        float2 _821 = mix(_746, float2(1.0), float2(buffer.u_ScreenSpaceMode));
        _879 = mix((_581 + _612) * 0.5, (_643 + _674) * 0.5, float2(smoothstep(0.75, 1.25, length(_722 * _821) / length(_719 * _821))));
    }
    out.v_UV = (((((in.inTexCoord * _739) - _743) * _598) + _743) * _748) + (_879 - (_748 * _743));
    out.v_UV = mix(out.v_UV, in.inTexCoord, float2(buffer.u_ScreenSpaceMode));
    out.gl_Position = float4(in.inPosition.xy, 0.0, 1.0);
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

        `,
        
        FS:`

        #pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    spvUnsafeArray<float2, NUM_KEYPOINTS> u_Keypoints;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 v_UV;
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float _236;
    _236 = 0.0;
    int _168;
    float _205;
    for (int _235 = 0; _235 < NUM_KEYPOINTS; _236 = _205, _235 = _168)
    {
        _168 = _235 + 1;
        int _220 = int(mix(float(_168), 0.0, float(_168 >= NUM_KEYPOINTS)));
        float2 _172 = buffer.u_Keypoints[_220] - buffer.u_Keypoints[_235];
        bool _181 = (buffer.u_Keypoints[_235].y > in.v_UV.y) != (buffer.u_Keypoints[_220].y > in.v_UV.y);
        bool _199;
        if (_181)
        {
            _199 = in.v_UV.x < (((_172.x * (in.v_UV.y - buffer.u_Keypoints[_235].y)) / _172.y) + buffer.u_Keypoints[_235].x);
        }
        else
        {
            _199 = _181;
        }
        _205 = mix(_236, 1.0 - _236, float(_199));
    }
    out.gl_FragColor = float4(mix(in.v_UV.x, (3.0 * in.v_UV.x) - 1.0, float(in.v_UV.x > 1.0)), in.v_UV.y, 0.0, _236);
    return out;
}


        `
    },

    Blur: 
    {
        VS: `
#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float2 v_UV;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 inPosition [[attribute(0)]];
    float2 inTexCoord [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]])
{
    main0_out out = {};
    out.v_UV = in.inTexCoord;
    out.gl_Position = float4(in.inPosition.xy, 0.0, 1.0);
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
} 
        `,
        
        FS_HORIZONTAL: `
#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    spvUnsafeArray<float, 9> u_HorizontalWeights;
    spvUnsafeArray<float2, 9> u_HorizontalOffsets;
    float u_HorizontalNormalizer;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 v_UV;
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_HorizontalBlurInputRT [[texture(0)]], sampler u_HorizontalBlurInputRTSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _89;
    _89 = buffer.u_HorizontalWeights[0] * u_HorizontalBlurInputRT.sample(u_HorizontalBlurInputRTSmplr, in.v_UV).w;
    for (int _88 = 1; _88 <= BLUR_QUALITY; )
    {
        _89 = (_89 + (buffer.u_HorizontalWeights[_88] * u_HorizontalBlurInputRT.sample(u_HorizontalBlurInputRTSmplr, (in.v_UV + buffer.u_HorizontalOffsets[_88])).w)) + (buffer.u_HorizontalWeights[_88] * u_HorizontalBlurInputRT.sample(u_HorizontalBlurInputRTSmplr, (in.v_UV - buffer.u_HorizontalOffsets[_88])).w);
        _88++;
        continue;
    }
    out.gl_FragColor = float4(_89 * buffer.u_HorizontalNormalizer);
    return out;
}
        
        

        
        `,
       
        FS_VERTICAL: `
        #pragma clang diagnostic ignored "-Wmissing-prototypes"
        #pragma clang diagnostic ignored "-Wmissing-braces"
        
        #include <metal_stdlib>
        #include <simd/simd.h>
        
        using namespace metal;
        
        template<typename T, size_t Num>
        struct spvUnsafeArray
        {
            T elements[Num ? Num : 1];
            
            thread T& operator [] (size_t pos) thread
            {
                return elements[pos];
            }
            constexpr const thread T& operator [] (size_t pos) const thread
            {
                return elements[pos];
            }
            
            device T& operator [] (size_t pos) device
            {
                return elements[pos];
            }
            constexpr const device T& operator [] (size_t pos) const device
            {
                return elements[pos];
            }
            
            constexpr const constant T& operator [] (size_t pos) const constant
            {
                return elements[pos];
            }
            
            threadgroup T& operator [] (size_t pos) threadgroup
            {
                return elements[pos];
            }
            constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
            {
                return elements[pos];
            }
        };
        
        struct buffer_t
        {
            spvUnsafeArray<float, 9> u_VerticalWeights;
            spvUnsafeArray<float2, 9> u_VerticalOffsets;
            float u_VerticalNormalizer;
        };
        
        struct main0_out
        {
            float4 gl_FragColor [[color(0)]];
        };
        
        struct main0_in
        {
            float2 v_UV;
        };
        
        fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_VerticalBlurInputRT [[texture(0)]], sampler u_VerticalBlurInputRTSmplr [[sampler(0)]])
        {
            main0_out out = {};
            float _89;
            _89 = buffer.u_VerticalWeights[0] * u_VerticalBlurInputRT.sample(u_VerticalBlurInputRTSmplr, in.v_UV).w;
            for (int _88 = 1; _88 <= BLUR_QUALITY; )
            {
                _89 = (_89 + (buffer.u_VerticalWeights[_88] * u_VerticalBlurInputRT.sample(u_VerticalBlurInputRTSmplr, (in.v_UV + buffer.u_VerticalOffsets[_88])).w)) + (buffer.u_VerticalWeights[_88] * u_VerticalBlurInputRT.sample(u_VerticalBlurInputRTSmplr, (in.v_UV - buffer.u_VerticalOffsets[_88])).w);
                _88++;
                continue;
            }
            out.gl_FragColor = float4(_89 * buffer.u_VerticalNormalizer);
            return out;
        }        
        
        `

    },

    World: {
        
        VS: `
        #pragma clang diagnostic ignored "-Wmissing-prototypes"
        #pragma clang diagnostic ignored "-Wmissing-braces"
        
        #include <metal_stdlib>
        #include <simd/simd.h>
        
        #ifndef NUM_KEYPOINTS
        #define NUM_KEYPOINTS 1
        #endif
        using namespace metal;
        
        template<typename T, size_t Num>
        struct spvUnsafeArray
        {
            T elements[Num ? Num : 1];
            
            thread T& operator [] (size_t pos) thread
            {
                return elements[pos];
            }
            constexpr const thread T& operator [] (size_t pos) const thread
            {
                return elements[pos];
            }
            
            device T& operator [] (size_t pos) device
            {
                return elements[pos];
            }
            constexpr const device T& operator [] (size_t pos) const device
            {
                return elements[pos];
            }
            
            constexpr const constant T& operator [] (size_t pos) const constant
            {
                return elements[pos];
            }
            
            threadgroup T& operator [] (size_t pos) threadgroup
            {
                return elements[pos];
            }
            constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
            {
                return elements[pos];
            }
        };
        
        struct buffer_t
        {
            spvUnsafeArray<float2, NUM_KEYPOINTS> u_Keypoints;
            float3 u_Rotation;
            float u_CenterMode;
            float u_ScreenSpaceMode;
            float u_AspectRatio;
            float4x4 u_MVP;
        };
        
        struct main0_out
        {
            float2 v_UV;
            float2 v_InsetUV;
            float2 v_ScreenCoord;
            float4 gl_Position [[position]];
        };
        
        struct main0_in
        {
            float3 inPosition [[attribute(0)]];
            float2 inTexCoord [[attribute(1)]];
        };
        
        static inline __attribute__((always_inline))
        float2 calcAverage(constant spvUnsafeArray<float2, NUM_KEYPOINTS>& u_Keypoints)
        {
            float2 average = float2(0.0);
            for (int i = 0; i < NUM_KEYPOINTS; i++)
            {
                average += u_Keypoints[i];
            }
            average /= float2(NUM_KEYPOINTS);
            return average;
        }
        
        static inline __attribute__((always_inline))
        float2 rotate(thread const float2& v, thread const float& a)
        {
            float c = cos(a);
            float s = sin(a);
            return v * float2x2(float2(c, -s), float2(s, c));
        }
        
        static inline __attribute__((always_inline))
        float2 rotateAboutPoint2D(thread float2& v, thread const float2& p, thread const float& a)
        {
            v -= p;
            float2 param = v;
            float param_1 = a;
            v = rotate(param, param_1);
            return v + p;
        }
        
        static inline __attribute__((always_inline))
        void calcMaxExtentPoints(thread const float2& average, thread float2& left, thread float2& right, thread float2& up, thread float2& down, constant spvUnsafeArray<float2, NUM_KEYPOINTS>& u_Keypoints, constant float3& u_Rotation)
        {
            left = float2(1.0, 0.5);
            right = float2(0.0, 0.5);
            up = float2(0.5, 1.0);
            down = float2(0.5, 0.0);
            for (int i = 0; i < NUM_KEYPOINTS; i++)
            {
                float2 point = u_Keypoints[i];
                float2 param = point;
                float2 param_1 = average;
                float param_2 = -u_Rotation.z;
                float2 _149 = rotateAboutPoint2D(param, param_1, param_2);
                point = _149;
                left = mix(left, point, float2(float(point.x < left.x)));
                right = mix(right, point, float2(float(point.x > right.x)));
                up = mix(up, point, float2(float(point.y < up.y)));
                down = mix(down, point, float2(float(point.y > down.y)));
            }
            float2 param_3 = left;
            float2 param_4 = average;
            float param_5 = u_Rotation.z;
            float2 _201 = rotateAboutPoint2D(param_3, param_4, param_5);
            left = _201;
            float2 param_6 = right;
            float2 param_7 = average;
            float param_8 = u_Rotation.z;
            float2 _209 = rotateAboutPoint2D(param_6, param_7, param_8);
            right = _209;
            float2 param_9 = up;
            float2 param_10 = average;
            float param_11 = u_Rotation.z;
            float2 _217 = rotateAboutPoint2D(param_9, param_10, param_11);
            up = _217;
            float2 param_12 = down;
            float2 param_13 = average;
            float param_14 = u_Rotation.z;
            float2 _225 = rotateAboutPoint2D(param_12, param_13, param_14);
            down = _225;
        }
        
        static inline __attribute__((always_inline))
        float2 calcCenter(thread const float2& average, thread const float2& left, thread const float2& right, thread const float2& up, thread const float2& down, thread const float2& screenRatio, constant float& u_CenterMode, constant float& u_ScreenSpaceMode)
        {
            float2 center;
            if (u_CenterMode == 0.0)
            {
                center = average;
            }
            else
            {
                float2 ratio = mix(screenRatio, float2(1.0), float2(u_ScreenSpaceMode));
                float lenLR = length((left - right) * ratio);
                float lenUD = length((up - down) * ratio);
                float2 maxLengths = float2(lenUD, lenLR);
                float thresh = smoothstep(0.75, 1.25, maxLengths.x / maxLengths.y);
                center = mix((left + right) * 0.5, (up + down) * 0.5, float2(thresh));
            }
            return center;
        }
        
        static inline __attribute__((always_inline))
        float2 getUVFromExtent(thread const float2& average, thread const float2& left, thread const float2& right, thread const float2& up, thread const float2& down, constant float3& u_Rotation, constant float& u_CenterMode, constant float& u_ScreenSpaceMode, thread float2& inTexCoord, constant float& u_AspectRatio)
        {
            float2 uv = inTexCoord;
            float xReadjust = 3.599999904632568359375 * u_AspectRatio;
            float2 diffLR = left - right;
            float2 diffUD = up - down;
            diffLR.x *= xReadjust;
            diffUD.x *= xReadjust;
            float lenLR = length(diffLR);
            float lenUD = length(diffUD);
            float maxLen = fast::max(lenUD, lenLR);
            float2 midpoint = float2(maxLen) / float2(2.0);
            float2 screenRatio = float2(1.0 / u_AspectRatio, 1.0);
            float2 scaleAdjust = screenRatio * 0.75;
            uv *= maxLen;
            float2 param = uv;
            float2 param_1 = midpoint;
            float param_2 = u_Rotation.z;
            float2 _342 = rotateAboutPoint2D(param, param_1, param_2);
            uv = _342;
            uv *= scaleAdjust;
            float2 param_3 = average;
            float2 param_4 = left;
            float2 param_5 = right;
            float2 param_6 = up;
            float2 param_7 = down;
            float2 param_8 = screenRatio;
            uv += (calcCenter(param_3, param_4, param_5, param_6, param_7, param_8, u_CenterMode, u_ScreenSpaceMode) - (scaleAdjust * midpoint));
            return uv;
        }
        
        vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
        {
            main0_out out = {};
            out.v_UV = in.inTexCoord;
            float2 average = calcAverage(buffer.u_Keypoints);
            float2 param = average;
            float2 param_1;
            float2 param_2;
            float2 param_3;
            float2 param_4;
            calcMaxExtentPoints(param, param_1, param_2, param_3, param_4, buffer.u_Keypoints, buffer.u_Rotation);
            float2 left = param_1;
            float2 right = param_2;
            float2 up = param_3;
            float2 down = param_4;
            float2 param_5 = average;
            float2 param_6 = left;
            float2 param_7 = right;
            float2 param_8 = up;
            float2 param_9 = down;
            out.v_InsetUV = getUVFromExtent(param_5, param_6, param_7, param_8, param_9, buffer.u_Rotation, buffer.u_CenterMode, buffer.u_ScreenSpaceMode, in.inTexCoord, buffer.u_AspectRatio);
            float4 homPos = float4(in.inPosition, 1.0);
            float4x4 rescaleMat = float4x4(float4(10.0, 0.0, 0.0, 0.0), float4(0.0, 10.0, 0.0, 0.0), float4(0.0, 0.0, 10.0, 0.0), float4(0.0, 0.0, 0.0, 1.0));
            float4 finalPos = buffer.u_MVP * (rescaleMat * homPos);
            float3 ndc = finalPos.xyz / float3(finalPos.w);
            out.v_ScreenCoord = (ndc.xy * 0.5) + float2(0.5);
            finalPos = mix(finalPos, float4(in.inPosition.xy, 0.0, 1.0), float4(buffer.u_ScreenSpaceMode));
            out.gl_Position = finalPos;
            out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
            return out;
        }
        `,
        
        FS:`
        #pragma clang diagnostic ignored "-Wmissing-prototypes"

        #include <metal_stdlib>
        #include <simd/simd.h>
        
        using namespace metal;
        
        struct buffer_t
        {
            float u_Opacity;
            float4 u_FillColor;
            float u_OutlineInfluence;
            float4 u_OutlineColor;
            float u_OutlineThresh;
            float u_FeatheringScale;
        };
        
        struct main0_out
        {
            float4 gl_FragColor [[color(0)]];
        };
        
        struct main0_in
        {
            float2 v_UV;
            float2 v_InsetUV;
            float2 v_ScreenCoord;
        };
        
        static inline __attribute__((always_inline))
        float4 textureFromFBO(thread const float2& uv, texture2d<float> u_FBOTexture, sampler u_FBOTextureSmplr)
        {
            float4 result = u_FBOTexture.sample(u_FBOTextureSmplr, uv);
            return result;
        }
        
        #ifdef BLEND_MODE_MULTIPLY
        static inline __attribute__((always_inline))
        float3 blendMultiply(thread const float3& base, thread const float3& blend)
        {
            return base * blend;
        }
        
        static inline __attribute__((always_inline))
        float3 blendMultiply(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendMultiply(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
        
        
        #if defined(BLEND_MODE_OVERLAY) || defined(BLEND_MODE_HARD_LIGHT)
        static inline __attribute__((always_inline))
        float blendOverlay(thread const float& base, thread const float& blend)
        {
            float _211;
            if (base < 0.5)
            {
                _211 = (2.0 * base) * blend;
            }
            else
            {
                _211 = 1.0 - ((2.0 * (1.0 - base)) * (1.0 - blend));
            }
            return _211;
        }
        
        static inline __attribute__((always_inline))
        float3 blendOverlay(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(blendOverlay(param, param_1), blendOverlay(param_2, param_3), blendOverlay(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blendOverlay(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendOverlay(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
        
        #ifdef BLEND_MODE_ADD
        static inline __attribute__((always_inline))
        float3 blendAdd(thread const float3& base, thread const float3& blend)
        {
            return fast::min(base + blend, float3(1.0));
        }
        
        static inline __attribute__((always_inline))
        float3 blendAdd(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendAdd(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
        
        #ifdef BLEND_MODE_SCREEN
        static inline __attribute__((always_inline))
        float3 blendScreen(thread const float3& base, thread const float3& blend)
        {
            return float3(1.0) - ((float3(1.0) - base) * (float3(1.0) - blend));
        }
        
        static inline __attribute__((always_inline))
        float3 blendScreen(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendScreen(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
        
        #ifdef BLEND_MODE_SOFT_LIGHT
        static inline __attribute__((always_inline))
        float blendSoftLight(thread const float& base, thread const float& blend)
        {
            float _317;
            if (blend < 0.5)
            {
                _317 = ((2.0 * base) * blend) + ((base * base) * (1.0 - (2.0 * blend)));
            }
            else
            {
                _317 = (sqrt(base) * ((2.0 * blend) - 1.0)) + ((2.0 * base) * (1.0 - blend));
            }
            return _317;
        }
        
        static inline __attribute__((always_inline))
        float3 blendSoftLight(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(blendSoftLight(param, param_1), blendSoftLight(param_2, param_3), blendSoftLight(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blendSoftLight(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendSoftLight(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
        
        #ifdef BLEND_MODE_HARD_LIGHT
        static inline __attribute__((always_inline))
        float3 blendHardLight(thread const float3& base, thread const float3& blend)
        {
            float3 param = blend;
            float3 param_1 = base;
            return blendOverlay(param, param_1);
        }
        
        static inline __attribute__((always_inline))
        float3 blendHardLight(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendHardLight(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_AVERAGE
        static inline __attribute__((always_inline))
        float3 blendAverage(thread const float3& base, thread const float3& blend)
        {
            return (base + blend) / float3(2.0);
        }
        
        static inline __attribute__((always_inline))
        float3 blendAverage(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendAverage(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_COLOR_BURN
        static inline __attribute__((always_inline))
        float blendColorBurn(thread const float& base, thread const float& blend)
        {
            float _431;
            if (blend == 0.0)
            {
                _431 = blend;
            }
            else
            {
                _431 = fast::max(1.0 - ((1.0 - base) / blend), 0.0);
            }
            return _431;
        }
        
        static inline __attribute__((always_inline))
        float3 blendColorBurn(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(blendColorBurn(param, param_1), blendColorBurn(param_2, param_3), blendColorBurn(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blendColorBurn(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendColorBurn(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_COLOR_DODGE
        static inline __attribute__((always_inline))
        float blendColorDodge(thread const float& base, thread const float& blend)
        {
            float _485;
            if (blend == 1.0)
            {
                _485 = blend;
            }
            else
            {
                _485 = fast::min(base / (1.0 - blend), 1.0);
            }
            return _485;
        }
        
        static inline __attribute__((always_inline))
        float3 blendColorDodge(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(blendColorDodge(param, param_1), blendColorDodge(param_2, param_3), blendColorDodge(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blendColorDodge(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendColorDodge(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_DARKEN
        static inline __attribute__((always_inline))
        float blendDarken(thread const float& base, thread const float& blend)
        {
            return fast::min(blend, base);
        }
        
        static inline __attribute__((always_inline))
        float3 blendDarken(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(blendDarken(param, param_1), blendDarken(param_2, param_3), blendDarken(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blendDarken(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendDarken(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_DIFFERENCE
        static inline __attribute__((always_inline))
        float3 blendDifference(thread const float3& base, thread const float3& blend)
        {
            return abs(base - blend);
        }
        
        static inline __attribute__((always_inline))
        float3 blendDifference(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendDifference(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_EXCLUSION
        static inline __attribute__((always_inline))
        float3 blendExclusion(thread const float3& base, thread const float3& blend)
        {
            return (base + blend) - ((base * 2.0) * blend);
        }
        
        static inline __attribute__((always_inline))
        float3 blendExclusion(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendExclusion(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_LIGHTEN
        static inline __attribute__((always_inline))
        float blendLighten(thread const float& base, thread const float& blend)
        {
            return fast::max(blend, base);
        }
        
        static inline __attribute__((always_inline))
        float3 blendLighten(thread const float3& base, thread const float3& blend)
        {
            float param = base.x;
            float param_1 = blend.x;
            float param_2 = base.y;
            float param_3 = blend.y;
            float param_4 = base.z;
            float param_5 = blend.z;
            return float3(blendLighten(param, param_1), blendLighten(param_2, param_3), blendLighten(param_4, param_5));
        }
        
        static inline __attribute__((always_inline))
        float3 blendLighten(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendLighten(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
                
        #ifdef BLEND_MODE_LINEAR_DODGE
        static inline __attribute__((always_inline))
        float3 blendLinearDodge(thread const float3& base, thread const float3& blend)
        {
            return fast::min(base + blend, float3(1.0));
        }
        
        static inline __attribute__((always_inline))
        float3 blendLinearDodge(thread const float3& base, thread const float3& blend, thread const float& opacity)
        {
            float3 param = base;
            float3 param_1 = blend;
            return (blendLinearDodge(param, param_1) * opacity) + (base * (1.0 - opacity));
        }
        #endif
        
        static inline __attribute__((always_inline))
        float4 applyBlendMode(thread const float4& color, thread const float2& uv, texture2d<float> u_FBOTexture, sampler u_FBOTextureSmplr)
        {
            float4 ret = color;
            float2 param = uv;
        #ifdef BLEND_MODE_MULTIPLY
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendMultiply(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_OVERLAY
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendOverlay(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_ADD
            float4 framecolor =textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendAdd(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_SCREEN
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendScreen(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_SOFT_LIGHT
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendSoftLight(ret.xyz, framecolor.xyz);
        #endif
        #ifdef BLEND_MODE_HARD_LIGHT
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendHardLight(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_AVERAGE
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendAverage(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_COLOR_BURN
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendColorBurn(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_COLOR_DODGE
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendColorDodge(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_DARKEN
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendDarken(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_DIFFERENCE
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendDifference(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_EXCLUSION
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendExclusion(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_LIGHTEN
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendLighten(ret.xyz, framecolor.xyz);
        #endif
    
        #ifdef BLEND_MODE_LINEAR_DODGE
            float4 framecolor = textureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
            ret.xyz = blendLinearDodge(ret.xyz, framecolor.xyz);
        #endif
            return ret;
        }
        
        fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_FinalAlphaCoordRT [[texture(0)]], texture2d<float> u_CameraTexture [[texture(1)]], texture2d<float> u_FBOTexture [[texture(2)]], sampler u_FinalAlphaCoordRTSmplr [[sampler(0)]], sampler u_CameraTextureSmplr [[sampler(1)]], sampler u_FBOTextureSmplr [[sampler(2)]])
        {
            main0_out out = {};
        #ifdef USE_MIP_BLUR
            float4 finalAlphaCoord = u_FinalAlphaCoordRT.sample(u_FinalAlphaCoordRTSmplr, in.v_UV, bias(buffer.u_FeatheringScale * 0.85000002384185791015625));
        #else
            float4 finalAlphaCoord = u_FinalAlphaCoordRT.sample(u_FinalAlphaCoordRTSmplr, in.v_UV);
        #endif
            bool _39 = in.v_InsetUV.x <= 0.0;
            bool _47;
            if (!_39)
            {
                _47 = in.v_InsetUV.x >= 1.0;
            }
            else
            {
                _47 = _39;
            }
            bool _55;
            if (!_47)
            {
                _55 = in.v_InsetUV.y <= 0.0;
            }
            else
            {
                _55 = _47;
            }
            bool _62;
            if (!_55)
            {
                _62 = in.v_InsetUV.y >= 1.0;
            }
            else
            {
                _62 = _55;
            }
            bool _71;
            if (!_62)
            {
                _71 = finalAlphaCoord.w == 0.0;
            }
            else
            {
                _71 = _62;
            }
            if (_71)
            {
                discard_fragment();
            }

        #ifdef USE_INPUT_RT
            float4 finalColor = u_CameraTexture.sample(u_CameraTextureSmplr, in.v_InsetUV);
        #endif
 
        #ifdef USE_FINAL_RT
            float4 finalColor = u_FBOTexture.sample(u_FBOTextureSmplr, in.v_InsetUV);
        #endif
            float3 _91 = mix(finalColor.xyz, buffer.u_FillColor.xyz, float3(buffer.u_FillColor.w));
            finalColor = float4(_91.x, _91.y, _91.z, finalColor.w);
            if (buffer.u_OutlineInfluence > 0.0)
            {
                float4 outlineColor = mix(buffer.u_OutlineColor, finalColor, float4(smoothstep(buffer.u_OutlineThresh, 1.0, finalAlphaCoord.w)));
                outlineColor.w *= smoothstep(0.0, 0.20000000298023223876953125, finalAlphaCoord.w);
                finalColor = mix(finalColor, outlineColor, float4(buffer.u_OutlineInfluence));
            }
            finalColor.w = finalAlphaCoord.w * buffer.u_Opacity;
            float4 param = finalColor;
            float2 param_1 = in.v_ScreenCoord;
            out.gl_FragColor = applyBlendMode(param, param_1, u_FBOTexture,u_FBOTextureSmplr);
            return out;
        }
        
        `
    },
};

exports.InsetShaders_Metal = InsetShaders_Metal;