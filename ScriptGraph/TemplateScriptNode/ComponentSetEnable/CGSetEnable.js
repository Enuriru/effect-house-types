/**
 * @file CGSetEnable.js
 * @author liujiacheng
 * @date 2021/8/19
 * @brief CGSetEnable.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGSetEnable extends BaseNode {
  constructor() {
    super();
  }

  execute(sys, dt) {
    if (this.inputs[1] !== null && this.inputs[1] !== undefined) {
      let object = this.inputs[1]();
      let enable = this.inputs[2]();

      if (object !== null && object !== undefined && object.isInstanceOf('Component')) {
        if (
          object.isInstanceOf('FaceStretchComponent') ||
          (object.isInstanceOf('JSScriptComponent') && object.path === 'js/LutFilter.js')
        ) {
          let meshRenderer = object.entity.getComponent('MeshRenderer');
          if (meshRenderer !== null && meshRenderer !== undefined) {
            meshRenderer.enabled = enable;
          }
        } else if (object.isInstanceOf('JSScriptComponent') && object.path === 'js/FaceShapeController.js') {
          object.properties.set('isVisible', enable);
        }
        object.enabled = enable;
        this.outputs[1] = enable;
      } else {
        this.outputs[1] = null;
      }
    }

    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }
}

exports.CGSetEnable = CGSetEnable;
