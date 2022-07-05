
kSSRVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 v_uv;
out vec3 v_cameraRay;

uniform mat4 u_camera_inv_projection;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    v_uv = inTexCoord;
    vec4 cameraRay = vec4(v_uv * 2.0 - 1.0, 1.0, 1.0);
    cameraRay = u_camera_inv_projection * cameraRay;
    v_cameraRay = cameraRay.xyz/cameraRay.w;
}
]]

kSSRFS = [[
#version 300 es
precision highp float;    
in vec2 v_uv;
in vec3 v_cameraRay;
layout(location = 0) out vec4 o_fragColor;
uniform sampler2D u_specular_param_tex;
uniform sampler2D u_normal_tex;
uniform sampler2D u_depth_tex;
uniform sampler2D u_backdepth_tex;
uniform sampler2D _MainTex;

uniform mat4 u_VP;
uniform mat4 u_View;
uniform mat4 u_camera_projection;
uniform mat4 u_camera_inv_projection;


uniform vec4 u_ProjectionParams;
uniform vec4 u_ZBufferParams;

uniform vec4 u_maintex_texel_size;
uniform float u_max_ray_distance;
uniform float u_pixel_stridez_cutoff;
uniform int u_iterations;
uniform float u_pixelz_size;
uniform int u_pixel_stride;

//================== built-in methods ===================
float linear01Depth(float z)
{
    return 1.0 / (u_ZBufferParams.x * z + u_ZBufferParams.y);
}

float linear02Depth(float z)
{
    float ndc = z * 2.0 - 1.0;
    float near = 0.1;
    float far = 100.0;
    return ((2.0 * near * far) /(far + near - ndc * (far -near)))/far;
}

vec3 getPositionFromDepth(vec2 uv, float depth)
{
    float z = depth * 2.0 - 1.0;
    vec4 clipSpaceP = vec4(uv * 2.0 - 1.0, z, 1.0);
    vec4 viewSpaceP = u_camera_inv_projection * clipSpaceP;
    return viewSpaceP.xyz/viewSpaceP.w;
}

// =============== helper methods =========================
vec3 screenSpaceToViewSpace(vec3 cameraRay, float depth)
{
    return (cameraRay * depth);
}

float distanceSquared(vec2 a , vec2 b) {
    a = a -b;
    return dot(a, a);
}

void swapIfBigger(inout float aa, inout float bb)
{
    if(aa > bb)
    {
        float tmp = aa;
        aa = bb;
        bb = tmp;
    }
}

// ================ Ray Tracing methods =============================
bool rayIntersectDepthBF(float zA, float zB, vec2 uv)
{
    float cameraZ = linear02Depth(texture(u_depth_tex, uv).r) * -u_ProjectionParams.z;
    return zB <= cameraZ && zA >= cameraZ;
}

bool traceScreenSpaceRay(vec3 rayOrigin, 
                         vec3 rayDirection, 
                         float jitter, 
                         out vec2 hitPixel, 
                         out vec3 hitPoint,
                         out float iterationCount, out vec3 debugValue)
{
    //Clip to the near plane
    float rayLength = ((rayOrigin.z  + rayDirection.z * u_max_ray_distance) >  -0.1) ?
        (-0.1 - rayOrigin.z) / rayDirection.z : u_max_ray_distance;

    vec3 rayEnd = rayOrigin + rayDirection * rayLength;
    
    
    //Project into homogeneous clip space
    vec4 H0 = u_camera_projection * vec4(rayOrigin, 1.0);
    vec4 H1 = u_camera_projection * vec4(rayEnd, 1.0);

    float k0 = 1.0/H0.w;
    float k1 = 1.0/H1.w;

    //The interpolated homogeneous version of the camera-space points
    vec3 Q0 = rayOrigin * k0;
    vec3 Q1 = rayEnd * k1;

    

    //Screen space endPoints
    vec2 P0 = H0.xy *k0;
    vec2 P1 = H1.xy *k1;

    P0 = P0 * 0.5 + 0.5;
    P1 = P1 * 0.5 + 0.5;

    
    P0 *= u_maintex_texel_size.zw;
    P1 *= u_maintex_texel_size.zw;

    
    

    //if the line is degenerate, make it cover at least one pixel
    //to avoid handling zero-pixel extent as a special case later
    P1 = P1 + (distanceSquared(P0, P1) < 0.0001 ? 0.01 : 0.0);

    
    vec2 delta = P1 - P0;

    //Permute so that the primary iteration is in x to collapse
    // all quadrant-specific DDA cases later
    bool permute = false;
    if(abs(delta.x) < abs(delta.y)) {
        // This is a more-vertical line
        permute = true; delta = delta.yx; P0 = P0.yx; P1 = P1.yx;
    }

    float stepDir = sign(delta.x);
    float invdx = stepDir / delta.x;
    vec2 dP = vec2(stepDir, delta.y * invdx);


    //Track the derivatives of Q and K
    vec3 dQ = (Q1 - Q0) * invdx;
    float dk = (k1- k0) * invdx;

    //Calculate pixel stride based on distance of ray origin from camera.
    //Since perspective means distant objects will be smaller in screen space
    //we can use this to have higher qulity reflections for far away objects
    //while still using a large pixel stride for near objects (and increase performance)
    //this also helps mitigate artifacts on distant reflections when we use a large
    //pxiel stride
    float strideScaler = 1.0 - min(1.0, -rayOrigin.z /u_pixel_stridez_cutoff);
    float pixelStride = 1.0 + strideScaler * u_pixel_stride;

    //Scale derivatives by the desired pixel stride and then
    //offset the starting values by the jitter fraction
    dP *= pixelStride; dQ *= pixelStride; dk *= pixelStride;
    P0 += dP *jitter; Q0 += dQ * jitter; k0 += dk * jitter;

    int i;
    float zA = 0.0;
    float zB = 0.0;

    //Track ray step and derivatives in a vec4 to parallellize
    vec4 pqk = vec4(P0, Q0.z, k0);
    vec4 dPQK = vec4(dP, dQ.z, dk);
    bool intersect = false;

    for(i = 0; i < u_iterations && intersect == false; i++)
    {
        pqk += dPQK;

        zA = zB;
        zB = (dPQK.z * 0.5 + pqk.z) / (dPQK.w * 0.5 + pqk.w);
        swapIfBigger(zB, zA);

        hitPixel = permute ? pqk.yx : pqk.xy;
        hitPixel *= u_maintex_texel_size.xy;

        intersect = rayIntersectDepthBF(zA, zB, hitPixel);
    }

    //Binary search refinement
    if(pixelStride > 1.0 && intersect)
    {
        

    }

    iterationCount = i;

    float iterationPercent = iterationCount/(u_iterations + 0.0);
    debugValue = vec3(iterationPercent, iterationPercent, iterationPercent);

    Q0.xy += dQ.xy *i;
    Q0.z = pqk.z;
    hitPoint = Q0 /pqk.w;
    
    return intersect;
}


float caculateAlphaForIntersection(bool intersect, 
                                float iterationCount,
                                float specularStrength,
                                vec2 hitPixel,
                                vec3 hitPoint,
                                vec3 vsRayOrigin,
                                vec3 vsRayDirection)
{
    float alpha = min(1.0, specularStrength * 1.0);

    //Fade ray hits that approach that maximum iterations
    alpha *= (1.0 - (iterationCount/u_iterations + 0.0));

    //Fade ray hits that approach the screen edge
    //float screenFade = 

    return alpha;
}

void main(){    
    vec4 specRoughPixel = texture(u_specular_param_tex, v_uv);
    vec3 specularStrength = vec3(specRoughPixel.a);

    float zBuffer = texture(u_depth_tex, v_uv).r;
    float decodedDepth = linear02Depth(zBuffer);

    if(decodedDepth > 0.99)
    {
        o_fragColor = vec4(0.0);
        return;
    }

    vec3 vsRayOrigin = screenSpaceToViewSpace(v_cameraRay, decodedDepth);

    vec3 decodedNormal = texture(u_normal_tex, v_uv).rgb * 2.0-1.0;
    decodedNormal = mat3(u_View) * decodedNormal;

    vec3 vsRayDirection = normalize(reflect(normalize(vsRayOrigin), normalize(decodedNormal)));

    vec2 hitPixel;
    vec3 hitPoint;
    float iterationCount;

    vec2 uv2 = vec2(1.0  - v_uv.x,  v_uv.y) * vec2(u_maintex_texel_size.z, u_maintex_texel_size.w);
    float c = (uv2.x + uv2.y) * 0.25;
    float jitter = mod(c, 1.0);

    vec3 rayEnd;
    bool intersect = traceScreenSpaceRay(vsRayOrigin, vsRayDirection, jitter, hitPixel, hitPoint, iterationCount, rayEnd);
    
    float alpha = caculateAlphaForIntersection(intersect, iterationCount, specularStrength.x, hitPixel, hitPoint, vsRayOrigin, vsRayDirection);
    hitPixel = mix(v_uv, hitPixel, intersect ? 1.0:0.0);

    specRoughPixel = vec4(1.0, 1.0, 1.0, 1.0);
    o_fragColor = vec4( texture(_MainTex, hitPixel).rgb* specRoughPixel.rgb , alpha);//  
}
]]

kSSRCombineVS = [[
#version 300 es
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 uv;

void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]

kSSRCombineFS = [[
#version 300 es
precision highp float;    
in vec2 uv;
layout(location = 0) out vec4 o_fragColor;
uniform sampler2D u_specular_param_tex;
uniform sampler2D u_ssr_tex;
uniform sampler2D _MainTex;

vec4 lerp(vec4 a, vec4 b, float f)
{
    return a * (1.0 -f) + b *f;
}

void main()
{
    vec4 ssr = texture(u_ssr_tex, uv);
    float roughness = texture(u_specular_param_tex, uv).a;
    vec4 color = texture(_MainTex, uv);
    o_fragColor = vec4(ssr.rgb * ssr.a + (color.rgb * (1.0 - ssr.a)), 1.0);//color * lerp(vec4(1.0), ssr, ssr.a);
}
]]

SSRShader = ScriptableObject(BaseShader)


function SSRShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("ScreenSpaceReflection")
        --  SSR Raytrace Pass
        AddPassToMaterial(material, "gles30", kSSRVS, kSSRFS)
        -- SSR Combine Pass
        AddPassToMaterial(material, "gles30", kSSRCombineVS, kSSRCombineFS)
        self.material = material
    end
    return self.material
end