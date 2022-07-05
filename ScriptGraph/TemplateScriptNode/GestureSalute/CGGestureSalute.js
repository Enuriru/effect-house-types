/**
 * @file CGGestureSalute.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect salute gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureSalute extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.SALUTE;
    this.twoHandGesture = false;
  }
}

exports.CGGestureSalute = CGGestureSalute;
