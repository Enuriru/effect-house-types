/**
 * @file CGCustomPan.js
 * @author enuriru
 * @date 2021/8/23
 * @brief CGCustomPan.js
 * @copyright Copyright (c) 2021, Denis Rossiev
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGCustomPan extends BaseNode {
  constructor() {
    super();

    this.start = new Amaz.Vector2f(0, 0);
    this.offset = new Amaz.Vector2f(0, 0);
    this.currentOffset = new Amaz.Vector2f(0, 0);
    this.currentPosition = new Amaz.Vector2f(0, 0);

  }


  beforeStart(sys) {
    if (!this.haveRegisterListener) {
      Amaz.AmazingManager.getSingleton('Input').addScriptListener(
        sys.script,
        Amaz.InputListener.ON_GESTURE_DRAG,
        'onCallBack',
        sys.script
      );
      this.__proto__.haveRegisterListener = true;
    }
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
    this.__proto__.haveRegisterListener = false;
  }


  onEvent(sys, event) {

   

    if (event.type === Amaz.EventType.TOUCH) {
      const touch = event.args.get(0);

      this.outputs[4] = touch.type;
      //0 - start
      //1 - move
      // 3 - end

      if (touch.type === Amaz.TouchType.TOUCH_BEGAN) {
        this.offset = new Amaz.Vector2f(this.offset.x + this.currentOffset.x, this.offset.y + this.currentOffset.y);
        this.start = new Amaz.Vector2f(touch.x, touch.y);
      }
      
    }
  }

  onCallBack(userData, sender, eventType) {

    if (eventType !== Amaz.InputListener.ON_GESTURE_DRAG) {
      return;
    }

    if (sender !== null) {

      this.currentOffset = new Amaz.Vector2f(sender.x - this.start.x, sender.y - this.start.y);
      this.currentPosition = new Amaz.Vector2f(sender.x, sender.y);

      this.outputs[1] = this.currentOffset;
      this.outputs[2] = this.currentPosition;
      this.outputs[3] = new Amaz.Vector2f(this.offset.x + this.currentOffset.x, this.offset.y + this.currentOffset.y);

      if (this.nexts[0]) {
        this.nexts[0]();
      }

    }
  }
}

exports.CGCustomPan = CGCustomPan;
