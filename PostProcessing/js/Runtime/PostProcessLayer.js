const { PostProcessRenderContext } = require("PostProcessing/Runtime/PostProcessRenderContext");
const { Utils } = require("PostProcessing/Base/Utils");
const { BloomRenderer } = require("PostProcessing/Runtime/Effects/BloomRenderer");
const { FxaaRenderer } = require("PostProcessing/Runtime/Effects/FxaaRenderer");
const { SSAORenderer } = require("PostProcessing/Runtime/Effects/SSAORenderer");
const { ChromaticAberrationRenderer } = require("PostProcessing/Runtime/Effects/ChromaticAberrationRenderer");
const { DistortRenderer } = require("PostProcessing/Runtime/Effects/DistortRenderer");
const { GrainRenderer } = require("PostProcessing/Runtime/Effects/GrainRenderer");
const { VignetteRenderer } = require("PostProcessing/Runtime/Effects/VignetteRenderer");


const Amaz = effect.Amaz;

const PostProcessType = {
    Bloom: "Bloom",
    Fxaa: "Fxaa",
    SSAO: "SSAO",
    ChromaticAberration: "ChromaticAberration",
    Distort: "Distort",
    Grain: "Grain",
    Vignette: "Vignette",
}

class PostProcessLayer{
    constructor()
    {
        this.name = "PostProcessLayer";
        this.enabled = false;
        this.commands1 = new Amaz.CommandBuffer();
        this.commands2 = new Amaz.CommandBuffer();

        this.maskMaterial = null;

        this.renderContext = new PostProcessRenderContext();

        this.effects = new Map();
    }

    onStart()
    {
        var camera = this.getComponent("Camera");
        if (camera !== null && camera.renderTexture !== null)
        { 
            this.script.addScriptListener(camera, Amaz.CameraEvent.RENDER_IMAGE_EFFECTS, "renderImageEffects", this.script);

            // this.effects[PostProcessType.Bloom] = new BloomRenderer();
            // this.effects[PostProcessType.Fxaa] = new FxaaRenderer();
            // this.effects[PostProcessType.SSAO] = new SSAORenderer();
            // this.effects[PostProcessType.ChromaticAberration] = new ChromaticAberrationRenderer();
            // this.effects[PostProcessType.Distort] = new DistortRenderer();
            // this.effects[PostProcessType.Grain] = new GrainRenderer();
            // this.effects[PostProcessType.Vignette] = new VignetteRenderer();


            this.maskMaterial = Utils.GetStencilMaskedMaterial();

            var colorFormat = Amaz.PixelFormat.RGBA8Unorm;
            if (camera.renderTexture.realColorFormat == Amaz.PixelFormat.RGBA16Sfloat || camera.renderTexture.realColorFormat == Amaz.PixelFormat.RGBA32Sfloat)
            {
                colorFormat = camera.renderTexture.colorFormat;
            }

            this.srcCopy = Utils.CreateRenderTexture("srcCopy", camera.renderTexture.width, camera.renderTexture.height, colorFormat);
            this.commands1.blit(camera.renderTexture, this.srcCopy);

            this.commands1.setRenderTexture(camera.renderTexture);
            this.commands1.clearRenderTexture(true, false, new Amaz.Color(0, 0, 0, 0), 1.0);
            this.commands1.setRenderTexture(this.srcCopy);
            this.commands1.blitWithMaterial(this.srcCopy, camera.renderTexture, this.maskMaterial, 0)

            this.dstCopy = Utils.CreateRenderTexture("dstCopy", camera.renderTexture.width, camera.renderTexture.height, colorFormat);
            this.commands2.blit(camera.renderTexture, this.dstCopy);
            
            this.maskMaterial.setTex("backgroudTexture", this.srcCopy);
            this.commands2.blitWithMaterial(this.dstCopy, camera.renderTexture, this.maskMaterial, 1);

            this.renderContext.setCamera(camera);
            this.renderContext.setSource(camera.renderTexture);
            this.renderContext.setDestination(camera.renderTexture);
            this.renderContext.setScreenWidth(camera.renderTexture.width);
            this.renderContext.setScreenHeight(camera.renderTexture.height);
            
            this.effects[PostProcessType.Bloom] = new BloomRenderer();
            this.effects[PostProcessType.Fxaa] = new FxaaRenderer();
            this.effects[PostProcessType.SSAO] = new SSAORenderer();
            this.effects[PostProcessType.ChromaticAberration] = new ChromaticAberrationRenderer();
            this.effects[PostProcessType.Distort] = new DistortRenderer();
            this.effects[PostProcessType.Grain] = new GrainRenderer();
            this.effects[PostProcessType.Vignette] = new VignetteRenderer();

            this.enabled = true;
        }
    }

    onUpdate(dt)
    {
        if (!this.enabled)
        {
            return;
        }

        var compList = this.entity.getComponents("JSScriptComponent");
        for (var index=0; index < compList.size(); ++index)
        {
            var comp = compList.get(index);
            if (comp.getScript().className == "PostProcessLayer")
            {
                this.effects[PostProcessType.Bloom].update(comp.properties);
                this.effects[PostProcessType.Fxaa].update(comp.properties);
                this.effects[PostProcessType.SSAO].update(comp.properties);
                this.effects[PostProcessType.ChromaticAberration].update(comp.properties);
                this.effects[PostProcessType.Distort].update(comp.properties);
                this.effects[PostProcessType.Grain].update(comp.properties);
                this.effects[PostProcessType.Vignette].update(comp.properties);

            }
        }
    }

    renderImageEffects(sys, camera, eventType)
    {
        if (camera.enabled && this.enabled && eventType == Amaz.CameraEvent.RENDER_IMAGE_EFFECTS)
        {
            camera.entity.scene.commitCommandBuffer(this.commands1);

            this.effects[PostProcessType.Bloom].render(camera.entity.scene, this.renderContext);
            this.effects[PostProcessType.Fxaa].render(camera.entity.scene, this.renderContext);
            this.effects[PostProcessType.SSAO].render(camera.entity.scene, this.renderContext);
            this.effects[PostProcessType.ChromaticAberration].render(camera.entity.scene, this.renderContext);
            this.effects[PostProcessType.Distort].render(camera.entity.scene, this.renderContext);
            this.effects[PostProcessType.Grain].render(camera.entity.scene, this.renderContext);
            this.effects[PostProcessType.Vignette].render(camera.entity.scene, this.renderContext);

            camera.entity.scene.commitCommandBuffer(this.commands2);
        }
    }

    onDestroy()
    {
        var camera = this.getComponent("Camera");
        if (camera !== null)
        {
            this.script.removeScriptListener(camera, Amaz.CameraEvent.RENDER_IMAGE_EFFECTS, "renderImageEffects", this.script);
        }

    }

    onEnable()
    {
        this.enabled = true;
    }

    onDisable()
    {
        this.enabled = false;
    }
}

exports.PostProcessLayer = PostProcessLayer;