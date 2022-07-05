/**
 * @file CGGestureHoldFace.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect hold face gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureHoldFace extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.HOLDFACE;
    this.twoHandGesture = true;
  }
}

exports.CGGestureHoldFace = CGGestureHoldFace;
