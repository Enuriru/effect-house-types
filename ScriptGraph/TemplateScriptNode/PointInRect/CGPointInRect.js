/**
 * @file CGPointInBox.js
 * @author liujiacheng
 * @date 2021/8/20
 * @brief CGPointInBox.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGPointInRect extends BaseNode {
  constructor() {
    super();
  }

  execute() {
    let rect = this.inputs[1]();
    if (!rect) {
      return;
    }

    let tl_x = rect.x;
    let tl_y = rect.y;
    let bl_x = rect.width + tl_x;
    let bl_y = rect.height + tl_y;

    let pt = this.inputs[2]();
    if (!pt) {
      return;
    }

    if (tl_x <= pt.x && pt.x <= bl_x && tl_y <= pt.y && pt.y <= bl_y) {
      this.nexts[0]();
    } else if (this.nexts[1]) {
      this.nexts[1]();
    }
  }
}

exports.CGPointInRect = CGPointInRect;
