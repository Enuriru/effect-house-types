const { Utils } = require("PostProcessing/Base/Utils");
const { PostProcessBaseRenderer } = require("PostProcessing/Runtime/Effects/PostProcessBaseRenderer");
const Amaz = effect.Amaz;

class ChromaticAberrationRenderer extends PostProcessBaseRenderer{
    constructor()
    {
        super();
        this.commands = new Amaz.CommandBuffer();

        this.chromaticAberrationSpectralLut = null; // CreateLUT(3, 1);
        this.pingPongRT = null;
        this.fastModeAndIntensityAndRTSize = new Amaz.Vector4f(0.0, 0.0, 1.0, 1.0);
    
        this.setRendererProperty("pChromaticAberrationEnable", false, true);
        this.setRendererProperty("pFastChromaticAberration", false);
        this.setRendererProperty("pChromaticAberrationIntensity", 0.7);
        this.setRendererProperty("pSpectralLut", null, true);
    }

    update(properties)
    {
        this.updateProperties(properties);
    }

    render(scene, postProcessContext)
    {
        var enable = this.settings.get("pChromaticAberrationEnable");
        var width = postProcessContext.getScreenWidth();
        var height = postProcessContext.getScreenHeight();

        // var scene = postProcessContext.getCamera().entity.scene;


        var src = postProcessContext.getSource();
        var dst = postProcessContext.getDestination();

        if ( this.pingPongRT === null ){
            this.pingPongRT = Utils.CreateRenderTexture("", width, height);
        }

        if ( this.settings.get("pFastChromaticAberration") !== null ){
            this.fastModeAndIntensityAndRTSize.x = this.settings.get("pFastChromaticAberration") && 1.0 || 0.0;
        }

        if ( this.settings.get("pChromaticAberrationIntensity") !== null ){
            this.fastModeAndIntensityAndRTSize.y = this.settings.get("pChromaticAberrationIntensity") * 0.05;
        }

        this.fastModeAndIntensityAndRTSize.z = width;
        this.fastModeAndIntensityAndRTSize.w = height;

        if ( enable )
        {
            var material = postProcessContext.getResources().getShaders("ChromaticAberration").getMaterial();

            material.setVec4("u_FastModeAndIntensityAndRTSize", this.fastModeAndIntensityAndRTSize);

            if ( this.dirty )
            {
                this.commands.clearAll();

                if ( this.settings.get("pSpectralLut") === null || this.settings.get("pSpectralLut") === 'None')
                {
                    if ( this.chromaticAberrationSpectralLut === null )
                    {
                        this.chromaticAberrationSpectralLut = Utils.CreateLUT(3, 1);
                        this.commands.blitWithMaterial(src, this.chromaticAberrationSpectralLut, material, 0);
                    }
                    material.setTex("u_SpectralLUT", this.chromaticAberrationSpectralLut);
                }else{
                    material.setTex("u_SpectralLUT", this.settings.get("pSpectralLut"));
                }
                this.commands.blitWithMaterial(src, this.pingPongRT, material, 1);

                // this.commands.blit(scene.getOutputRenderTexture(), src);
                // material.setTex("_Background", src);

                // this.commands.blitWithMaterial(this.pingPongRT, scene.getOutputRenderTexture(), material, 2);
                
                
                ////////////-
                
                this.commands.blit(this.pingPongRT, dst);

                this.dirty = false;
            }       
        }else{
            if ( this.dirty )
            {
                this.commands.clearAll();

                //     this.commands.blit(scene.getOutputRenderTexture(), this.pingPongRT);
                //     material.setTex("_Background", this.pingPongRT);
                //     this.commands.blitWithMaterial(src, scene.getOutputRenderTexture(), material, 2);

                this.dirty = false;
            }
        }

        scene.commitCommandBuffer(this.commands)
    }
}

exports.ChromaticAberrationRenderer = ChromaticAberrationRenderer;