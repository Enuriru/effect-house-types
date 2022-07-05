/**
 * @file CGThumbDown.js
 * @author liujiacheng
 * @date 2021/8/18
 * @brief CGThumbDown.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
class CGThumbDown {
  constructor() {
    this.inputs = {};
    this.nexts = {};
    this.handAction = '';
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onUpdate(sys, dt) {
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult) {
      const hand = algResult.getHandInfo(0);
      if (hand == undefined || hand == null) {
        return;
      }

      const has_action = hand.action === Amaz.HandAction.THUMB_DOWN;
      if (has_action) {
        console.log('detect thumb down!');
      }
    }
  }
}

exports.CGThumbDown = CGThumbDown;
