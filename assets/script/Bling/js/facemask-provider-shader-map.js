'use strict';


const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();
const Utils = require('./utils').Utils;

const {faceVS, faceFS}= require('./facemask-provider-gl-shader');

const {faceMetalVS, faceMetalFS} = require('./facemask-provider-metal-shader');

const faceMaskShaderMap = new Amaz.Map();
Utils.addShaderToMap(faceMaskShaderMap, 'gles2', faceVS, faceFS);
Utils.addShaderToMap(faceMaskShaderMap, 'metal', faceMetalVS, faceMetalFS);

exports.faceMaskShaderMap = faceMaskShaderMap