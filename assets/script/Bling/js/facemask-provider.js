'use strict';


const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();
const amg = require('./amg');
const Utils = require('./utils').Utils;
const {faceMaskShaderMap} = require('./facemask-provider-shader-map');

class FaceMaskProvider {
    constructor(props) {
        const width = Amaz.AmazingManager.getSingleton('BuiltinObject').getInputTextureWidth()
        const height = Amaz.AmazingManager.getSingleton('BuiltinObject').getInputTextureHeight()
        this.faceMaskRT = Utils.createRenderTexture(width, height, Amaz.PixelFormat.RGBA8Unorm);
        this.mat = Utils.createEmptyMaterial()
        this._cmdBuffer = new Amaz.CommandBuffer();
        
        Utils.addPassToMaterial(this.mat, faceMaskShaderMap, false);
        //this.initRT(this.mat, this.faceMaskRT);
    }

    getTexture() {
        return this.faceMaskRT;
    }

    initRT(mat, rt) {
        let pass = mat.xshader.passes.get(0)
        pass.renderTexture = rt
        pass.clearColor = new Amaz.Color(0.0, 0.0, 0.0, 1.0)
        pass.clearType = Amaz.CameraClearType.COLOR
    }

    autoRTScale(rt) {
        rt.width = Amaz.AmazingManager.getSingleton('BuiltinObject').getInputTextureWidth()
        rt.height = Amaz.AmazingManager.getSingleton('BuiltinObject').getInputTextureHeight()
    }

    onUpdate(dt) {
        this.autoRTScale(this.faceMaskRT)
        if(!this.algoFaceTex) {
            this.algoFaceTex = new Amaz.Texture2D()
            this.algoFaceTex.filterMin = Amaz.FilterMode.LINEAR
            this.algoFaceTex.filterMag = Amaz.FilterMode.LINEAR
        }
        let algoResult = Amaz.AmazingManager.getSingleton('Algorithm').getAEAlgorithmResult()
        let faceCount = algoResult.getFaceCount()

          // let kira = algoResult.getKiraInfo()
        
        if (faceCount) {
            const faceMask = algoResult.getFaceFaceMask()
            const warp_mat = faceMask.warp_mat
            const W = faceMask.face_mask_size
            const H = faceMask.face_mask_size

            let modelMatrix = new Amaz.Matrix4x4f()
            modelMatrix.setRow(0, new Amaz.Vector4f(warp_mat.get(0) / W, warp_mat.get(1) / W, 0.0, warp_mat.get(2) / W))
            modelMatrix.setRow(1, new Amaz.Vector4f(warp_mat.get(3) / H, warp_mat.get(4) / H, 0.0, warp_mat.get(5) / H))
            modelMatrix.setRow(2, new Amaz.Vector4f(0.0, 0.0, 1.0, 0.0))
            modelMatrix.setRow(3, new Amaz.Vector4f(0.0, 0.0, 0.0, 1.0))

            if(!this.algoFaceTex) {
                this.algoFaceTex = new Amaz.Texture2D()
                this.algoFaceTex.filterMin = Amaz.FilterMode.LINEAR
                this.algoFaceTex.filterMag = Amaz.FilterMode.LINEAR
            }
            this.algoFaceTex.storage(faceMask.image);

            this.mat.setMat4("u_MVP", modelMatrix)
            this.mat.setTex("u_SegMask", this.algoFaceTex)
            this.mat.setVec2("u_ScreenParams", new Amaz.Vector2f(this.faceMaskRT.width, this.faceMaskRT.height))
        }

        this._cmdBuffer.clearAll();
        this._cmdBuffer.blitWithMaterial(this.algoFaceTex, this.faceMaskRT, this.mat, 0);

        amg.Engine.engine.scene.native.commitCommandBuffer(this._cmdBuffer);
    }
}

module.exports.FaceMaskProvider = FaceMaskProvider
