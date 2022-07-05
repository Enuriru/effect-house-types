// This is a template js script includes common callbacks including onStart() and onUpdate()
// Script life cycle is explained here: https://bytedance.feishu.cn/wiki/wikcnABVkWxGUsmqGEETTvkE1Qh

'use strict';
const Amaz = effect.Amaz; // for RTTI API
const amg = require('./amg.cjs.development'); // for JS wrapper API
// The above file is required to use Amazing JS wrapper api 
// Wiki link: https://bytedance.feishu.cn/wiki/wikcn7esxLiFVdzraHwMtU019rc
// JS wrapper has been used in many effect house features such as Bling, 3dFaceShape, FullbodyAvatar
// For Bling, see filterDeck.js on how to use filter system
// For 3dFaceShape, see FaceShapeController.js and FaceAssetSysController.js on how to use Head wrapper
// For FullbodyAvatar, see FullBodyAvatarSystem.js and FullBodyAvatarDrive.js on how to use body3d wrapper

class ComponentScript {
  constructor() {
    this.name = "ComponentScript";
  }
  onEnable(){}

  onStart() {
    // Use console.warn() to print log msg in debug console. console.log() won't work in orion
    console.warn('onStart()')
    
    // Below is RTTI api examples to help you get started. Same as what lua uses.
    // API website: https://amazinglua.web.bytedance.net/

    // Get mesh renderer component and set material proerties
    const meshRenderer = this.entity.getComponent("MeshRenderer");
    const color = new Amaz.Vector4f(1, 0, 0, 1);
    // Assume u_texColor uniform is defined...
    meshRenderer.material.setVec4("u_texColor", color);

    // Get JS script component and access the "properties" field
    const propertiesMap = this.entity.getComponent("JSScriptComponent").properties;

    // Find first camera entity in the scene and get the camera component
    const camera = this.entity.scene.findEntityBy('Camera').getComponent('Camera');

    // Get parent entity
    const transform = this.entity.getComponent("Transform");
    const parentTransform = transform.parent;
    const parent = parentTransform.entity;

    // Get children entities
    const childrenTransforms = transform.children;
    for (let i = 0; i < childrenTransforms.size(); i++) {
      console.warn(childrenTransforms.get(i).entity.name);
    }
  }

  onUpdate(deltaTime) {}

  onLateUpdate(deltaTime) {}

  onEvent(event) {}

  onDisable() {}

  onDestroy() {}
}

exports.ComponentScript = ComponentScript;
