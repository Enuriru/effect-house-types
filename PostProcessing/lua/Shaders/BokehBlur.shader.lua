local full_screen_quad_vert = [[
    attribute vec3 inPosition;
    attribute vec2 inTexCoord;
    
    varying vec2 uv;

    void main () {
        gl_Position = vec4(inPosition, 1.0);
        uv = inTexCoord;
    }
]]

local bokehBlur_Gloden_FS = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform vec4 _GoldenRot;
    uniform vec4 _Params;
    void main () {
        mat2 rot = mat2(_GoldenRot);
		vec4 accumulator = vec4(0.0);
		vec4 divisor = vec4(0.0);

		float r = 1.0;
		vec2 angle = vec2(0.0, _Params.y);

        for (int j = 0; j < int(_Params.x); j++)
		{
			r += 1.0 / r;
			angle = rot * angle;
			vec4 bokeh = texture2D(_MainTex, vec2(uv + _Params.zw * (r - 1.0) * angle));
			accumulator += pow(bokeh,vec4(2.0));
			divisor += bokeh;
		}
		accumulator /= divisor;

        gl_FragColor = accumulator;

    }
]]

local  bokehBlur_Fast_FS0= [[
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec2 uv;
    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform vec4 _Params; // x:BlurIteration y:BlurSize z: cos0.5 w:sin:0.5
    float luminance(vec3 col)
    {
        return col.r * 0.2125 + col.g *0.7154 + col.b * 0.0721;
       //return max(max(col.r,col.g),col.b);
    }

    void main () {
        vec4 sum = vec4(0.0);
        float weight = 0.0;

        vec4 samp = texture2D(_MainTex, uv) ;
        float w = luminance(samp.xyz)*10.0;
        weight += w;
        sum +=samp * w;
        for (int si = 1; si < int(_Params.x)/2; si++)
        {
            vec2 offset =_MainTex_TexelSize.xy * _Params.y *2.0* (float(si)+0.0001)/_Params.x;
            float distW = pow((1.0 - (float(si)+0.001)/_Params.x*2.0),2.0);
            vec4 samp = texture2D(_MainTex, uv + vec2(0.0,-1.0) * offset) ;
            float w = luminance(samp.xyz)*10.0 *  distW;
            sum +=samp * w;
            weight += w;
            
            vec4 samp1 = texture2D(_MainTex, uv + vec2(0.0,1.0)* offset);
            float w1 = luminance(samp1.xyz)*10.0 * distW;
            sum +=samp1 * w1;
            weight += w1;
        }
        sum /= weight;
        gl_FragColor = vec4(sum.rgb,1.0);
    }
]]

local  bokehBlur_Fast_FS1= [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform vec4 _Params; // x:BlurIteration y:BlurSize z: cos0.5 w:sin:0.5

    float luminance(vec3 col)
    {
        return col.r * 0.2125 + col.g *0.7154 + col.b * 0.0721;
       //return max(max(col.r,col.g),col.b);
    }

    void main () {
        vec4 sum = vec4(0.0);
        float weight = 0.0;

        vec4 samp = texture2D(_MainTex, uv) ;
        float w = luminance(samp.xyz)*10.0;
        weight += w;
        sum +=samp * w;
        for (int si = 1; si < int(_Params.x)/2; si++)
        {
            vec2 offset =  _MainTex_TexelSize.xy * _Params.y *2.0* (float(si)+0.0001)/_Params.x;
            float distW = pow((1.0 - (float(si)+0.001)/_Params.x*2.0),2.0);
            vec4 samp = texture2D(_MainTex, uv + vec2(1.0,0.0)* offset) ;
            float w = luminance(samp.xyz)*10.0 *  distW;
            sum +=samp * w;
            weight += w;
            
            vec4 samp1 = texture2D(_MainTex, uv +  vec2(-1.0,0.0)*  offset);
            float w1 = luminance(samp1.xyz)*10.0 * distW;
            sum +=samp1 * w1;
            weight += w1;
        }
        sum /= weight;
        gl_FragColor = vec4(sum.rgb,1.0);
    }
]]

local hexagonal_Up_FS = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform vec4 _Params; // x:BlurIteration y:BlurSize z: cos0.5 w:sin:0.5
    float luminance(vec3 col)
    {
        return col.r * 0.2125 + col.g *0.7154 + col.b * 0.0721;
       //return max(max(col.r,col.g),col.b);
    }
    float isOutsideBoundary(vec2 uv)
    {
         return step(0.0,uv.x) * step(0.0,uv.y) * step(0.0,1.0-uv.x) * step(0.0,1.0-uv.y);
    }
    void main () {
        
        vec4 sum = vec4(0.0);
        float weight = 0.0;
        for (int si = 0; si < int(_Params.x); si++)
        {
            vec2 offset = vec2(0.0,-1.0)* _MainTex_TexelSize.xy * _Params.y * (float(si)+0.0001)/_Params.x;
            vec2 newUV = uv + offset;
            vec4 samp = texture2D(_MainTex, newUV);
            float w = luminance(samp.xyz) * isOutsideBoundary(newUV);
            sum +=samp * w;
            weight += w;
        }
        sum /= weight;
        gl_FragColor = vec4(sum.rgb,1.0);
    }
]]
local hexagonal_DownLeft_FS = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform vec4 _Params; // x:BlurIteration y:BlurSize z: cos0.5 w:sin:0.5

    float luminance(vec3 col)
    {
        return col.r * 0.2125 + col.g *0.7154 + col.b * 0.0721;
    }
    float isOutsideBoundary(vec2 uv)
    {
         return step(0.0,uv.x) * step(0.0,uv.y) * step(0.0,1.0-uv.x) * step(0.0,1.0-uv.y);
    }
    void main () {
        vec4 sum = vec4(0.0);
        float weight = 0.0;
        for (int si = 1; si < int(_Params.x); si++)
        {
            vec2 offset = vec2(_Params.z,_Params.w)* _MainTex_TexelSize.xy * _Params.y * (float(si)+0.0001)/_Params.x;
            vec2 newUV = uv + offset;
            vec4 samp = texture2D(_MainTex, newUV);
            float w = luminance(samp.xyz) * isOutsideBoundary(newUV);
            sum +=samp * w;
            weight += w;
        }
        sum /= weight;
        gl_FragColor = vec4(sum.rgb,1.0);
    }
]]
local hexagonal_DownLeftRight_FS = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_TexelSize;
    uniform sampler2D _DownLeftTex;
    uniform vec4 _Params; // x:BlurIteration y:BlurSize z: cos0.5 w:sin:0.5
    float luminance(vec3 col)
    {
        return col.r * 0.2125 + col.g *0.7154 + col.b * 0.0721;
       //return max(max(col.r,col.g),col.b);
    }
    float isOutsideBoundary(vec2 uv)
    {
         return step(0.0,uv.x) * step(0.0,uv.y) * step(0.0,1.0-uv.x) * step(0.0,1.0-uv.y);
    }
    void main () {
        
        vec4 sum = vec4(0.0);
        float weight = 0.0;

        vec4 samp = texture2D(_MainTex, uv);
        float w = luminance(samp.xyz) * isOutsideBoundary(uv);
        sum +=samp * w;
        weight += w;

        for (int si = 1; si < int(_Params.x); si++)
        {
            vec2 offset =  _MainTex_TexelSize.xy * _Params.y* (float(si)+0.0001)/_Params.x;
            vec2 newUV = uv + vec2(_Params.z,_Params.w) * offset;
            vec4 samp = texture2D(_MainTex, newUV);
            float w = luminance(samp.xyz) * isOutsideBoundary(newUV);
            sum +=samp * w;
            weight += w;

            vec2 newUV1 = uv + vec2(-_Params.z,_Params.w)*offset;
            vec4 samp1 = texture2D(_MainTex, newUV1);
            float w1 = luminance(samp1.xyz) * isOutsideBoundary(newUV1);
            sum +=samp1 * w1;
            weight += w1;

            vec2 newUV2 = uv +  vec2(-_Params.z,_Params.w)* offset;
            vec4 samp2 = texture2D(_DownLeftTex, newUV2);
            float w2 = luminance(samp2.xyz) * isOutsideBoundary(newUV2);
            sum +=samp2 * w2;
            weight += w2;
        }
        sum /= weight;
        gl_FragColor = vec4(sum.rgb,1.0);

    }
]]

BokehBlurShader = ScriptableObject (BaseShader)
function BokehBlurShader : getMaterial()
    if self.material == nil then
        local material = CreateEmptyMaterial("bokeh blur")
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, bokehBlur_Gloden_FS)
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, bokehBlur_Fast_FS0)
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, bokehBlur_Fast_FS1)
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, hexagonal_Up_FS)
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, hexagonal_DownLeft_FS)
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, hexagonal_DownLeftRight_FS)

        self.material = material
    end
    return self.material
end

