/**
 * @file CGIndexFingerUp.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect index finger up gesture
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGIndexFingerUp extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.INDEX_FINGER_UP;
    this.twoHandGesture = false;
  }
}

exports.CGIndexFingerUp = CGIndexFingerUp;
