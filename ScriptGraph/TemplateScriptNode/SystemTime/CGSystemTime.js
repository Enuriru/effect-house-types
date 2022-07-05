/**
 * @file CGSystemTime.js
 * @author liujiacheng
 * @date 2021/8/20
 * @brief CGSystemTime.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGSystemTime extends BaseNode {
  constructor() {
    super();
  }

  setNext(index, func) {
    this.nexts[index] = func;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onUpdate(sys, dt) {
    let currentTime = new Date();
    this.outputs[0] = currentTime.getFullYear();
    this.outputs[1] = currentTime.getMonth() + 1;
    this.outputs[2] = currentTime.getDate();
    this.outputs[3] = currentTime.getHours();
    this.outputs[4] = currentTime.getMinutes();
    this.outputs[5] = currentTime.getSeconds();
  }
}

exports.CGSystemTime = CGSystemTime;
