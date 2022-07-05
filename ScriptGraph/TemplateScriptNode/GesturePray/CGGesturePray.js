/**
 * @file CGGesturePray.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect pray gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGesturePray extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.PRAY;
    this.twoHandGesture = true;
  }
}

exports.CGGesturePray = CGGesturePray;
