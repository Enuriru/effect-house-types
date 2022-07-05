/**
 * @file CGScreenLongTap.js
 * @author
 * @date 2021/8/15
 * @brief CGScreenLongTap.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGScreenLongTap extends BaseNode {
  constructor() {
    super();
    this.outputs[1] = null;
    this.outputs[2] = null;
  }

  onCallBack(sys, userData, eventType) {
    if (eventType != Amaz.InputListener.ON_GESTURE_LONG_TAP) {
      return;
    }
    if (userData != null) {
      this.outputs[1] = userData.duration;
      this.outputs[2] = new Amaz.Vector2f(userData.x, userData.y);
      if (this.nexts[0]) {
        this.nexts[0]();
      }
    }
  }

  beforeStart(sys) {
    if (!this.haveRegisterListener) {
      Amaz.AmazingManager.getSingleton('Input').addScriptListener(
          sys.script,
          Amaz.InputListener.ON_GESTURE_LONG_TAP,
          'onCallBack',
          sys.script
      );
      this.__proto__.haveRegisterListener = true;
    }
  }

  onStart(sys) {
  }

  onComponentRemoved(sys, comp) {

  }

  onDestroy(sys) {
    Amaz.AmazingManager.getSingleton('Input').removeScriptListener(
        sys.script,
        Amaz.InputListener.ON_GESTURE_LONG_TAP,
        'onCallBack',
        sys.script
    );
    this.__proto__.haveRegisterListener = false;
  }
}

exports.CGScreenLongTap = CGScreenLongTap;
