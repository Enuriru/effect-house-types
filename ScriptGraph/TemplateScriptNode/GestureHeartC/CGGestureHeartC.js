/**
 * @file CGGestureHeartC.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect heart C gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureHeartC extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.HEART_C;
    this.twoHandGesture = true;
  }
}

exports.CGGestureHeartC = CGGestureHeartC;
