/**
 * @file CGEntitySetVisible.js
 * @author liujiacheng
 * @date 2021/8/20
 * @brief CGEntitySetVisible.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGEntitySetVisible extends BaseNode {
  constructor() {
    super();
  }

  execute(sys, dt) {
    if (this.inputs[1] !== null && this.inputs[1] !== undefined) {
      let object = this.inputs[1]();
      let visible = this.inputs[2]();

      if (object !== null && object !== undefined && object.isInstanceOf('Entity')) {
        if (true === visible) {
          object.visible = visible;
          this.updateScriptComponentRecursively(object, visible);
        } else {
          this.updateScriptComponentRecursively(object, visible);
          object.visible = visible;
        }
        this.outputs[1] = visible;
      } else {
        this.outputs[1] = null;
      }
    }
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }

  updateScriptComponentRecursively(entity, enable) {
    const jsComps = entity.getComponents("JSScriptComponent");
    const luaComps = entity.getComponents("ScriptComponent");
    if (jsComps && jsComps.size()>0) {
      for (let i = 0; i<jsComps.size(); i++) {
        jsComps.get(i).enabled = enable;
      }
    }
    if (luaComps && luaComps.size()>0) {
      for (let i = 0; i<luaComps.size(); i++) {
        luaComps.get(i).enabled = enable;
      }
    }
    const transform = entity.getComponent("Transform");
    if (transform && transform.isInstanceOf('Transform')) {
      const childrens = transform.children;
      for (let i = 0; i<childrens.size(); i++) {
        if (childrens.get(i).entity.isInstanceOf('Entity')) {
          this.updateScriptComponentRecursively(childrens.get(i).entity, enable);
        }
      }
    }
  }
}

exports.CGEntitySetVisible = CGEntitySetVisible;
