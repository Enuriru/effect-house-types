/**
 * @file CGFaceAvatarResult.js
 * @author Weifeng Huang (huangweifeng.2067@bytedance.com)
 * @date 2021-11-01
 * @brief Face avatar result node JS script
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceAvatarResultEyebrows extends BaseNode {
  constructor() {
    super();
    this.channels = {
      browDownLeft: 0,
      browDownRight: 1,
      browInnerUp: 2,
      browOuterUpLeft: 3,
      browOuterUpRight: 4,
    };
  }

  execute() {
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const result = algMgr.getAEAlgorithmResult();
    if (result !== null && this.inputs[1] !== undefined && this.inputs[1] !== null) {
      const channel = this.inputs[1]();
      const naviAvatarDriveInfo = result.getNaviAvatarDriveInfo();
      if (channel !== null && naviAvatarDriveInfo !== undefined) {
        if (this.channels[channel] !== undefined) {
          const channelIndex = this.channels[channel];
          this.outputs[1] = naviAvatarDriveInfo.blendshapeWeights.get(channelIndex);
        } else {
          this.outputs[1] = null;
        }
      }
    }
    if (this.nexts[0] !== undefined) {
      this.nexts[0]();
    }
  }
}

exports.CGFaceAvatarResultEyebrows = CGFaceAvatarResultEyebrows;
