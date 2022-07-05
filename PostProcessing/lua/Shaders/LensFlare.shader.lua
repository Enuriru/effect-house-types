kLensFlareVS = [[

    precision highp float;

    attribute vec2 inPosition;
    attribute vec2 inTexCoord;
    varying vec2 uv0;
    //uniform mat4 u_MVP;
    void main() 
    { 
        gl_Position = vec4(inPosition.xy, 0.0, 1.0);
        uv0 = inTexCoord;
    }
    
    ]]
    

kLensFlareFS = [[
    precision lowp float;
    varying highp vec2 uv0;
    uniform sampler2D u_noise;
    uniform vec4 u_ScreenParams;
    uniform vec2 touchPos;
    
    float noise(float t)
    {
        return texture2D(u_noise, vec2(t,.0)/u_ScreenParams.xy).x;
    }
    float noise(vec2 t)
    {
        return texture2D(u_noise, t/u_ScreenParams.xy).x;
    }
    
    
    vec3 lensflare(vec2 uv,vec2 pos)
    {
        vec2 dir = uv - pos;   // main -> dir
        vec2 uvd = uv*(length(uv));
        
        float ang = atan(dir.x,dir.y);
        float dist = length(dir); 
        dist = pow(dist, .1);
        float n = noise(vec2(ang*16.0,dist*32.0));
        
        float f0 = 1.0/(length(uv-pos)*16.0+1.0);
        
        f0 = f0 + f0*(sin(noise(sin(ang*2.+pos.x)*4.0 - cos(ang*3.+pos.y))*16.)*.1 + dist*.1 + .2);
    
        float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;
        float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;
        float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;
        
        vec2 uvx = mix(uv,uvd,-0.5);
        
        float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
        float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
        float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;
        
        uvx = mix(uv,uvd,-.4);
        
        float f5 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
        float f52 = max(0.01-pow(length(uvx+0.4*pos),5.5),.0)*2.0;
        float f53 = max(0.01-pow(length(uvx+0.6*pos),5.5),.0)*2.0;
        
        uvx = mix(uv,uvd,-0.5);
        
        float f6 = max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;
        float f62 = max(0.01-pow(length(uvx-0.325*pos),1.6),.0)*3.0;
        float f63 = max(0.01-pow(length(uvx-0.35*pos),1.6),.0)*5.0;
        
        vec3 c = vec3(.0);
        
        c.r += f2+f4+f5+f6; 
        c.g+=f22+f42+f52+f62; 
        c.b+=f23+f43+f53+f63;
        c = c*1.3 - vec3(length(uvd)*.05);
        c+=vec3(f0);
        
        return c;
    }
    
    vec3 cc(vec3 color, float factor,float factor2) // color modifier
    {
        float w = color.x+color.y+color.z;
        return mix(color,vec3(w)*factor,w*factor2);
    }
    
    void main()
    {
        vec2 uv = uv0 - vec2(0.5, 0.5);
        uv.x *= (u_ScreenParams.x / u_ScreenParams.y); // fix aspect ratio
        vec2 CorrectPos = touchPos;
        CorrectPos.x *= (u_ScreenParams.x / u_ScreenParams.y);
        vec3 color = vec3(1.4,1.2,1.0) * lensflare(uv, CorrectPos);
        color -= noise(gl_FragCoord.xy) * .015;
        color = cc(color,.5,.1);
        gl_FragColor = vec4(color, 1.0);
    }
    
]]

LensFlareShader = ScriptableObject(BaseShader)

function LensFlareShader : getMaterial() 
    if self.material == nil then
        local material = CreateEmptyMaterial("LensFlare")
        -- LensFlare Pass
        AddPassToMaterial(material, "gles2", kLensFlareVS, kLensFlareFS)
        self.material = material
    end
    return self.material
end
