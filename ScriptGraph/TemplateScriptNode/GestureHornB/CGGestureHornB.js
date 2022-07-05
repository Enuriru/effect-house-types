/**
 * @file CGGestureHornB.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect horn B gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureHornB extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.ROCK2;
    this.twoHandGesture = false;
  }
}

exports.CGGestureHornB = CGGestureHornB;
