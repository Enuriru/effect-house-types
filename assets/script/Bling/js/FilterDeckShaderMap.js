'use strict';


const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();
const Utils = require('./utils').Utils;

const {KIRA_COMMON_VS, KIRA_SPRITE_FS} = require('./FilterDeckGLShader');

const {KIRA_COMMON_METAL_VS, KIRA_SPRITE_METAL_FS} = require('./FilterDeckMetalShader');

const filterDeckShaderMap  = new Amaz.Map();
Utils.addShaderToMap(filterDeckShaderMap, 'gles2', KIRA_COMMON_VS, KIRA_SPRITE_FS);
Utils.addShaderToMap(filterDeckShaderMap, 'metal', KIRA_COMMON_METAL_VS, KIRA_SPRITE_METAL_FS);
exports.filterDeckShaderMap = filterDeckShaderMap