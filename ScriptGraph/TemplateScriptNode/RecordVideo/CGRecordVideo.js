/**
 * @file CGRecordVideo.js
 * @author liujiacheng
 * @date 2021/8/23
 * @brief CGRecordVideo.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGRecordVideo extends BaseNode {
  constructor() {
    super();
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onEvent(sys, event) {
    if (event.type === Amaz.AppEventType.COMPAT_BEF) {
      let eventResult = event.args.get(0);
      if (eventResult === Amaz.BEFEventType.BET_RECORD_VIDEO) {
        let eventResult2 = event.args.get(1);
        if (eventResult2 == 1) {
          if (this.nexts[0]) {
            this.nexts[0]();
          }
        }
      }
    }
  }
}

exports.CGRecordVideo = CGRecordVideo;
