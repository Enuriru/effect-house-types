/**
 * @file CGGestureVow.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect vow gesture.
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureVow extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.SWEAR;
    this.twoHandGesture = false;
  }
}

exports.CGGestureVow = CGGestureVow;
