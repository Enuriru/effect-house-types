/**
 * @file CGGestureHeardB.js
 * @author Weifeng
 * @date 2021-12-30
 * @brief Detect beg gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureHeartB extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.HEART_B;
    this.twoHandGesture = true;
  }
}

exports.CGGestureHeartB = CGGestureHeartB;
