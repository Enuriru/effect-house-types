/**
 * @file CGFaceAvatarDrive.js
 * @author Weifeng Huang (huangweifeng.2067@bytedance.com)
 * @date 2021-11-01
 * @brief Face avatar drive node JS script
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceAvatarDrive extends BaseNode {
  constructor() {
    super();
    this.channels = [
      'browDownLeft',
      'browDownRight',
      'browInnerUp',
      'browOuterUpLeft',
      'browOuterUpRight',
      'cheekPuff',
      'cheekSquintLeft',
      'cheekSquintRight',
      'eyeBlinkLeft',
      'eyeBlinkRight',
      'eyeLookDownLeft',
      'eyeLookDownRight',
      'eyeLookInLeft',
      'eyeLookInRight',
      'eyeLookOutLeft',
      'eyeLookOutRight',
      'eyeLookUpLeft',
      'eyeLookUpRight',
      'eyeSquintLeft',
      'eyeSquintRight',
      'eyeWideLeft',
      'eyeWideRight',
      'jawForward',
      'jawLeft',
      'jawOpen',
      'jawRight',
      'mouthClose',
      'mouthDimpleLeft',
      'mouthDimpleRight',
      'mouthFrownLeft',
      'mouthFrownRight',
      'mouthFunnel',
      'mouthLeft',
      'mouthLowerDownLeft',
      'mouthLowerDownRight',
      'mouthPressLeft',
      'mouthPressRight',
      'mouthPucker',
      'mouthRight',
      'mouthRollLower',
      'mouthRollUpper',
      'mouthShrugLower',
      'mouthShrugUpper',
      'mouthSmileLeft',
      'mouthSmileRight',
      'mouthStretchLeft',
      'mouthStretchRight',
      'mouthUpperUpLeft',
      'mouthUpperUpRight',
      'noseSneerLeft',
      'noseSneerRight',
      'tongueOut',
    ];
  }

  execute() {
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const result = algMgr.getAEAlgorithmResult();
    if (result !== null && this.inputs[1] !== undefined && this.inputs[1] !== null) {
      const morpher = this.inputs[1]();
      const naviAvatarDriveInfo = result.getNaviAvatarDriveInfo();
      if (morpher !== null && naviAvatarDriveInfo !== undefined) {
        const weights = morpher.channelWeights;
        const keys = weights.getVectorKeys();
        for (let i = 0; i < keys.size(); ++i) {
          const key = keys.get(i);
          const index = this.channels.findIndex(cn => cn.toLowerCase() === key.toLowerCase());
          if (index >= 0) {
            morpher.setChannelWeight(key, naviAvatarDriveInfo.blendshapeWeights.get(index));
          }
        }
      }
    }
    if (this.nexts[0] !== undefined) {
      this.nexts[0]();
    }
  }
}

exports.CGFaceAvatarDrive = CGFaceAvatarDrive;
