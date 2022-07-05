const { Utils } = require("PostProcessing/Base/Utils");
const { PostProcessBaseRenderer } = require("PostProcessing/Runtime/Effects/PostProcessBaseRenderer");
const Amaz = effect.Amaz;

// uniform names
const u_textureSize = "u_texture_size"

// pass ids
const FxaaPass = 0

class FxaaRenderer extends PostProcessBaseRenderer{
    constructor()
    {
        super();
        this.commands = new Amaz.CommandBuffer();

        this.setRendererProperty("pFxaaFastMode", 1);
        this.setRendererProperty("pFxaaKeepAlpha", 1);
        this.setRendererProperty("pFxaaEnable", false, true);
    }

    update(properties)
    {
        this.updateProperties(properties);
    }

    render(scene, postProcessContext)
    {
        var enable = this.settings.get("pFxaaEnable");
        var width = postProcessContext.getScreenWidth();
        var height = postProcessContext.getScreenHeight();

        if ( enable )
        {
            var w = width;
            var h = height;
            var src = postProcessContext.getSource();
            var dst = postProcessContext.getDestination();
            var fxaaMat = postProcessContext.getResources().getShaders("Fxaa").getMaterial();
            
            fxaaMat.setVec2(u_textureSize, new Amaz.Vector2f(width, height));

            if ( this.dirty )
            {
                if ( src.image === dst.image )
                {
                    var pingpong = Utils.CreateRenderTexture("", w, h);
                    this.commands.blitWithMaterial(src, pingpong, fxaaMat, FxaaPass);
                    this.commands.blit(pingpong, dst);
                }else{
                    this.commands.blitWithMaterial(src, dst, fxaaMat, FxaaPass);
                }            
                this.dirty = false;
            }    
        }
        else if ( this.dirty )
        {
            this.commands.clearAll();
            this.dirty = false;
        }
        var cam = postProcessContext.getCamera();
        cam.entity.scene.commitCommandBuffer(this.commands);
    }
}

exports.FxaaRenderer = FxaaRenderer;