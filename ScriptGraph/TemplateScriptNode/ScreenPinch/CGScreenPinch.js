/**
 * @file CGScreenPinch.js
 * @author xuyuan
 * @date 2021/10/21
 * @brief CGScreenPinch.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGScreenPinch extends BaseNode {
  constructor() {
    super();
    this.scale = 1.0;
  }

  getOutput(index) {
    return this.scale;
  }

  onEvent(sys, event) {
    if (event.type === Amaz.EventType.TOUCH_MANIPULATE) {
      if (event.args.get(0) === 6) {
        let delta_scale = event.args.get(1);
        if (delta_scale) {
          this.scale = this.scale + (delta_scale - 1.0);
          if (this.scale < 0) {
            this.scale = 0;
          }
          if (this.nexts[0]) {
            this.nexts[0]();
          }
        }
      }
    }
  }
}

exports.CGScreenPinch = CGScreenPinch;
