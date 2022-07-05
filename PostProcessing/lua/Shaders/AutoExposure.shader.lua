local full_screen_vert_es3x = [[
    #version 310 es

    layout(location = 0) in vec3 inPosition;
    layout(location = 1) in vec2 inTexCoord;

    out vec2 uv;

    void main () {
        gl_Position = vec4(inPosition, 1.0);
        uv = inTexCoord;
    }
]];

local full_screen_frag_es3x = [[
    #version 310 es

    precision mediump float;

    // for result, size is 4 // [0]: r0, [1]: r1, [2]: index, [3]: padding
    layout(std430, binding = 0) buffer gPingPongResult {
        float gPingPongResult_vector[];
    };

    in vec2 uv;

    uniform sampler2D _MainTex;

    layout(location = 0) out vec4 fragColor;

    void main () {
        vec4 color = texture(_MainTex, uv);
        
        uint curId = uint(gPingPongResult_vector[2]);

        float scale = gPingPongResult_vector[curId];
        fragColor = vec4(color.rgb * scale, color.a);

   
    }
]];

simpleAutoExposure_DownSampleVS = [[
attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 uv0;
varying vec2 uv1;
varying vec2 uv2;
varying vec2 uv3;
uniform vec2 texSize;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv0 = inTexCoord;
    uv1 = inTexCoord + vec2(0.5,0.0) * texSize;
    uv2 = inTexCoord + vec2(-0.5,0.0) * texSize;
    uv3 = inTexCoord + vec2(-0.5,-0.5) * texSize;
}
]]

simpleAutoExposure_DownSampleFS = [[

    precision mediump float;

    varying vec2 uv0;
    varying vec2 uv1;
    varying vec2 uv2;
    varying vec2 uv3;
    uniform sampler2D _MainTex;

    void main () {
        vec4 color = texture2D(_MainTex, uv0) + texture2D(_MainTex, uv1) + texture2D(_MainTex, uv2) +texture2D(_MainTex, uv3);
        color = color * 0.25;
        gl_FragColor = vec4(color.rgb, 1.0);
    }
]];



simpleAutoExposureVS = [[
attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]



simpleAutoExposure_Multiplier = [[

    precision mediump float;
    #define EPSILON 0.00001
    varying vec2 uv;
    uniform sampler2D _MainTex;
    uniform sampler2D _PreTex;
    uniform vec4 uParams1;
    uniform vec4 uParams2;


    float GetExposureMultiplier(float avgLuminance) {
        avgLuminance = max(EPSILON, avgLuminance);
        return uParams2.z / avgLuminance;
    }
    float Luminance(vec3 color) {
        return dot(color, vec3(0.2126729, 0.7151522, 0.0721750));
    }

            
    float InterpolateExposure(float newExposure, float oldExposure) {
        float delta = newExposure - oldExposure;
    
        float speed = delta > 0.0 ? uParams2.x : uParams2.y;
        float exposure = oldExposure + delta * (1.0 - exp2(-uParams2.w * speed));

        return exposure;
    }
    

    void main () {
        float curLuminance = Luminance(texture2D(_MainTex,uv).xyz);
        float exposure = GetExposureMultiplier(curLuminance);
        float prevExposure = texture2D(_PreTex,uv).r * 10.0;
        float finalExposure = InterpolateExposure(exposure, prevExposure)  * 0.1;

        gl_FragColor = vec4(finalExposure,finalExposure,finalExposure, 1.0);
    }
]];


simpleAutoExposureFS = [[

    #define EPSILON 0.00001
    precision mediump float;

    varying vec2 uv;
    uniform sampler2D _MainTex;
    uniform sampler2D _ExposureTex;
    uniform vec4 uParams1;
    uniform vec4 uParams2;




    void main () {
        float exposure = texture2D(_ExposureTex,uv).r * 10.0;
        vec4 color = texture2D(_MainTex, uv);
        gl_FragColor = vec4(color.rgb * exposure , 1.0);
    }
]];
-------------- metal ------------

local full_screen_vert_metal = [==[
    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float2 uv;
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
        out.gl_Position = float4(in.inPosition, 1.0);
        out.uv = in.inTexCoord;
        return out;
    }
    ]==];

local full_screen_frag_metal= [==[
    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct main0_out
    {
        float4 _gl_FragColor [[color(0)]];
    };
    
    struct main0_in
    {
        float2 uv;
    };
    
    
    fragment main0_out main0(main0_in in [[stage_in]],
                            device float *gPingPongResult [[buffer(0)]],
                        thread texture2d<float> _MainTex, thread const sampler _MainTexSmplr)
    {
        main0_out out = {}; 
        float4 c = _MainTex.sample(_MainTexSmplr, in.uv);
        uint curId = uint(gPingPongResult[2]);
        float scale = gPingPongResult[curId];

        out._gl_FragColor = c * scale;
        return out;
    }
    ]==];

AutoExposureShader = ScriptableObject (BaseShader)

function AutoExposureShader : getMaterial()
    if Amaz.Platform.name() == "iOS" then
        if self.material == nil then
            local material = CreateEmptyMaterial("auto exposure")
            AddPassToMaterial(material, "metal", full_screen_vert_metal, full_screen_frag_metal)
            -- AddPassToMaterial(material, "gles2", simpleAutoExposure_DownSampleVS, simpleAutoExposure_DownSampleFS)
            -- AddPassToMaterial(material, "gles2", simpleAutoExposureVS, simpleAutoExposureFS)
            self.material = material
        end
        return self.material
    else
        if self.material == nil then
            local material = CreateEmptyMaterial("auto exposure")
            AddPassToMaterial(material, "gles31", full_screen_vert_es3x, full_screen_frag_es3x)
            AddPassToMaterial(material, "gles2", simpleAutoExposure_DownSampleVS, simpleAutoExposure_DownSampleFS)
            AddPassToMaterial(material, "gles2", simpleAutoExposureVS, simpleAutoExposure_Multiplier)
            AddPassToMaterial(material, "gles2", simpleAutoExposureVS, simpleAutoExposureFS)
            self.material = material
        end
        return self.material
    end
end
AutoExposureShader.HistogramBinLength = 128
AutoExposureShader.CleanHistogramShader_DimX = 32
AutoExposureShader.CleanHistogramShader = [[
    #version 310 es

    layout (local_size_x = 32) in;
    
    #define HISTOGRAM_BIN_LENGTH 128u
    
    // global memory for final result
    layout(std430, binding = 0) buffer gHistogramBins
    {
        uint gHistogramBins_vector[];
    };
    
    void main () {
        if (gl_GlobalInvocationID.x < HISTOGRAM_BIN_LENGTH) {
            gHistogramBins_vector[gl_GlobalInvocationID.x] = 0u;
        }
    }
]];

AutoExposureShader.CleanHistogramShader_metal =
[==[
    #include <metal_stdlib>
    #include <simd/simd.h>
    using namespace metal;

    #define HISTOGRAM_BIN_LENGTH 128u

    struct layout
    {
        bool local_size_x[32];
        bool local_size_y[1];
        bool local_size_z[1];
    };

    kernel void computeShader(threadgroup layout& layout,
                device uint *gHistogramBins [[ buffer(0) ]],
                uint3 position [[ thread_position_in_grid ]]) 
    { 
        if (position.x < HISTOGRAM_BIN_LENGTH) 
        {
            gHistogramBins[position.x] = 0u;
        }

    }
]==];








AutoExposureShader.HistogramShader_DimX = 8
AutoExposureShader.HistogramShader_DimY = 16
AutoExposureShader.HistogramShader = [[
    #version 310 es
    
    precision highp float;

    layout (local_size_x = 8, local_size_y = 16) in;
    
    #define HISTOGRAM_BIN_LENGTH 128u

     #define HDR
    
    // global memory for final result
    layout(std430, binding = 0) buffer gHistogramBins
    {
        uint gHistogramBins_vector[];
    };
    
    // shared memory for fast/internal computation
    shared uint sHistogramBins_vector[HISTOGRAM_BIN_LENGTH];
    
    void synchronize() {
        // Ensure that memory accesses to shared variables complete.
        memoryBarrierShared();
        
        // Every thread in work group must reach this barrier before any other thread can continue.
        barrier();
    }
    
    float Luminance(vec3 color) {
        return dot(color, vec3(0.2126729, 0.7151522, 0.0721750));
    }
    
    float GetHistogramBinFromLuminance(float value, vec2 scaleOffset) {
        #ifdef HDR
          return clamp(log2(value) * scaleOffset.x + scaleOffset.y, 0.0, 1.0);
        #else
            return value;
        #endif 
    }
    
    uniform sampler2D _MainTex;
    uniform vec4 _ScaleOffsetRes;
    
    void main() {

        //uint localThreadId = gl_LocalInvocationID.y * gl_WorkGroupSize.x  + gl_LocalInvocationID.x;

        if (gl_LocalInvocationIndex < HISTOGRAM_BIN_LENGTH) {
            sHistogramBins_vector[gl_LocalInvocationIndex] = 0u;
        }
    
    
        synchronize();
    
        float u = float(gl_GlobalInvocationID.x) / _ScaleOffsetRes.z * 2.0;
        float v = float(gl_GlobalInvocationID.y) / _ScaleOffsetRes.w * 2.0;
        if(u< 1.0 && v <1.0 )
        {
            vec3 color = texture(_MainTex, vec2(u, v)).rgb;
    
            float luminance = Luminance(color);
        
            float logLuminance = GetHistogramBinFromLuminance(luminance, _ScaleOffsetRes.xy);
        
            uint idx = uint(logLuminance * float(HISTOGRAM_BIN_LENGTH - 1u));
            atomicAdd(sHistogramBins_vector[idx], 1u);
        }
        synchronize();
        if (gl_LocalInvocationIndex < HISTOGRAM_BIN_LENGTH) {
            atomicAdd(gHistogramBins_vector[gl_LocalInvocationIndex], sHistogramBins_vector[gl_LocalInvocationIndex]);
        }
    }
]];


AutoExposureShader.HistogramShader_metal = 
[==[
    #include <metal_stdlib>
    #include <metal_compute>
    #include <simd/simd.h>
    #include <metal_atomic>
    using namespace metal;

    #define HISTOGRAM_BIN_LENGTH 128u

    #define HDR

    struct layout
    {
        bool local_size_x[8];
        bool local_size_y[16];
        bool local_size_z[1];
    };
    
    
    void synchronize() {

        threadgroup_barrier(mem_flags::mem_threadgroup);
    }

    float Luminance(float3 color) {
        return dot(color, float3(0.2126729, 0.7151522, 0.0721750));
    }
    
    float GetHistogramBinFromLuminance(float value, float2 scaleOffset) {
        #ifdef HDR
          return clamp(log2(value) * scaleOffset.x + scaleOffset.y, 0.0, 1.0);
        #else
            return value;
        #endif 
    }

    kernel void computeShader(threadgroup layout& layout,
                device uint *gHistogramBins [[ buffer(0) ]],
                constant float4& _ScaleOffsetRes [[buffer(1)]],
                uint3 position [[ thread_position_in_grid ]],
                texture2d<float, access::read> _MainTex[[texture(0)]]) 
    { 
        threadgroup atomic_uint sHistogramBins_vector[HISTOGRAM_BIN_LENGTH];
        uint localInvocationIndex = position.y * 8u + position.x;
        
        if(localInvocationIndex < HISTOGRAM_BIN_LENGTH)
        {
            atomic_store_explicit(&sHistogramBins_vector[localInvocationIndex],0u,memory_order::memory_order_relaxed);
        }
        synchronize();

        float u = float(position.x) / _ScaleOffsetRes.z * 2.0;
        float v = float(position.y) / _ScaleOffsetRes.w * 2.0;


        if(u< 1.0 && v <1.0 )
        {
            float3 color = _MainTex.read(position.xy).xyz;
    
            float luminance = Luminance(color);
        
            float logLuminance = GetHistogramBinFromLuminance(luminance, _ScaleOffsetRes.xy);
        
            uint idx = uint(logLuminance * float(HISTOGRAM_BIN_LENGTH - 1u));

            atomic_fetch_add_explicit(&sHistogramBins_vector[idx], 1u,memory_order::memory_order_relaxed);
        }
        synchronize();
        
       // gHistogramBins = reinterpret_cast<device atomic_uint*> (gHistogramBins);
       // gHistogramBins = reinterpret_cast<device uint*> (gHistogramBins);
      // device atomic_uint * histogram = reinterpret_cast<device atomic_uint*> (gHistogramBins);
        if (localInvocationIndex < HISTOGRAM_BIN_LENGTH) {
            gHistogramBins[localInvocationIndex] +=  atomic_load_explicit(&sHistogramBins_vector[localInvocationIndex],memory_order::memory_order_relaxed);
        }

    }
]==];



function AutoExposureShader : getLuminanceScaleOffsetRes(maxl, minl, width, height)
    local result = Amaz.Vector4f()
    local scale = 1.0 / (maxl - minl)

    result.x = scale
    result.y = -minl * scale
    result.z = width
    result.w = height

    return result
end

AutoExposureShader.ExposureMultiplierShader_DimX = 64
AutoExposureShader.ExposureMultiplierShader = [[
    #version 310 es

    precision highp float;

    #define HISTOGRAM_BIN_LENGTH 128u
    #define HISTOGRAM_BIN_LENGTH_HALF 64u
    
    #define EPSILON 0.00001
    
     #define HDR

    layout (local_size_x = HISTOGRAM_BIN_LENGTH_HALF) in;
    
    // global histogram // size is HISTOGRAM_BIN_LENGTH
    layout(std430, binding = 0) buffer gHistogramBins {
        uint gHistogramBins_vector[];
    };
    
    // for result, size is 4 // [0]: r0, [1]: r1, [2]: index, [3]: padding
    layout(std430, binding = 1) buffer gPingPongResult {
        float gPingPongResult_vector[];
    };


    shared uint sHistogramReduction_vector[HISTOGRAM_BIN_LENGTH_HALF];
    
    void synchronize() {
        // Ensure that memory accesses to shared variables complete.
        memoryBarrierShared();
        
        // Every thread in work group must reach this barrier before any other thread can continue.
        barrier();
    }
    uniform vec4 uParams1; // .x:lowPercent .y:highPercent .z:minBrightness, .w:maxBrightness
    uniform vec4 uParams2; // .x:speedDown .y:speedUp .z:exposure compensation .w:delta time
    uniform float  uProgressive;
    uniform vec4 uScaleOffsetRes; // .x:scale .y:offset .z:width .w:height
    
    float GetBinValue(uint index, float maxHistogramValueInv) {
        return float(gHistogramBins_vector[index]) * maxHistogramValueInv;
    }
    
    float GetLuminanceFromHistogramBin(float bin, vec2 scaleOffset) {
        #ifdef HDR
            return exp2((bin - scaleOffset.y) / scaleOffset.x);
        #else
            return bin;
        #endif
    }
    
    void FilterLuminance(uint index, float maxHistogramValueInv, vec2 scaleOffset, inout vec4 filterVec4) {
        float binValue = GetBinValue(index, maxHistogramValueInv);
    
        float offset = min(filterVec4.z, binValue);
        binValue -= offset;
        filterVec4.zw -= offset;
    
        binValue = min(filterVec4.w, binValue);
        filterVec4.w -= binValue;
    
        float luminance = GetLuminanceFromHistogramBin(float(index) / float(HISTOGRAM_BIN_LENGTH), scaleOffset);
    
        filterVec4.xy += vec2(luminance * binValue, binValue);
    }
    
    float GetAverageLuminance(vec4 params, float maxHistogramValueInv, vec2 scaleOffset) {
        uint index = 0u;
        float totalSum = 0.0;
    
        for (index = 0u; index < HISTOGRAM_BIN_LENGTH; ++index) {
            totalSum += GetBinValue(index, maxHistogramValueInv);
        }
    
        vec4 filterVec4 = vec4(0.0, 0.0, totalSum * params.xy);
    
        for (index = 0u; index < HISTOGRAM_BIN_LENGTH; ++index) {
            FilterLuminance(index, maxHistogramValueInv, scaleOffset, filterVec4);
        }
    
        return clamp(filterVec4.x / max(filterVec4.y, EPSILON), params.z, params.w);
    }
    
    float GetExposureMultiplier(float avgLuminance) {
        avgLuminance = max(EPSILON, avgLuminance);
        return uParams2.z / avgLuminance;
    }
    
    float InterpolateExposure(float newExposure, float oldExposure) {
        float delta = newExposure - oldExposure;
    
        float speed = delta > 0.0 ? uParams2.x : uParams2.y;
        float exposure = oldExposure + delta * (1.0 - exp2(-uParams2.w * speed));

       // if(delta <0.0 )
           // exposure =0.0;
    
        return exposure;
    }
    
    // this kernel has only one block, so localid == globalid
    void main () {
        sHistogramReduction_vector[gl_LocalInvocationIndex] = max(gHistogramBins_vector[gl_LocalInvocationIndex], gHistogramBins_vector[gl_LocalInvocationIndex + HISTOGRAM_BIN_LENGTH_HALF]);
    
        synchronize();
    
        for (uint stride = HISTOGRAM_BIN_LENGTH_HALF >> 1u; stride > 0u; stride >>= 1u) {
            if (gl_LocalInvocationIndex < stride) {
                sHistogramReduction_vector[gl_LocalInvocationIndex] = max (sHistogramReduction_vector[gl_LocalInvocationIndex], sHistogramReduction_vector[gl_LocalInvocationIndex + stride]);
            }
    
            synchronize();
        }
    
        synchronize(); // i dont think we need this
    
        if (gl_LocalInvocationIndex == 0u) {
            float maxValueInv = 1.0 / float(sHistogramReduction_vector[0]);
    
            if (uProgressive > 0.5) {
                float avgLuminance = GetAverageLuminance(uParams1, maxValueInv, uScaleOffsetRes.xy);
                float exposure = GetExposureMultiplier(avgLuminance);
    
                uint prevIndex = uint(gPingPongResult_vector[2] + 0.499999);
                float prevExposure = gPingPongResult_vector[prevIndex];
    
                prevIndex = (prevIndex + 1u) & 1u;

                gPingPongResult_vector[prevIndex] =  InterpolateExposure(exposure, prevExposure) ;
    
                gPingPongResult_vector[2] = float(prevIndex);

            }
            else {
                float avgLuminance = GetAverageLuminance(uParams1, maxValueInv, uScaleOffsetRes.xy)  ;
                float exposure = GetExposureMultiplier(avgLuminance);
    
                gPingPongResult_vector[0] = exposure;
                gPingPongResult_vector[1] = exposure;
                gPingPongResult_vector[2] = 0.0;
            }
        }
    }
]];



AutoExposureShader.ExposureMultiplierShader_metal = 
[==[
    #include <metal_stdlib>
    #include <metal_compute>
    #include <simd/simd.h>
    #include <metal_atomic>
    using namespace metal;

    #define HISTOGRAM_BIN_LENGTH 128u
    #define HISTOGRAM_BIN_LENGTH_HALF 64u
    #define EPSILON 0.00001

    #define HDR

    struct layout
    {
        bool local_size_x[HISTOGRAM_BIN_LENGTH_HALF];
        bool local_size_y[1];
        bool local_size_z[1];
    };
    
    
    void synchronize() {

        threadgroup_barrier(mem_flags::mem_threadgroup);
    }
    float GetBinValue(device uint* hisVector, uint index, float maxHistogramValueInv) {
        return float(hisVector[index]) * maxHistogramValueInv;
    }
    
    float GetLuminanceFromHistogramBin(float bin, float2 scaleOffset) {
        #ifdef HDR
            return exp2((bin - scaleOffset.y) / scaleOffset.x);
        #else
            return bin;
        #endif
    }
    
    float4 FilterLuminance(device uint* hisVector,uint index, float maxHistogramValueInv, float2 scaleOffset,  float4 filterVec4) {
        float binValue = GetBinValue(hisVector,index, maxHistogramValueInv);
    
        float4 filter = filterVec4;
        float offset = min(filter.z, binValue);
        binValue -= offset;
        filter.zw -= offset;
    
        binValue = min(filter.w, binValue);
        filter.w -= binValue;
    
        float luminance = GetLuminanceFromHistogramBin(float(index) / float(HISTOGRAM_BIN_LENGTH), scaleOffset);
    
        filter.xy += float2(luminance * binValue, binValue);
        return filter;
    }


    float GetAverageLuminance(device uint* hisVector,float4 params, float maxHistogramValueInv, float2 scaleOffset) {
        uint index = 0u;
        float totalSum = 0.0;
    
        for (index = 0u; index < HISTOGRAM_BIN_LENGTH; ++index) {
            totalSum += GetBinValue(hisVector,index, maxHistogramValueInv);
        }
    
        float4 filterVec4 = float4(0.0, 0.0, totalSum * params.xy);
    
        for (index = 0u; index < HISTOGRAM_BIN_LENGTH; ++index) {
            filterVec4 =  FilterLuminance(hisVector,index, maxHistogramValueInv, scaleOffset, filterVec4);
        }
    
        return clamp(filterVec4.x / max(filterVec4.y, EPSILON), params.z, params.w);
    }

    float GetExposureMultiplier(float avgLuminance,float4 Params2) {
        avgLuminance = max(EPSILON, avgLuminance);
        return Params2.z / avgLuminance;
    }
    
    float InterpolateExposure(float newExposure, float oldExposure,float4 Params2) {
        float delta = newExposure - oldExposure;
    
        float speed = delta > 0.0 ? Params2.x : Params2.y;
        float exposure = oldExposure + delta * (1.0 - exp2(-Params2.w * speed));

    
        return exposure;
    }

 
    struct parameters_Type
    {
        float4 uParams1;
        float4 uParams2;
        float uProgressive;
        float4 uScaleOffsetRes;
    };


    kernel void computeShader(threadgroup layout& layout,
                device uint *gHistogramBins [[ buffer(0) ]],
                device float *gPingPongResult [[buffer(1)]],
                constant parameters_Type& parameters [[ buffer(2) ]],
                uint3 position [[ thread_position_in_grid ]]
                ) 
    { 
        threadgroup uint sHistogramReduction_vector[HISTOGRAM_BIN_LENGTH_HALF];
        uint localInvocationIndex = position.y * 1u + position.x;
        sHistogramReduction_vector[localInvocationIndex] = max(gHistogramBins[localInvocationIndex], gHistogramBins[localInvocationIndex + HISTOGRAM_BIN_LENGTH_HALF]);

        synchronize();


        for (uint stride = HISTOGRAM_BIN_LENGTH_HALF >> 1u; stride > 0u; stride >>= 1u) {
            if (localInvocationIndex < stride) {
                sHistogramReduction_vector[localInvocationIndex] = max (sHistogramReduction_vector[localInvocationIndex], sHistogramReduction_vector[localInvocationIndex + stride]);
            }
    
            synchronize();
        }
        synchronize(); // i dont think we need this
        if (localInvocationIndex == 0u) {
            float maxValueInv = 1.0 / float(sHistogramReduction_vector[0]);
    
            if (parameters.uProgressive > 0.5) {
                float avgLuminance = GetAverageLuminance(gHistogramBins,parameters.uParams1, maxValueInv, parameters.uScaleOffsetRes.xy);
                float exposure = GetExposureMultiplier(avgLuminance,parameters.uParams2);
    
                uint prevIndex = uint(gPingPongResult[2] + 0.499999);
                float prevExposure = gPingPongResult[prevIndex];
    
                prevIndex = (prevIndex + 1u) & 1u;

                gPingPongResult[prevIndex] =  InterpolateExposure(exposure, prevExposure,parameters.uParams2) ;
    
                gPingPongResult[2] = float(prevIndex);

            }
            else {
                float avgLuminance = GetAverageLuminance(gHistogramBins,parameters.uParams1,maxValueInv, parameters.uScaleOffsetRes.xy)  ;
                float exposure = GetExposureMultiplier(avgLuminance,parameters.uParams2);
    
                gPingPongResult[0] = exposure;
                gPingPongResult[1] = exposure;
                gPingPongResult[2] = 0.0;
            }
        }


    }
]==];

