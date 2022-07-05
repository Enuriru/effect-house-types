/**
 * @file CGThree.js
 * @author liujiacheng
 * @date 2021/8/17
 * @brief CGThree.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
class CGThree {
  constructor() {
    this.inputs = {};
    this.nexts = {};
    this.faceAction = '';
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
      if (hand === undefined || hand === null) {
        return;
      }

      const has_action = hand.action === Amaz.HandAction.THREE;
      if (has_action) {
        console.log('detect hand three!');
      }
    }
  }
}

exports.CGThree = CGThree;
