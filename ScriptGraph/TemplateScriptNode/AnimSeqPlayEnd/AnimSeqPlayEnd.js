/**
 * @file AnimSeqPlayEnd.js
 * @author xuyuan
 * @date 2021/11/10
 * @brief AnimSeqPlayEnd.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class AnimSeqPlayEnd extends BaseNode {
  constructor() {
    super();
    this.component = null;
  }

  beforeStart(sys) {
    this.component = this.inputs[0]();
    if (this.component) {
      sys.script.addScriptListener(this.component, Amaz.AnimSeqEventType.ANIMSEQ_END, 'onCallBack', sys.script);
    }
  }

  onCallBack(userData, info, eventType) {
    let animSeqComp = info.animSeqCom;
    if (animSeqComp === null || animSeqComp === undefined) {
      return;
    }
    let guid = animSeqComp.guid;
    if (this.component.guid.eq(guid)) {
      if (eventType === Amaz.AnimSeqEventType.ANIMSEQ_END) {
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      }
    }
  }

  onDestroy(sys) {
    if (this.component) {
      sys.script.removeScriptListener(this.component, Amaz.AnimSeqEventType.ANIMSEQ_END, 'onCallBack', sys.script);
    }
  }
}

exports.AnimSeqPlayEnd = AnimSeqPlayEnd;
