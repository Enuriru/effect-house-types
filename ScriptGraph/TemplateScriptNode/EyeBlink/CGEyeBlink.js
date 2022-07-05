/**
 * @file CGEyeBlink.js
 * @author liujiacheng
 * @date 2021/8/19
 * @brief CGEyeBlink.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGEyeBlink extends BaseNode {
  constructor() {
    super();
    this.actionDetected = false;
    this.eyeMap = {
      Left: Amaz.FaceAction.EYE_BLINK_LEFT,
      Right: Amaz.FaceAction.EYE_BLINK_RIGHT,
      Both: Amaz.FaceAction.EYE_BLINK,
    };
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onUpdate(sys, dt) {
    let faceIdx = this.inputs[0]();
    let eyeAction = this.eyeMap[this.inputs[1]()];

    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult !== null && faceIdx !== null && eyeAction !== undefined) {
      const face = algResult.getFaceBaseInfo(Math.round(faceIdx));
      if (face === undefined || face === null) {
        console.error("Get face info failed!")
        return;
      }
      const has_action = face.hasAction(eyeAction);
      if (has_action && !this.actionDetected) {
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      } else if (has_action && this.actionDetected) {
        if (this.nexts[1]) {
          this.nexts[1]();
        }
      } else if (!has_action && this.actionDetected) {
        if (this.nexts[2]) {
          this.nexts[2]();
        }
      } else {
        if (this.nexts[3]) {
          this.nexts[3]();
        }
      }
      this.actionDetected = has_action;
    }
  }
}

exports.CGEyeBlink = CGEyeBlink;
