kDistortVS = [[

    precision highp float;

    attribute vec2 inPosition;
    attribute vec2 inTexCoord;
    varying vec2 v_uv;
    //uniform mat4 u_MVP;
    void main() 
    { 
        //gl_Position = u_MVP * position;
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);
        v_uv = inTexCoord;
    }
    
    ]]
    

kDistortFS = [[


precision highp float;


uniform vec4 u_Time; // system variable
uniform float u_barrelPower;
uniform float u_rotation;
uniform float u_zoom;
uniform float u_maskTiles;

uniform vec2 u_amplitude;
uniform vec2 u_frequency;
uniform vec2 u_speed;
uniform vec2 u_offset;

uniform sampler2D _MainTex;
uniform sampler2D u_maskA;

varying highp vec2 v_uv;


//This applies barrel distort, and it uses uniforms to modify location of center
vec2 Distort(vec2 uvs, vec2 offset){
    uvs = uvs - offset;
    float theta  = atan(uvs.y, uvs.x) + radians(u_rotation);
    float radius = length(uvs);
    radius = pow(radius, u_barrelPower + 1.0);
    uvs.x = radius * cos(theta) + offset.x;
    uvs.y = radius * sin(theta) + offset.y;
    //uvs = uvs + offset;
    return 0.5 * (uvs + 1.0);
}

//This zooms the screen
vec2 Zoom(vec2 uvs, float zoom){
    return (uvs - vec2(0.5, 0.5)) * (1.0 - zoom) + vec2(0.5, 0.5);
}

//This creates both vertical and horizontal wobble
vec2 Wobble(vec2 uv, vec2 speed, vec2 frequency, vec2 amplitude){
    if(amplitude.x != 0.0 ){
            uv.x += sin(uv.y * frequency.x + (u_Time.y * speed.x) )/(1.0/amplitude.x);
        }
    if(amplitude.y != 0.0 ){
            uv.y += cos(uv.x * frequency.y + (u_Time.y * speed.y) )/(1.0/amplitude.y);
        }
    return uv;
}


void main(void)
    {
        
        vec2 v_texcoord = v_uv; // conversion from another package
        vec2 inverted = v_texcoord;
        vec2 uv = -1.0 + (2.0 * inverted);
        vec2 distortedUV = Distort(uv, u_offset);
        vec2 scaledUVs = Zoom(distortedUV, u_zoom);
        vec2 wobbleUVs = Wobble(scaledUVs, u_speed, u_frequency, u_amplitude);
        vec4 distorted = texture2D(_MainTex, wobbleUVs);
        //vec4 original = texture2D(_MainTex, inverted);
        //vec4 maskA =  texture2D(u_maskA, inverted * u_maskTiles);
        //gl_FragColor = mix(original, distorted, maskA.r);
        gl_FragColor = distorted;
    }
]]

DistortShader = ScriptableObject(BaseShader)

function DistortShader : getMaterial() 
    if self.material == nil then
        local material = CreateEmptyMaterial("Distort")
        -- Distort Pass
        AddPassToMaterial(material, "gles30", kDistortVS, kDistortFS)
        self.material = material
    end
    return self.material
end
