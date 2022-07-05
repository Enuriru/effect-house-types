/**
 * @file CGPalmUp.js
 * @author liujiacheng
 * @date 2021/8/18
 * @brief CGPalmUp.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGPalmUp extends BaseNode {
  constructor() {
    super();
    this.handAction = '';
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onUpdate(sys, dt) {
    let v1 = this.inputs[0]();

    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult && v1 != null) {
      const hand = algResult.getHandInfo(v1);
      if (hand == undefined || hand == null) {
        return;
      }

      const has_action = hand.action == Amaz.HandAction.PLAM_UP;
      if (has_action && this.handAction != 'PULM_UP') {
        this.handAction = 'PULM_UP';
        console.log('detect palm up!');
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      } else if (!has_action && this.handAction == 'PULM_UP') {
        this.handAction = '';
        if (this.nexts[1]) {
          this.nexts[1]();
        }
      }
    }
  }
}

exports.CGPalmUp = CGPalmUp;
