/**
 * @file CGHandDetection.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect hand
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGHandDetection extends BaseNode {
  constructor() {
    super();
    this.lastHandCount = 0;
    this.handDetectTypes = {
      'Single hand': 1,
      'Both hands': 2,
    };
  }

  onUpdate(sys, dt) {
    let type = this.inputs[0]();
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult && type !== null) {
      const num = this.handDetectTypes[type];
      if (num === undefined) {
        return;
      }
      const count = algResult.getHandCount();

      if (this.nexts[0] && count >= num && this.lastHandCount < num) {
        this.nexts[0]();
      }
      if (this.nexts[1] && count >= num) {
        this.nexts[1]();
      }
      if (this.nexts[2] && this.lastHandCount >= num && count < num) {
        this.nexts[2]();
      }
      if (this.nexts[3] && count < num) {
        this.nexts[3]();
      }
      this.lastHandCount = count;
    }
  }
}

exports.CGHandDetection = CGHandDetection;
