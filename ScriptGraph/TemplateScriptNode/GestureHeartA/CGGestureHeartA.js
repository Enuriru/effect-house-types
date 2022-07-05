/**
 * @file CGGestureHeartA.js
 * @author Weifeng
 * @date 2021-12-30
 * @brief Detect heart A Gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureHeartA extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.HEART_A;
    this.twoHandGesture = true;
  }
}

exports.CGGestureHeartA = CGGestureHeartA;
