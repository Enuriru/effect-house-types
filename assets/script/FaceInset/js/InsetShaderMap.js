'use strict';


const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();

const {InsetShaders_GLSL} = require('InsetGLSLShaders');
const {InsetShaders_Metal} = require('InsetMetalShaders');


const addShaderToMap = function(shaderMap, backend, vert, frag){
    let vs = new Amaz.Shader()
    vs.type = Amaz.ShaderType.VERTEX
    vs.source = vert

    let fs = new Amaz.Shader()
    fs.type = Amaz.ShaderType.FRAGMENT
    fs.source = frag
    
    let shaderVec = new Amaz.Vector()
    
    shaderVec.pushBack(vs)
    shaderVec.pushBack(fs)

    shaderMap.insert(backend, shaderVec)
}
const SHADERNAME = {
    "alpha":0,
    "hBlur":1,
    "vBlur":2,
    "world":3
}

const shadersMap = new Map([
    [SHADERNAME.alpha, new Map(
        [
            ["gles2", {vs:InsetShaders_GLSL.MaskBuilder.VS, fs:InsetShaders_GLSL.MaskBuilder.FS}],
            ["metal", {vs:InsetShaders_Metal.MaskBuilder.VS, fs:InsetShaders_Metal.MaskBuilder.FS}]
        ]
    )],
    [SHADERNAME.vBlur, new Map(
        [
            ["gles2", {vs:InsetShaders_GLSL.Blur.VS, fs:InsetShaders_GLSL.Blur.FS_VERTICAL}],
            ["metal", {vs:InsetShaders_Metal.Blur.VS, fs:InsetShaders_Metal.Blur.FS_VERTICAL}]
        ]
    )],
    [SHADERNAME.hBlur, new Map(
        [
            ["gles2", {vs:InsetShaders_GLSL.Blur.VS, fs:InsetShaders_GLSL.Blur.FS_HORIZONTAL}],
            ["metal", {vs:InsetShaders_Metal.Blur.VS, fs:InsetShaders_Metal.Blur.FS_HORIZONTAL}]
        ]
    )],
    [SHADERNAME.world, new Map(
        [
            ["gles2", {vs:InsetShaders_GLSL.World.VS, fs:InsetShaders_GLSL.World.FS}],
            ["metal", {vs:InsetShaders_Metal.World.VS, fs:InsetShaders_Metal.World.FS}]
        ]
    )]
    ]
    );

const getShaderMap = function(macro, shadername){
    const result = new Amaz.Map();
    const shaderMap =  shadersMap.get(shadername);
    addShaderToMap(result, "gles2", macro + shaderMap.get("gles2").vs,  macro + shaderMap.get("gles2").fs);
    addShaderToMap(result, "metal", macro + shaderMap.get("metal").vs,  macro + shaderMap.get("metal").fs)
    return result;
}


exports.getShaderMap = getShaderMap;
exports.SHADERNAME = SHADERNAME;