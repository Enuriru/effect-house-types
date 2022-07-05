/**
 * @file CGScreenPan.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGScreenPan.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGScreenPan extends BaseNode {
  constructor() {
    super();
    this.startPoint = new Amaz.Vector2f(0, 0);
  }

  beforeStart(sys) {
      Amaz.AmazingManager.getSingleton('Input').addScriptListener(
        sys.script,
        Amaz.InputListener.ON_GESTURE_DRAG,
        'onCallBack',
        sys.script
      );
  }

  onStart(sys) {}

  onComponentRemoved(sys, comp) {}

  onDestroy(sys) {
    Amaz.AmazingManager.getSingleton('Input').removeScriptListener(
      sys.script,
      Amaz.InputListener.ON_GESTURE_DRAG,
      'onCallBack',
      sys.script
    );
  }

  onEvent(sys, event) {
    if (event.type === Amaz.EventType.TOUCH) {
      const touch = event.args.get(0);
      if (touch.type === Amaz.TouchType.TOUCH_BEGAN) {
        this.startPoint = new Amaz.Vector2f(touch.x, touch.y);
      }
    }
  }

  onCallBack(userData, sender, eventType) {
    if (eventType !== Amaz.InputListener.ON_GESTURE_DRAG) {
      return;
    }

    if (sender !== null) {
      this.outputs[1] = new Amaz.Vector2f(sender.x - this.startPoint.x, this.startPoint.y - sender.y);
      this.outputs[2] = new Amaz.Vector2f(sender.x, 1.0 - sender.y);
      if (this.nexts[0]) {
        this.nexts[0]();
      }
    }
  }
}

exports.CGScreenPan = CGScreenPan;
