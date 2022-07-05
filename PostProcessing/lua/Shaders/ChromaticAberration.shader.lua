local full_screen_quad_vert = [[
    attribute vec3 inPosition;
    attribute vec2 inTexCoord;
    
    varying vec2 uv;

    void main () {
        gl_Position = vec4(inPosition, 1.0);
        uv = inTexCoord;
    }
]];

local spectral_lut_baker = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;

    void main () {
        if (uv.x < 1.0 / 3.0) 
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        else if (uv.x > 2.0 / 3.0) 
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        else 
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
]];

local chromatic_aberration = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex;

    uniform vec4 u_FastModeAndIntensityAndRTSize;
    uniform sampler2D u_SpectralLUT;

    #define MAX_CHROMATIC_SAMPLES 16.0

    void main() {
        if (u_FastModeAndIntensityAndRTSize.x < 0.5) {
            vec2 coords = uv * 2.0 - 1.0;

            // !!!!!!!!!!!!!!!
            // coords = coords - vec2(1.0, 1.0); // this line is only for demo !!!!!!!!!!!!!!
            // !!!!!!!!!!!!!!!
            
            vec2 end = uv - coords * dot (coords, coords) * u_FastModeAndIntensityAndRTSize.y;

            vec2 diff = end - uv;
            float samples = float(int(clamp(length(u_FastModeAndIntensityAndRTSize.zw * diff * 0.5), 3.0, MAX_CHROMATIC_SAMPLES)));

            vec2 delta = diff / samples;
            vec2 pos = uv;

            vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 filterSum = vec4(0.0, 0.0, 0.0, 0.0);

            for (int i = 0; i < int(samples); ++i) {
                float t = (float(i) + 0.5) / samples;

                vec4 s = texture2D(_MainTex, pos);
                vec4 filter = vec4(texture2D(u_SpectralLUT, vec2(t, 0.0)).rgb, 1.0);

                sum += s * filter;
                filterSum += filter;
                pos += delta;
            }

            gl_FragColor = sum / filterSum;
        }
        else {
            vec2 coords = uv * 2.0 - 1.0;
            vec2 end = uv - coords * dot (coords, coords) * u_FastModeAndIntensityAndRTSize.y;

            vec2 delta = (end - uv) / 3.0;

            vec4 filterA = vec4(texture2D(u_SpectralLUT, vec2(0.5 / 3.0, 0.0)).rgb, 1.0);
            vec4 filterB = vec4(texture2D(u_SpectralLUT, vec2(1.5 / 3.0, 0.0)).rgb, 1.0);
            vec4 filterC = vec4(texture2D(u_SpectralLUT, vec2(2.5 / 3.0, 0.0)).rgb, 1.0);

            vec4 texelA = texture2D(_MainTex, uv);
            vec4 texelB = texture2D(_MainTex, uv + delta);
            vec4 texelC = texture2D(_MainTex, uv + delta + delta);

            vec4 sum = texelA * filterA + texelB * filterB + texelC * filterC;
            vec4 filterSum = filterA + filterB + filterC;
            gl_FragColor = sum / filterSum;
        }
    }
]];

local blend_layer = [[
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 uv;

    uniform sampler2D _MainTex; // after aberration

    uniform sampler2D _Background;

    void main() {
        vec4 src = texture2D(_MainTex, uv);
        vec4 dst = texture2D(_Background, uv);
        gl_FragColor = vec4(src.rgb + dst.rgb * (1.0 - src.a), 1.0);
    }
]];

ChromaticAberrationShader = ScriptableObject (BaseShader);

function ChromaticAberrationShader : getMaterial()
    if self.material == nil then
        local material = CreateEmptyMaterial("chromatic aberration");
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, spectral_lut_baker);
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, chromatic_aberration);
        AddPassToMaterial(material, "gles2", full_screen_quad_vert, blend_layer);
        self.material = material;
    end
    return self.material;
end

