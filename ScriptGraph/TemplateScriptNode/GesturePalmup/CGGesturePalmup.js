/**
 * @file CGGesturePalmup.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect palm up gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGesturePalmup extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.PLAM_UP;
    this.twoHandGesture = false;
  }
}

exports.CGGesturePalmup = CGGesturePalmup;
