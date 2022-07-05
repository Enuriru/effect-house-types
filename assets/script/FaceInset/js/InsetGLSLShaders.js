// Class: InsetShaders
// Static class containing static helper functions for shaders
const InsetShaders_GLSL = 
{
    MaskBuilder : 
    {
        VS: 
        `
            precision highp float;

            attribute vec3 inPosition;
            attribute vec2 inTexCoord;

            #ifndef NUM_KEYPOINTS
                #define NUM_KEYPOINTS 1
            #endif

            const float X_ADJUST = 3.6;
            const float RESCALE = 0.75;
            const float INF = 1. / 0.;
            const int MAX_SIZE = 100;
            const float PI = 3.14159256;

            uniform mat4 u_Model;
            uniform mat4 u_MVP;

            uniform float u_ScreenSpaceMode;
            uniform float u_CenterMode;
            uniform float u_AspectRatio;
            uniform vec2 u_Keypoints[NUM_KEYPOINTS];
            uniform vec3 u_Rotation;
            
            varying vec2 v_UV;

            // Rotates coordinates in 2D
            vec2 rotate(vec2 v, float a) {
                float c = cos(a), s = sin(a);
                return v * mat2(c, -s, s, c);
            }

            // Rotates about a 2D point
            vec2 rotateAboutPoint2D(vec2 v, vec2 p, float a) {
                v = v - p;
                v = rotate(v, a);
                return v + p;
            }

            vec2 calcAverage () {
                vec2 average = vec2(0.);
                for(int i = 0; i < NUM_KEYPOINTS; i++) {
                    average += u_Keypoints[i];
                }
                average /= float(NUM_KEYPOINTS);
                return average;
            }

            // 1. calculate average point
            // 2. rotate points about average point
            // 3. compare point axis extent in for loop to get max extent points
            // 4. after max extent is found, rotate back and return
            void calcMaxExtentPoints (in vec2 average, out vec2 left, out vec2 right, out vec2 up, out vec2 down) {
                left = vec2(1., 0.5);
                right = vec2(0., 0.5);
                up = vec2(0.5, 1.);
                down = vec2(0.5, 0.);
                for(int i = 0; i < NUM_KEYPOINTS; i++) {
                    vec2 point = u_Keypoints[i];
                    point = rotateAboutPoint2D(point, average, -u_Rotation.z);
                    left = mix(left, point, float(point.x < left.x));
                    right = mix(right, point, float(point.x > right.x));
                    up = mix(up, point, float(point.y < up.y));
                    down = mix(down, point, float(point.y > down.y));
                }
                left = rotateAboutPoint2D(left, average, u_Rotation.z);
                right = rotateAboutPoint2D(right, average, u_Rotation.z);
                up = rotateAboutPoint2D(up, average, u_Rotation.z);
                down = rotateAboutPoint2D(down, average, u_Rotation.z);
            }

            // calculate center depending on mode
            vec2 calcCenter(vec2 average, vec2 left, vec2 right, vec2 up, vec2 down, vec2 screenRatio) {
                vec2 center; // Determine center by using mode uniform
                if (u_CenterMode == 0.) {
                    center = average;
                } 
                else { // Max extent
                    vec2 ratio = mix(screenRatio, vec2(1.), u_ScreenSpaceMode); // Adjust for quad vs screen
                    float lenLR = length((left - right) * ratio);
                    float lenUD = length((up - down) * ratio);
                    vec2 maxLengths =  vec2(lenUD, lenLR);
                    float thresh = smoothstep(0.75, 1.25, maxLengths.x / maxLengths.y);
                    center = mix((left + right) * 0.5, (up + down) * 0.5, thresh);
                }
                return center;
            }

            // Sets UV bounds from the maximum extent of the keypoints
            vec2 getUVFromExtent (vec2 average, vec2 left, vec2 right, vec2 up, vec2 down) {
                vec2 uv = inTexCoord;
                float xReadjust = X_ADJUST * u_AspectRatio;
                vec2 diffLR = left - right;
                vec2 diffUD = up - down;
                diffLR.x *= xReadjust;
                diffUD.x *= xReadjust;
                float lenLR = length(diffLR);
                float lenUD = length(diffUD);
                float maxLen = max(lenUD, lenLR);
                vec2 midpoint = vec2(maxLen) / 2.;
                vec2 screenRatio = vec2(1. / u_AspectRatio, 1.);
                vec2 scaleAdjust = screenRatio * RESCALE;
                uv *= maxLen; 
                uv = rotateAboutPoint2D(uv, midpoint, u_Rotation.z);
                uv *= scaleAdjust;
                uv += calcCenter(average, left, right, up, down, screenRatio) - scaleAdjust * midpoint;
                return uv;
            }

            void main () {
                vec2 left, right, up, down;
                vec2 average = calcAverage();
                calcMaxExtentPoints(average, left, right, up, down);
                v_UV = getUVFromExtent(average, left, right, up, down);
                v_UV = mix(v_UV, inTexCoord, u_ScreenSpaceMode);
                gl_Position = vec4(inPosition.xy, 0.0, 1.0);
            }
        `,

        FS: 
        `
            precision highp float;

            const float INF = 1. / 0.;
            const int MAX_SIZE = 100;
            const float FEATH_ADJ = 0.25;

        #ifndef NUM_KEYPOINTS
            const int NUM_KEYPOINTS = 1;
        #endif

            uniform vec2 u_Keypoints[NUM_KEYPOINTS];

            varying vec2 v_UV;

            // Avoids array out of bounds
            vec2 getKeyPointSafe(int index) { 
                int i = int(mix(float(index), 0., float(index >= NUM_KEYPOINTS))); 
                return u_Keypoints[i];
            }

            // Returns 1.0 if UV point is within cutout shape, 0.0 otherwise
            // Utilizes point in polygon method described below:
            // https://observablehq.com/@tmcw/understanding-point-in-polygon
            float pointInPolygon () {
                float inside = 0.;
                float x = v_UV.x;
                float y = v_UV.y;
                for(int i = 0; i < NUM_KEYPOINTS; i++) {
                    vec2 p1 = u_Keypoints[i]; 
                    vec2 p2 = getKeyPointSafe(i + 1);
                    vec2 pDiff = p2 - p1;
                    float intersect = float(((p1.y > y) != (p2.y > y)) && (x < pDiff.x * (y - p1.y) / pDiff.y + p1.x));
                    inside = mix(inside, 1. - inside, intersect);
                }
                return inside;
            }

            void main () {
                vec2 coord = v_UV;
                coord.x = mix(coord.x, 3. * coord.x - 1., float(coord.x > 1.));
                float mask = pointInPolygon();
                gl_FragColor = vec4(coord, 0., mask);
            }
        `,
    },
    Blur : 
    {
        VS: 
        `
            precision highp float;

            attribute vec3 inPosition;
            attribute vec2 inTexCoord;
            
            varying vec2 v_UV;
        
            void main ()
            {
                v_UV = inTexCoord;
                gl_Position = vec4(inPosition.xy, 0.0, 1.0);
            }
        `,
        
        FS_HORIZONTAL: 
        `
            precision highp float;

            const int BLUR_SIZE_LIMIT = 9;

        #ifndef BLUR_QUALITY
            const int BLUR_QUALITY = 1;
        #endif

            uniform sampler2D u_HorizontalBlurInputRT;
            uniform float u_HorizontalNormalizer;
            uniform float u_HorizontalWeights[BLUR_SIZE_LIMIT];
            uniform vec2 u_HorizontalOffsets[BLUR_SIZE_LIMIT];
        
            varying vec2 v_UV;
        
            void main ()
            {
                mediump float alpha = u_HorizontalWeights[0] * texture2D(u_HorizontalBlurInputRT, v_UV).a;
                for (int i = 1; i <= BLUR_QUALITY; i++) {
                    alpha += u_HorizontalWeights[i] * texture2D(u_HorizontalBlurInputRT, v_UV + u_HorizontalOffsets[i]).a;
                    alpha += u_HorizontalWeights[i] * texture2D(u_HorizontalBlurInputRT, v_UV - u_HorizontalOffsets[i]).a;
                }
                alpha *= u_HorizontalNormalizer;
                gl_FragColor = vec4(alpha);
            }
        `,
        
        FS_VERTICAL: 
        `
            precision highp float;

            const int BLUR_SIZE_LIMIT = 9;

        
        #ifndef BLUR_QUALITY
            const int BLUR_QUALITY = 1;
        #endif

            uniform sampler2D u_VerticalBlurInputRT;
            uniform float u_VerticalNormalizer;
            uniform float u_VerticalWeights[BLUR_SIZE_LIMIT];
            uniform vec2 u_VerticalOffsets[BLUR_SIZE_LIMIT];

            varying vec2 v_UV;
            
            void main ()
            {
                mediump float alpha = u_VerticalWeights[0] * texture2D(u_VerticalBlurInputRT, v_UV).a;
                for (int i = 1; i <= BLUR_QUALITY; i++) {
                    alpha += u_VerticalWeights[i] * texture2D(u_VerticalBlurInputRT, v_UV + u_VerticalOffsets[i]).a;
                    alpha += u_VerticalWeights[i] * texture2D(u_VerticalBlurInputRT, v_UV - u_VerticalOffsets[i]).a;
                }
                alpha *= u_VerticalNormalizer;
                gl_FragColor = vec4(alpha);
            }
        `,
    },
    World : {
        VS: 
        `
            precision highp float;

            attribute vec3 inPosition;
            attribute vec2 inTexCoord;

            uniform mat4 u_Model;
            uniform mat4 u_MVP;

            uniform float u_ScreenSpaceMode;
            uniform float u_CenterMode;
            uniform float u_AspectRatio;

        #ifndef NUM_KEYPOINTS
            const int NUM_KEYPOINTS = 1;
        #endif

            uniform vec2 u_Keypoints[NUM_KEYPOINTS];


            uniform vec3 u_Rotation;
            
            varying vec2 v_UV;
            varying vec2 v_InsetUV;
            varying vec2 v_ScreenCoord;

            const float X_ADJUST = 3.6;
            const float RESCALE = 0.75;
            const float MESH_SCALE_MOD = 10.;

            // Sets UV using texture from first pass

            // Rotates coordinates in 2D
            vec2 rotate(vec2 v, float a) {
                float c = cos(a), s = sin(a);
                return v * mat2(c, -s, s, c);
            }

            // Rotates about a 2D point
            vec2 rotateAboutPoint2D(vec2 v, vec2 p, float a) {
                v = v - p;
                v = rotate(v, a);
                return v + p;
            }

            vec2 calcAverage () {
                vec2 average = vec2(0.);
                for(int i = 0; i < NUM_KEYPOINTS; i++) {
                    average += u_Keypoints[i];
                }
                average /= float(NUM_KEYPOINTS);
                return average;
            }

            // Given a list of keypoints, the count, and the average of those points, find the farthest reaching 
            // left, right, up, down points
            void calcMaxExtentPoints (in vec2 average, out vec2 left, out vec2 right, out vec2 up, out vec2 down) {
                left = vec2(1., 0.5);
                right = vec2(0., 0.5);
                up = vec2(0.5, 1.);
                down = vec2(0.5, 0.);
                for(int i = 0; i < NUM_KEYPOINTS; i++) {
                    vec2 point = u_Keypoints[i];
                    point = rotateAboutPoint2D(point, average, -u_Rotation.z);
                    left = mix(left, point, float(point.x < left.x));
                    right = mix(right, point, float(point.x > right.x));
                    up = mix(up, point, float(point.y < up.y));
                    down = mix(down, point, float(point.y > down.y));
                }
                left = rotateAboutPoint2D(left, average, u_Rotation.z);
                right = rotateAboutPoint2D(right, average, u_Rotation.z);
                up = rotateAboutPoint2D(up, average, u_Rotation.z);
                down = rotateAboutPoint2D(down, average, u_Rotation.z);
            }

            // calculate center depending on mode
            vec2 calcCenter(vec2 average, vec2 left, vec2 right, vec2 up, vec2 down, vec2 screenRatio) {
                vec2 center; // Determine center by using mode uniform
                if (u_CenterMode == 0.) {
                    center = average;
                } 
                else { // Max extent
                    vec2 ratio = mix(screenRatio, vec2(1.), u_ScreenSpaceMode); // Adjust for quad vs screen
                    float lenLR = length((left - right) * ratio);
                    float lenUD = length((up - down) * ratio);
                    vec2 maxLengths =  vec2(lenUD, lenLR);
                    float thresh = smoothstep(0.75, 1.25, maxLengths.x / maxLengths.y);
                    center = mix((left + right) * 0.5, (up + down) * 0.5, thresh);
                }
                return center;
            }

            // Sets UV bounds from the maximum extent of the keypoints
            vec2 getUVFromExtent (vec2 average, vec2 left, vec2 right, vec2 up, vec2 down) {
                vec2 uv = inTexCoord;
                float xReadjust = X_ADJUST * u_AspectRatio;
                vec2 diffLR = left - right;
                vec2 diffUD = up - down;
                diffLR.x *= xReadjust;
                diffUD.x *= xReadjust;
                float lenLR = length(diffLR);
                float lenUD = length(diffUD);
                float maxLen = max(lenUD, lenLR);
                vec2 midpoint = vec2(maxLen) / 2.;
                vec2 screenRatio = vec2(1. / u_AspectRatio, 1.);
                vec2 scaleAdjust = screenRatio * RESCALE;
                uv *= maxLen; 
                uv = rotateAboutPoint2D(uv, midpoint, u_Rotation.z);
                uv *= scaleAdjust;
                uv += calcCenter(average, left, right, up, down, screenRatio) - scaleAdjust * midpoint;
                return uv;
            }

            void main () {
                v_UV = inTexCoord;
                vec2 left, right, up, down;
                vec2 average = calcAverage();
                calcMaxExtentPoints(average, left, right, up, down);
                v_InsetUV = getUVFromExtent(average, left, right, up, down);
                vec4 homPos = vec4(inPosition, 1.);
                mat4 rescaleMat = mat4(mat3(MESH_SCALE_MOD));
                vec4 finalPos = u_MVP * (rescaleMat * homPos);
                vec3 ndc = finalPos.xyz / finalPos.w;
                v_ScreenCoord = ndc.xy * 0.5 + 0.5;
                finalPos = mix(finalPos, vec4(inPosition.xy, 0.0, 1.0), u_ScreenSpaceMode);
                gl_Position = finalPos;
            }
        `,
        
        FS: 
        `
            precision highp float;

            uniform vec4 u_FillColor;
            uniform vec4 u_OutlineColor;
            uniform float u_Opacity;
            uniform float u_OutlineThresh;
            uniform float u_OutlineInfluence;

            uniform sampler2D u_CameraTexture;
            uniform sampler2D u_FinalAlphaCoordRT;
            uniform sampler2D u_FBOTexture;

        #ifdef USE_MIP_BLUR
            uniform float u_FeatheringScale;
            const float MIP_RESCALE = 0.85;
        #endif

            varying vec2 v_UV;
            varying vec2 v_InsetUV;
            varying vec2 v_ScreenCoord;

            // Colors final geometry using calculated inset UV, optionally blurred alpha, input camera texture, 
            // blend mode with FBO texture, and color properties (outline and fill)

            vec4 textureFromFBO(vec2 uv)
            {
                vec4 result = texture2D(u_FBOTexture, uv);
                return result;
            }
        
            #ifdef BLEND_MODE_MULTIPLY
            vec3 blendMultiply(vec3 base, vec3 blend)
            {
                    return base * blend;
            }
            vec3 blendMultiply(vec3 base, vec3 blend, float opacity)
            {
                    return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #if defined(BLEND_MODE_OVERLAY) || defined(BLEND_MODE_HARD_LIGHT)
            float blendOverlay(float base, float blend)
            {
                    return base < 0.5 ? (2.0 * base * blend) :(1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
            }
            vec3 blendOverlay(vec3 base, vec3 blend)
            {
                    return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
            }
            vec3 blendOverlay(vec3 base, vec3 blend, float opacity)
            {
                    return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_ADD
            vec3 blendAdd(vec3 base, vec3 blend)
            {
                return min(base + blend,vec3(1.0));
            }
            vec3 blendAdd(vec3 base, vec3 blend, float opacity)
            {
                return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_SCREEN
            vec3 blendScreen(vec3 base, vec3 blend)
            {
                return vec3(1.0) - ((vec3(1.0) - base) * (vec3(1.0) - blend));
            }
            vec3 blendScreen(vec3 base, vec3 blend, float opacity)
            {
                return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_SOFT_LIGHT
            float blendSoftLight(float base, float blend)
            {
                return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
            }
            vec3 blendSoftLight(vec3 base, vec3 blend)
            {
                return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
            }
            vec3 blendSoftLight(vec3 base, vec3 blend, float opacity)
            {
                return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif

            #ifdef BLEND_MODE_HARD_LIGHT
            vec3 blendHardLight(vec3 base, vec3 blend) {
                return blendOverlay(blend,base);
            }
            
            vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
                return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_AVERAGE
            vec3 blendAverage(vec3 base, vec3 blend)
            {
                    return (base + blend) / 2.0;
            }
            vec3 blendAverage(vec3 base, vec3 blend, float opacity)
            {
                    return (blendAverage(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_COLOR_BURN
            float blendColorBurn(float base, float blend)
            {
                    return (blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)),0.0);
            }
            vec3 blendColorBurn(vec3 base, vec3 blend)
            {
                    return vec3(blendColorBurn(base.r, blend.r), blendColorBurn(base.g, blend.g), blendColorBurn(base.b, blend.b));
            }
            vec3 blendColorBurn(vec3 base, vec3 blend, float opacity)
            {
                    return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_COLOR_DODGE
            float blendColorDodge(float base, float blend)
            {
                    return (blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0);
            }
            vec3 blendColorDodge(vec3 base, vec3 blend)
            {
                    return vec3(blendColorDodge(base.r, blend.r), blendColorDodge(base.g, blend.g), blendColorDodge(base.b, blend.b));
            }
            vec3 blendColorDodge(vec3 base, vec3 blend, float opacity)
            {
                    return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_DARKEN
            float blendDarken(float base, float blend)
            {
                    return min(blend,base);
            }
            vec3 blendDarken(vec3 base, vec3 blend)
            {
                    return vec3(blendDarken(base.r,blend.r), blendDarken(base.g,blend.g), blendDarken(base.b,blend.b));
            }
            vec3 blendDarken(vec3 base, vec3 blend, float opacity)
            {
                    return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_DIFFERENCE
            vec3 blendDifference(vec3 base, vec3 blend)
            {
                    return abs(base - blend);
            }
            vec3 blendDifference(vec3 base, vec3 blend, float opacity)
            {
                    return (blendDifference(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_EXCLUSION
            vec3 blendExclusion(vec3 base, vec3 blend)
            {
                    return base + blend - 2.0 * base * blend;
            }
            vec3 blendExclusion(vec3 base, vec3 blend, float opacity)
            {
                    return (blendExclusion(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_LIGHTEN
            float blendLighten(float base, float blend)
            {
                    return max(blend,base);
            }
            vec3 blendLighten(vec3 base, vec3 blend)
            {
                    return vec3(blendLighten(base.r,blend.r), blendLighten(base.g,blend.g), blendLighten(base.b,blend.b));
            }
            vec3 blendLighten(vec3 base, vec3 blend, float opacity)
            {
                    return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            #ifdef BLEND_MODE_LINEAR_DODGE
            float blendLinearDodge(float base, float blend)
            {
                    return min(base + blend, 1.0);
            }
            vec3 blendLinearDodge(vec3 base, vec3 blend)
            {
                    return min(base + blend,vec3(1.0));
            }
            vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity)
            {
                    return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
            }
            #endif
        
            vec4 applyBlendMode(vec4 color, vec2 uv)
            {
                vec4 ret = color;
            #ifdef BLEND_MODE_MULTIPLY
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendMultiply(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_OVERLAY
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendOverlay(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_ADD
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendAdd(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_SCREEN
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendScreen(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_SOFT_LIGHT
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendSoftLight(ret.rgb, framecolor.rgb);
            #endif

            #ifdef BLEND_MODE_HARD_LIGHT
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendHardLight(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_AVERAGE
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendAverage(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_COLOR_BURN
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendColorBurn(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_COLOR_DODGE
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendColorDodge(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_DARKEN
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendDarken(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_DIFFERENCE
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendDifference(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_EXCLUSION
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendExclusion(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_LIGHTEN
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendLighten(ret.rgb, framecolor.rgb);
            #endif
        
            #ifdef BLEND_MODE_LINEAR_DODGE
                vec4 framecolor = textureFromFBO(uv);
                ret.rgb = blendLinearDodge(ret.rgb, framecolor.rgb);
            #endif
                return ret;
            }

            void main () {
            #ifdef USE_MIP_BLUR
                vec4 finalAlphaCoord = texture2D(u_FinalAlphaCoordRT, v_UV, u_FeatheringScale * MIP_RESCALE);
            #else
                vec4 finalAlphaCoord = texture2D(u_FinalAlphaCoordRT, v_UV);
            #endif
                if (v_InsetUV.x <= 0. || 
                    v_InsetUV.x >= 1. || 
                    v_InsetUV.y <= 0. || 
                    v_InsetUV.y >= 1. || 
                    finalAlphaCoord.a == 0.) 
                {
                    discard;
                }

                #ifdef USE_INPUT_RT
                    mediump vec4 finalColor = texture2D(u_CameraTexture, v_InsetUV);
                #endif

                #ifdef USE_FINAL_RT
                    mediump vec4 finalColor = texture2D(u_FBOTexture, v_InsetUV);
                #endif
                                

                finalColor.rgb = mix(finalColor.rgb, u_FillColor.rgb, u_FillColor.a);
                if (u_OutlineInfluence > 0.) 
                {
                    mediump vec4 outlineColor = mix(u_OutlineColor, finalColor, smoothstep(u_OutlineThresh, 1., finalAlphaCoord.a));
                    outlineColor.a *= smoothstep(0., 0.2, finalAlphaCoord.a);
                    finalColor = mix(finalColor, outlineColor, u_OutlineInfluence);
                }
                finalColor.a = finalAlphaCoord.a * u_Opacity;
                gl_FragColor = applyBlendMode(finalColor, v_ScreenCoord);
            }
        `,
        
    },
};

exports.InsetShaders_GLSL = InsetShaders_GLSL;