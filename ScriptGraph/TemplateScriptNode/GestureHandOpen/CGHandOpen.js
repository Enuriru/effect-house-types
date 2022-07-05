/**
 * @file CGHandOpen.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect hand open gesture.
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGHandOpen extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.HAND_OPEN;
    this.twoHandGesture = false;
  }
}

exports.CGHandOpen = CGHandOpen;
