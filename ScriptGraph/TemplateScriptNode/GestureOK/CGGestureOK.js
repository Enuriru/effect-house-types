/**
 * @file CGGestureOK.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect OK gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureOK extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.OK;
    this.twoHandGesture = false;
  }
}

exports.CGGestureOK = CGGestureOK;
