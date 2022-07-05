/**
 * @file CGGestureFistBow.js
 * @author Weifeng
 * @date 2021-12-30
 * @brief Detect fist bow gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureFistBow extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.THANKS;
    this.twoHandGesture = true;
  }
}

exports.CGGestureFistBow = CGGestureFistBow;
