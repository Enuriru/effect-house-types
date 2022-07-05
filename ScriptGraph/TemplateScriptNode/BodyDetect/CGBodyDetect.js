/**
 * @file CGBodyDetect.js
 * @author Weifeng Huang (huangweifeng.2067@bytedance.com)
 * @date 2021-09-09
 * @brief bodyDetect node JS script
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGBodyDetect extends BaseNode {
  constructor() {
    super();
    this.detected = false;
  }

  onUpdate(sys, dt) {
    if (this.nexts[0] === undefined && this.nexts[1] === undefined && this.nexts[2] === undefined && this.nexts[3] === undefined) {
      return;
    }
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();
    if (algResult !== null) {
      const count = algResult.getAvatar3DInfoCount();
      const avatar3d = algResult.getAvatar3DInfo();
      if (count > 0 && avatar3d.detected && !this.detected) {
        this.detected = true;
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      } else if (count > 0 && avatar3d.detected && this.detected) {
        this.detected = true;
        if (this.nexts[1]) {
          this.nexts[1]();
        }
      } else if ((count === 0 || !avatar3d.detected) && this.detected) {
        this.detected = false;
        if (this.nexts[2]) {
          this.nexts[2]();
        }
      } else if ((count === 0 || !avatar3d.detected) && !this.detected) {
        this.detected = false;
        if (this.nexts[3]) {
          this.nexts[3]();
        }
      }
    }
  }
}

exports.CGBodyDetect = CGBodyDetect;
