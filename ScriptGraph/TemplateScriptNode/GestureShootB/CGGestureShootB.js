/**
 * @file CGGestureShootB.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect shoot B gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureShootB extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.PISTOL2;
    this.twoHandGesture = false;
  }
}

exports.CGGestureShootB = CGGestureShootB;
