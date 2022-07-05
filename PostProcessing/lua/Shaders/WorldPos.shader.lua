kDefaultVS = [[
#version 300 es

layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inTexCoord;
out vec2 uv;
void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
]]

kWorldPosFS = [[
#version 300 es
precision highp float;    
in vec2 uv;
layout(location = 0) out vec4 o_fragColor;
uniform sampler2D _MainTex;
uniform sampler2D u_depth_tex;
uniform mat4 u_VP;
uniform mat4 u_cam_projection;
uniform vec4 u_ProjectionParams;

uniform vec3 u_WorldSpaceCameraPos;

float near = 0.01;
float far = 50.0;

float linearizeDepth(float n, float f, float depth)
{
    float ndc = depth * 2.0 - 1.0;
    float d =  (2.0 * n * f) / (f + n - ndc *(f -n));
    return d/f;
}

vec4 getWorldPositionFromDepth(vec2 uv_depth)
{
    vec4 xyzMat;
    float s = u_cam_projection[2].z;
    float t = u_cam_projection[2].w;
    float f = u_ProjectionParams.y;
    float n = u_ProjectionParams.z;
    float depth = texture(u_depth_tex, uv_depth).x;
    float ldepth = linearizeDepth(u_ProjectionParams.y, u_ProjectionParams.z, depth);
    
    float z = t / (2.0 * ldepth - 1.0 -s);
    float atanfov = 1.0 / u_cam_projection[0].x;
    vec2 ndc_uv = 2.0 * uv_depth - 1.0;
    float x = ndc_uv.x * atanfov * z;
    float y = ndc_uv.y * atanfov * z;
    return vec4(z, y, x, u_cam_projection[2].w);
}

void main()
{
    vec3 xyz = getWorldPositionFromDepth(uv).xyz;
    vec4 worldPos = vec4(xyz, distance(xyz, u_WorldSpaceCameraPos));
    o_fragColor = worldPos;
}
]];

kDepthTestFS = [[
#version 300 es
precision highp float;    
in vec2 uv;
layout(location = 0) out vec4 o_fragColor;
uniform sampler2D _MainTex;
uniform sampler2D u_depth_tex;

float near = 0.01;
float far = 50.0;
float LinearizeDepth(float depth) {
  float z = depth * 2.0 - 1.0; // Back to NDC
  return (2.0 * near * far) / (far + near - z * (far - near));
}

void main()
{
    float depth = texture(u_depth_tex, uv).x;
    float d = LinearizeDepth(depth) / far;
    o_fragColor = vec4(d, d, d, 1.0);
}
]];

WorldPosShader = ScriptableObject(BaseShader)


function WorldPosShader : getMaterial()
    if self.material == nil then 
        local material = CreateEmptyMaterial("PixelWorldPosition")
        -- 0. WorldPos Pass
        AddPassToMaterial(material, "gles30", kDefaultVS, kWorldPosFS)
        -- 1. DepthTest Pass
        AddPassToMaterial(material, "gles30", kDefaultVS, kDepthTestFS);
        self.material = material
    end
    return self.material
end