/*jshint maxerr: 1000 */

const Amaz = effect.Amaz;

const { RendererBase } = require('RendererBase');
const { ShaderUtils } = require('ShaderUtils');
const { MeshUtils } = require('MeshUtils');
const { InsetConstants } = require('InsetConstants');
const { getShaderMap, SHADERNAME } = require('InsetShaderMap');
const Keys = InsetConstants.Keys;

// ------ INSET RENDERING CONSTANTS ------

const BLEND_MODES_MAP = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_DISABLE] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_NORMAL] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_DARKEN] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_MULTIPLY] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_COLOR_BURN] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_LIGHTEN] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_SCREEN] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_COLOR_DODGE] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_OVERLAY] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_ADD] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_EXCLUSION] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_SOFT_LIGHT] = {};
BLEND_MODES_MAP[Keys.BLEND_MODE_HARD_LIGHT] = {};

// Number mapping for quick comparison 
BLEND_MODES_MAP[Keys.BLEND_MODE_DISABLE].enum = 1;
BLEND_MODES_MAP[Keys.BLEND_MODE_NORMAL].enum = 2;
BLEND_MODES_MAP[Keys.BLEND_MODE_DARKEN].enum = 3;
BLEND_MODES_MAP[Keys.BLEND_MODE_MULTIPLY].enum = 4;
BLEND_MODES_MAP[Keys.BLEND_MODE_COLOR_BURN].enum = 5;
BLEND_MODES_MAP[Keys.BLEND_MODE_LIGHTEN].enum = 6;
BLEND_MODES_MAP[Keys.BLEND_MODE_SCREEN].enum = 7;
BLEND_MODES_MAP[Keys.BLEND_MODE_COLOR_DODGE].enum = 8;
BLEND_MODES_MAP[Keys.BLEND_MODE_OVERLAY].enum = 9;
BLEND_MODES_MAP[Keys.BLEND_MODE_ADD].enum = 10;
BLEND_MODES_MAP[Keys.BLEND_MODE_EXCLUSION].enum = 11;
BLEND_MODES_MAP[Keys.BLEND_MODE_SOFT_LIGHT].enum = 12;
BLEND_MODES_MAP[Keys.BLEND_MODE_HARD_LIGHT].enum = 13;

// Key to macro conversion
BLEND_MODES_MAP[Keys.BLEND_MODE_DISABLE].macro = "BLEND_MODE_DISABLE";
BLEND_MODES_MAP[Keys.BLEND_MODE_NORMAL].macro = "BLEND_MODE_AVERAGE";
BLEND_MODES_MAP[Keys.BLEND_MODE_DARKEN].macro = "BLEND_MODE_DARKEN";
BLEND_MODES_MAP[Keys.BLEND_MODE_MULTIPLY].macro = "BLEND_MODE_MULTIPLY";
BLEND_MODES_MAP[Keys.BLEND_MODE_COLOR_BURN].macro = "BLEND_MODE_COLOR_BURN";
BLEND_MODES_MAP[Keys.BLEND_MODE_LIGHTEN].macro = "BLEND_MODE_LIGHTEN";
BLEND_MODES_MAP[Keys.BLEND_MODE_SCREEN].macro = "BLEND_MODE_SCREEN";
BLEND_MODES_MAP[Keys.BLEND_MODE_COLOR_DODGE].macro = "BLEND_MODE_COLOR_DODGE";
BLEND_MODES_MAP[Keys.BLEND_MODE_OVERLAY].macro = "BLEND_MODE_OVERLAY";
BLEND_MODES_MAP[Keys.BLEND_MODE_ADD].macro = "BLEND_MODE_ADD";
BLEND_MODES_MAP[Keys.BLEND_MODE_EXCLUSION].macro = "BLEND_MODE_EXCLUSION";
BLEND_MODES_MAP[Keys.BLEND_MODE_SOFT_LIGHT].macro = "BLEND_MODE_SOFT_LIGHT";
BLEND_MODES_MAP[Keys.BLEND_MODE_HARD_LIGHT].macro = "BLEND_MODE_HARD_LIGHT";

// Key to number conversion for center mode for shader
const CENTER_MODE_MAP = {};
CENTER_MODE_MAP[Keys.CM_AVERAGE] = 0;
CENTER_MODE_MAP[Keys.CM_EXTENT_CENTER] = 1;

// Constant tables that map RT size strings to numbers
const RT_SIZE_MAP = {};
RT_SIZE_MAP[Keys.QUALITY_LOW] = 256;
RT_SIZE_MAP[Keys.QUALITY_MEDIUM] = 512;
RT_SIZE_MAP[Keys.QUALITY_HIGH] = 512;

const BLUR_QUALITY_MAP = {};
BLUR_QUALITY_MAP[Keys.QUALITY_LOW] = 0;
BLUR_QUALITY_MAP[Keys.QUALITY_MEDIUM] = 2;
BLUR_QUALITY_MAP[Keys.QUALITY_HIGH] = 3;

// Mesh constants
const GRID_WIDTH = 3;
const GRID_HEIGHT = 3;

// Blur constants
const BLUR_DIRECTIONS = {};
BLUR_DIRECTIONS[Keys.BLUR_VERTICAL] = 1;
BLUR_DIRECTIONS[Keys.BLUR_HORIZONTAL] = 2;
const BLUR_QUALITY_RESCALE = 1.5;
const BLUR_SIGMA = 20;
const BLUR_SIGMA2 = BLUR_SIGMA * BLUR_SIGMA;
const MIN_RT_SIZE = 256;

const RESET_AFTER_FRAMES = 5; // workaround for Orion material issues

class InsetRenderer extends RendererBase {

    constructor() {
        super();
        this._frame = 0;
    }

    // onStart
    onStart() {
        const renderer = this.entity.native.getComponent("MeshRenderer");
        if (renderer) {
            renderer.enabled = false; // Prevent inspector material from displaying
        }
    }

    // _reset
    // Reset renderer, materials, and all other objects responsible for rendering the inset object
    _reset() {
        this._frame = 0;
        this._buildRenderer();
        this._buildMaterial();
        if (this._renderer && this._material) {
            this._renderer.materials.clear();
            this._renderer.materials.pushBack(this._material);
        } else {
            this._loge("Error in rendering setup!");
        }
        this._setTextureProperties();
    }

    // _setInsetProperties
    // Take keypoints from algorithm, indices of keypoints to feed into shader, and
    // a rotation vector (if applicable), and feed these into the inset material
    _setInsetProperties(algorithmKeypoints, insetKeypointIndices, eulerAngles) {
        this._frame += 1;
        this._renderer = this.entity.native.getComponent("MeshRenderer");
        if (this._renderer == null) {
            this._loge("Renderer not initialized!");
            return;
        }
        this._renderer.enabled = false;   
        if (algorithmKeypoints && eulerAngles) {
            let numKeypointIndices = 0;
            let insetKeypoints;
            if (insetKeypointIndices != null){
                numKeypointIndices = insetKeypointIndices.length;
                insetKeypoints = this._getInsetKeypoints(algorithmKeypoints, insetKeypointIndices);
            } else {
                numKeypointIndices = algorithmKeypoints.size();
                insetKeypoints = algorithmKeypoints;
            }
            if (this._shouldReset(numKeypointIndices)) {
                this._reset();
            }
            if (insetKeypoints && this._material) {
                this._renderer.enabled = true;
                this._setMaterialProperties(insetKeypoints, eulerAngles);
                if (BLUR_QUALITY_MAP[this.get(Keys.QUALITY)] > 0 && this.get(Keys.USE_FEATHERING) && this._shouldRecalculateBlurUniforms()) {
                    this._calculateBlurUniforms(Keys.BLUR_VERTICAL);
                    this._calculateBlurUniforms(Keys.BLUR_HORIZONTAL);
                }
            } else {
                if (!insetKeypoints) {
                    this._loge("No keypoints to send to material!");
                } else {
                    this._loge("Error setting material/renderer properties!");
                }
            }
        } 
    }

    // _getInsetKeypoints
    // Take the keypoint vector from the algorithm and a list of indices selected by script properties, 
    // and return just the selected keypoints corresponding to those indices
    _getInsetKeypoints(algorithmKeypoints, insetKeypointIndices) {
        const insetKeypoints = new Amaz.Vec2Vector();
        const numInsetKeypoints = insetKeypointIndices.length;
        for (let i = 0; i < numInsetKeypoints; i++) {
            const keypointIndex = insetKeypointIndices[i];
            if (algorithmKeypoints && algorithmKeypoints.size() > 0 && keypointIndex != undefined) {
                const keypoint = algorithmKeypoints.get(keypointIndex);
                if (keypoint) {
                    insetKeypoints.pushBack(keypoint);
                } else {
                    this._loge("Keypoint index not found!");
                    return null;
                }
            } else {
                this._loge("Error extracting inset keypoints");
            }
        }
        return insetKeypoints;
    }

    // _buildRenderer
    // Gets the renderer, removes any extra materials, and sets the mesh
    _buildRenderer() {
        const renderer = this.entity.native.getComponent("MeshRenderer");
        if (renderer) {
            this._renderer = renderer;
        } else {
            this._renderer = this.entity.native.addComponent("MeshRenderer");
        }
        if (this._renderer == null) {
            this._loge("Renderer not initialized!");
            return;
        }
        this._renderer.materials = new Amaz.Vector(); // remove any materials
        this._renderer.sharedMaterials = new Amaz.Vector();
        this._renderer.enabled = false;
        // Todo: make static, build only once
        const gridMesh = MeshUtils.createGridMesh(GRID_WIDTH, GRID_HEIGHT);
        if (gridMesh) {
            this._renderer.mesh = gridMesh;
        }
        this._renderer.props = new Amaz.MaterialPropertyBlock();
    }

    // _buildMaterial
    //  Sets up render textures, shader macros, and builds the material's passes
    _buildMaterial() {
        this._previousUniforms = {};
        this._material = ShaderUtils.createEmptyMaterial("Inset Material");
        const numInsetKeypoints = this._getInsetKeypointIndices().length;
        // Set up shader source code text; macros done this way to work around engine not setting them properly
        const keypointsMacro = '#define NUM_KEYPOINTS ' + parseInt(numInsetKeypoints);
        const blurMacro = '#define BLUR_QUALITY ' + parseInt(BLUR_QUALITY_MAP[this.get(Keys.QUALITY)]);
        let worldMacro = '#define ' + BLEND_MODES_MAP[this.get(Keys.BLEND_MODE)].macro + ' + 1\n';
        worldMacro += '#define NUM_KEYPOINTS ' + parseInt(numInsetKeypoints) + '\n';
        // Set up passes and RTs
        const alphaPass = ShaderUtils.addPassToMaterial(this._material, getShaderMap(keypointsMacro, SHADERNAME.alpha));
        const rtSize = RT_SIZE_MAP[this.get(Keys.QUALITY)] * 0.8;
        this._alphaCoordRT = ShaderUtils.createRenderTexture("vertical", rtSize, rtSize);
        alphaPass.renderTexture = this._alphaCoordRT;
        alphaPass.renderState.depthstencil.depthTestEnable = false;
        if (this.get(Keys.USE_FEATHERING)) { 
            if (BLUR_QUALITY_MAP[this.get(Keys.QUALITY)] > 0) { // Use gaussian blur
                const hBlurPass = ShaderUtils.addPassToMaterial(this._material,getShaderMap(blurMacro, SHADERNAME.hBlur));
                const vBlurPass = ShaderUtils.addPassToMaterial(this._material,getShaderMap(blurMacro, SHADERNAME.vBlur));
                this._hBlurRT = ShaderUtils.createRenderTexture("horizontal", rtSize, rtSize);
                this._vBlurRT = ShaderUtils.createRenderTexture("vertical", rtSize, rtSize);
                this._hBlurRT.width = rtSize * 0.8;
                this._hBlurRT.height = rtSize * 0.8;
                this._vBlurRT.width = rtSize * 0.8;
                this._vBlurRT.height = rtSize * 0.8;
                hBlurPass.renderTexture = this._hBlurRT;
                vBlurPass.renderTexture = this._vBlurRT;
                hBlurPass.renderState.depthstencil.depthTestEnable = false;
                vBlurPass.renderState.depthstencil.depthTestEnable = false;
                this._alphaCoordRT.enableMipmap = false;
                this._alphaCoordRT.filterMipmap = Amaz.FilterMipmapMode.NONE;
            } else { // Use mip blur
                worldMacro += '\n#define USE_MIP_BLUR 1\n';
                this._alphaCoordRT.enableMipmap = true;
                this._alphaCoordRT.filterMipmap = Amaz.FilterMipmapMode.LINEAR;
            }
        } else {
            this._alphaCoordRT.enableMipmap = false;
            this._alphaCoordRT.filterMipmap = Amaz.FilterMipmapMode.NONE;
        }
        if (this.get(Keys.INPUT_TEXTURE) === Keys.CAMERA_INPUT_TEXTURE) {
            worldMacro += '\n#define USE_INPUT_RT 1\n';
        } else if (this.get(Keys.INPUT_TEXTURE) === Keys.FINAL_RENDER_TEXTURE) {
            worldMacro += '\n#define USE_FINAL_RT 1\n';
        }
        this._worldPass = ShaderUtils.addPassToMaterial(this._material,getShaderMap(worldMacro, SHADERNAME.world));
        this._worldPass.renderState.colorBlend = ShaderUtils.getAlphaOverBlendState();
        const useFBOTexture = BLEND_MODES_MAP[this.get(Keys.BLEND_MODE)].enum != BLEND_MODES_MAP[Keys.BLEND_MODE_DISABLE];
        this._worldPass.useFBOTexture = useFBOTexture;
    }
    
    // _shouldReset
    // Returns true if certain properties are changed that a reset; those properties are then cached
    // so that unless they change again, this will return false
    _shouldReset(numInsetKeypoints) {
        if (this._prevInputTexture != this.get(Keys.INPUT_TEXTURE) ||
            this._prevNumCutoutPts != numInsetKeypoints ||
            this._prevUseFeathering != this.get(Keys.USE_FEATHERING) ||
            this._prevUseHighQuality != BLUR_QUALITY_MAP[this.get(Keys.QUALITY)] > 0 ||
            this._prevFeatheringQuality != BLUR_QUALITY_MAP[this.get(Keys.QUALITY)] ||
            this._prevRenderTextureSize != RT_SIZE_MAP[this.get(Keys.QUALITY)] ||
            this._prevBlendMode != BLEND_MODES_MAP[this.get(Keys.BLEND_MODE)].enum ||
            this._renderer == null ||
            this._renderer.materials.size() === 0 ||
            !this._resetOnce && this._frame >= RESET_AFTER_FRAMES ||
            this._material == null) {
            this._resetOnce = this._frame >= RESET_AFTER_FRAMES;
            this._prevNumCutoutPts = numInsetKeypoints;
            this._prevUseFeathering = this.get(Keys.USE_FEATHERING);
            this._prevUseHighQuality = BLUR_QUALITY_MAP[this.get(Keys.QUALITY)] > 0;
            this._prevFeatheringQuality = BLUR_QUALITY_MAP[this.get(Keys.QUALITY)];
            this._prevRenderTextureSize = RT_SIZE_MAP[this.get(Keys.QUALITY)];
            this._prevBlendMode = BLEND_MODES_MAP[this.get(Keys.BLEND_MODE)].enum;
            this._recalculateBlurFlag = true;
            this._prevInputTexture = this.get(Keys.INPUT_TEXTURE);
            return true;
        }
        return false;
    }

    // _getCenterMode
    // Returns the center mode enum that is currently selected in the properties
    _getCenterMode() {
        if (this._useExtentCenter()) {
            return CENTER_MODE_MAP[Keys.CM_EXTENT_CENTER];
        } else {
            return CENTER_MODE_MAP[Keys.CM_AVERAGE];
        }
    }

    // _setTextureProperties
    // Sets textures, and also 
    _setTextureProperties() {
        this._cameraTexture = this.entity.native.scene.assetMgr.SyncLoad("share://input.texture");
        this._setTex("u_CameraTexture", this._cameraTexture);
        this._setTex("u_AlphaCoordRT", this._alphaCoordRT);
        if (BLUR_QUALITY_MAP[this.get(Keys.QUALITY)] > 0 && this.get(Keys.USE_FEATHERING)) {
            this._setTex("u_HorizontalBlurInputRT", this._alphaCoordRT);
            this._setTex("u_VerticalBlurInputRT", this._hBlurRT);
            this._setTex("u_FinalAlphaCoordRT", this._vBlurRT);
        } else {
            this._setTex("u_FinalAlphaCoordRT", this._alphaCoordRT);
        }
        // If there's ever an option to change the camera textures, these should be moved elsewhere
        this._resolution = new Amaz.Vector2f(this._cameraTexture.width, this._cameraTexture.height);
        this._aspectRatio = this._resolution.x / this._resolution.y;
        this._isScreenSpace = false; // Option disabled in Orion
    }

    // _shouldRecalculateBlurUniforms
    // Only recalculate blur uniforms if scale is changed or material reset sets a flag
    _shouldRecalculateBlurUniforms() {
        if (this._prevFeatheringScale != this.get(Keys.FEATHERING_SCALE) ||
            this._recalculateBlurFlag) {
            this._prevFeatheringScale = this.get(Keys.FEATHERING_SCALE);
            this._recalculateBlurFlag = false;
            return true;
        } else {
            return false;
        }
    }

    // _calculateBlurUniforms
    // Calculate gaussian blur weights and offsets for both vertical and horizontal blurs
    // depending on the parameter
    // https://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
    _calculateBlurUniforms(direction) {
        // Calculate step size
        const stepSize = new Amaz.Vector2f(0, 0);
        const rtSize = RT_SIZE_MAP[this.get(Keys.QUALITY)];
        let scaleModifier = rtSize / MIN_RT_SIZE;
        if (BLUR_DIRECTIONS[direction] === BLUR_DIRECTIONS[Keys.BLUR_VERTICAL]) {
            stepSize.y = scaleModifier / rtSize;
        } else { // Horizontal
            stepSize.x = scaleModifier / rtSize;
        }
        // Calculate offsets, weights, normalizer
        const featheringQuality = BLUR_QUALITY_MAP[this.get(Keys.QUALITY)];
        const qualityScaleAdjust = BLUR_QUALITY_RESCALE / (featheringQuality + 1);
        const featheringScale = this.get(Keys.FEATHERING_SCALE) * qualityScaleAdjust;
        const sqrtPi2Sigma2 = Math.sqrt(2 * Math.PI * BLUR_SIGMA2);
        const invSqrtPi2Sigma2 = 1 / sqrtPi2Sigma2;
        const weights = new Amaz.FloatVector();
        const offsets = new Amaz.Vec2Vector();
        weights.pushBack(invSqrtPi2Sigma2);
        offsets.pushBack(new Amaz.Vector2f(0, 0));
        let kernelSum = weights.get(0);
        for (let i = 1; i <= featheringQuality; i++) {
            const level0 = 2 * i - 1;
            const level1 = 2 * i;
            const gaussian0 = invSqrtPi2Sigma2 * Math.exp(-(level0 * level0) / (2 * BLUR_SIGMA2));
            const gaussian1 = invSqrtPi2Sigma2 * Math.exp(-(level1 * level1) / (2 * BLUR_SIGMA2));
            const gaussianTotal = gaussian0 + gaussian1;
            weights.pushBack(gaussianTotal);
            kernelSum += gaussianTotal * 2;
            const rescale0 = level0 * featheringScale * gaussian0 / gaussianTotal;
            const rescale1 = level1 * featheringScale * gaussian1 / gaussianTotal;
            const offset0 = new Amaz.Vector2f(stepSize.x * rescale0, stepSize.y * rescale0);
            const offset1 = new Amaz.Vector2f(stepSize.x * rescale1, stepSize.y * rescale1);
            const finalOffset = new Amaz.Vector2f(offset0.x + offset1.x, offset0.y + offset1.y);
            offsets.pushBack(finalOffset);
        }
        const normalizer = 1 / kernelSum;
        // Send calculated values to the material
        if (BLUR_DIRECTIONS[direction] == BLUR_DIRECTIONS[Keys.BLUR_VERTICAL]) {
            this._setFloatVec("u_VerticalWeights", weights);
            this._setVec2Vec("u_VerticalOffsets", offsets);
            this._setFloat("u_VerticalNormalizer", normalizer);
        } else {
            this._setFloatVec("u_HorizontalWeights", weights);
            this._setVec2Vec("u_HorizontalOffsets", offsets);
            this._setFloat("u_HorizontalNormalizer", normalizer);
        }
    }

    // _setMaterialProperties
    _flickerReduce() {
        return this._frame >= RESET_AFTER_FRAMES ? 1 : 0;
    }

    // _setMaterialProperties
    // Sets properties used in the inset main material
    _setMaterialProperties(insetKeypoints, eulerAngles) {
        this._setVec2Vec("u_Keypoints", insetKeypoints);
        this._setFloat("u_AspectRatio", this._aspectRatio);
        this._setFloat("u_CenterMode", this._getCenterMode());
        this._setVec3("u_Rotation", eulerAngles);
        this._setFloat("u_ScreenSpaceMode", false); // disabled for Orion
        if (this.get("_useFillColor")) {
            this._setColor("u_FillColor", this.get(Keys.FILL_COLOR));
        }
        this._setFloat("u_Opacity", this.get(Keys.OPACITY) * this._flickerReduce());
        this._setFloat("u_FeatheringScale", this.get(Keys.FEATHERING_SCALE));
        this._setFloat("u_OutlineInfluence", this.get(Keys.USE_OUTLINE) ? 1 : 0);
        if (this.get(Keys.USE_OUTLINE)) {
            this._setColor("u_OutlineColor", this.get(Keys.OUTLINE_COLOR));
            // u_OutlineThresh will be used to `smoothstep(u_OutlineThresh, 1., finalAlphaCoord.a)` in InsetGLSLShader.js
            // avoid u_OutlineThresh equal 1
            // here is the smoothstep implement
            // see AMGMakeupUtilsV2.h smoothstep
            /**
             * inline float smoothstep(float x, float xmin, float xmax)
             * {
             *     x = (x - xmin) / (xmax - xmin);
             *     return 3 * x * x - 2 * x * x * x;
             * }
             */
            this._setFloat("u_OutlineThresh", Math.min(this.get(Keys.OUTLINE_THICKNESS), 0.99));
        }
        this._worldPass.renderState.depthstencil.depthTestEnable = this.get(Keys.USE_DEPTH_TEST);
    }
}

exports.InsetRenderer = InsetRenderer;
