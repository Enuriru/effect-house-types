const { PostProcessResources } = require("PostProcessing/Runtime/PostProcessResources");

const Amaz = effect.Amaz;

class PostProcessRenderContext{
    constructor()
    {
        this.camera = null;
        this.source = null;
        this.destination = null;
        this.commands = null;
        this.width = 720;
        this.height = 1280;
        this.resources = new PostProcessResources();
    }

    getResources()
    {
        return this.resources;
    }

    setCamera(camera)
    {
        this.camera = camera;
    }

    getCamera()
    {
        return this.camera;
    }

    setSource(renderTexture)
    {
        this.source = renderTexture;
    }

    getSource()
    {
        return this.source;
    }

    setDestination(renderTexture)
    {
        this.destination = renderTexture;
    }

    getDestination()
    {
        return this.destination;
    }

    setScreenWidth(width)
    {
        this.width = width;
    }

    getScreenWidth()
    {
        return this.width;
    }

    setScreenHeight(height)
    {
        this.height = height;
    }

    getScreenHeight()
    {
        return this.height;
    }

    setCommandBuffer(commands)
    {
        this.commands = commands;
    }

    getCommandBuffer()
    {
        return this.commands;
    }
}

exports.PostProcessRenderContext = PostProcessRenderContext;