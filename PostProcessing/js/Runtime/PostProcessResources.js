const { BloomShader } = require("PostProcessing/Shaders/BloomShader");
const { FxaaShader } = require("PostProcessing/Shaders/FxaaShader");
const { SSAOShader } = require("PostProcessing/Shaders/SSAOShader");
const { ChromaticAberrationShader } = require("PostProcessing/Shaders/ChromaticAberrationShader");
const { DistortShader } = require("PostProcessing/Shaders/DistortShader");
const { GrainShader } = require("PostProcessing/Shaders/GrainShader");
const { VignetteShader } = require("PostProcessing/Shaders/VignetteShader");


const Amaz = effect.Amaz;

class PostProcessResources{
    constructor()
    {
        this.shaders = new Map();
        this.textures = new Map();

        this.shaders["Bloom"] = new BloomShader();
        this.shaders["Fxaa"] = new FxaaShader();
        this.shaders["SSAO"] = new SSAOShader();
        this.shaders["ChromaticAberration"] = new ChromaticAberrationShader();
        this.shaders["Distort"] = new DistortShader();
        this.shaders["Grain"] = new GrainShader();
        this.shaders["Vignette"] = new VignetteShader();

    }

    setTextureByName(name, texture)
    {
        this.textures[name] = texture
    }

    getTextureByName(name)
    {
        return this.textures[name]
    }

    getShaders(name)
    {
        return this.shaders[name];
    }
}

exports.PostProcessResources = PostProcessResources;