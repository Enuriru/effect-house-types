const { Utils } = require("PostProcessing/Base/Utils");
const { PostProcessBaseRenderer } = require("PostProcessing/Runtime/Effects/PostProcessBaseRenderer")
const Amaz = effect.Amaz;
// uniform names

const u_Time = "u_Time"
const u_barrelPower = "u_barrelPower"
const u_rotation = "u_rotation"
const u_zoom = "u_zoom"
const u_maskTiles = "u_maskTiles"

const u_amplitude = "u_amplitude"
const u_frequency = "u_frequency"
const u_speed = "u_speed"
const u_offset = "u_offset"

//I'm not sure how to set these
//u_image;
//u_maskA;


// pass ids
const DistortPass = 0

class DistortRenderer extends PostProcessBaseRenderer{
    constructor()
    {
        super();
        this.commands = new Amaz.CommandBuffer();

        this.setRendererProperty("pDistortEnable", false, true);
        this.setRendererProperty("pDistortBarrelPower", 0.00);
        this.setRendererProperty("pDistortRotation", 0.00);
        this.setRendererProperty("pDistortZoom", 0.00);
        this.setRendererProperty("pDistortMaskTiles", 1.00);
        this.setRendererProperty("pDistortAmplitude", new Amaz.Vector2f(0.0, 0.0));
        this.setRendererProperty("pDistortFrequency", new Amaz.Vector2f(0.0, 0.0));
        this.setRendererProperty("pDistortSpeed", new Amaz.Vector2f(0.0, 0.0));
        this.setRendererProperty("pDistortOffset", new Amaz.Vector2f(0.0, 0.0)  ); 
    }

    update(properties)
    {
        this.updateProperties(properties);
    }

    render(scene,postProcessContext)
    {
        //  if (postProcessContext  === null){
        //     return
        //  }
        var enable = this.settings.get("pDistortEnable")
        var barrelPower = this.settings.get("pDistortBarrelPower")
        var rotation = this.settings.get("pDistortRotation")
        var zoom = this.settings.get("pDistortZoom")
        var maskTiles = this.settings.get("pDistortMaskTiles")
        var amplitude = this.settings.get("pDistortAmplitude")
        var frequency = this.settings.get("pDistortFrequency")
        var speed = this.settings.get("pDistortSpeed")
        var offset = this.settings.get("pDistortOffset")

        var width = postProcessContext.getScreenWidth()
        var height = postProcessContext.getScreenHeight()

        // clamp speed.xy to [-999, 999], to avoid accuracy issues.
        speed.set(Math.max(Math.min(speed.x, 999), -999), Math.max(Math.min(speed.y, 999), -999))

        if (enable)
        {
            var DistortMat = postProcessContext.getResources().getShaders("Distort").getMaterial()

            // Set Distort uniform
            DistortMat.setFloat(u_barrelPower, barrelPower)
            DistortMat.setFloat(u_rotation, rotation)
            DistortMat.setFloat(u_zoom, zoom)
            DistortMat.setFloat(u_maskTiles, maskTiles)
            DistortMat.setVec2(u_amplitude, amplitude)
            DistortMat.setVec2(u_frequency, frequency)
            DistortMat.setVec2(u_speed, speed)
            DistortMat.setVec2(u_offset, offset)

            if (this.dirty)
            {
                var w = width
                var h = height
                var src = postProcessContext.getSource()
                var dst = postProcessContext.getDestination()
                if (src.image === dst.image)
                {
                    var pingpong = Utils.CreateRenderTexture("", width, height)
                    this.commands.blitWithMaterial(src, pingpong, DistortMat, DistortPass)
                    this.commands.blit(pingpong, dst)
                }else{
                    this.commands.blitWithMaterial(src, dst, DistortMat, DistortPass)
                }
                this.dirty = false
            }
        }else{
            if (this.dirty)
            {
                this.commands.clearAll()
                this.dirty = false
                // to do, if (src ~= dst, copy src to dst
            }
        }
        //}

        var cam = postProcessContext.getCamera()
        cam.entity.scene.commitCommandBuffer(this.commands)
    }
}

exports.DistortRenderer = DistortRenderer;