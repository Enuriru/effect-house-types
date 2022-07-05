/**
 * @file CGFaceAvatarResult.js
 * @author Weifeng Huang (huangweifeng.2067@bytedance.com)
 * @date 2021-11-01
 * @brief Face avatar result node JS script
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceAvatarResultEye extends BaseNode {
  constructor() {
    super();
    this.channels = {
      eyeBlinkLeft: 8,
      eyeBlinkRight: 9,
      eyeLookDownLeft: 10,
      eyeLookDownRight: 11,
      eyeLookInLeft: 12,
      eyeLookInRight: 13,
      eyeLookOutLeft: 14,
      eyeLookOutRight: 15,
      eyeLookUpLeft: 16,
      eyeLookUpRight: 17,
      eyeSquintLeft: 18,
      eyeSquintRight: 19,
      eyeWideLeft: 20,
      eyeWideRight: 21,
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

exports.CGFaceAvatarResultEye = CGFaceAvatarResultEye;
