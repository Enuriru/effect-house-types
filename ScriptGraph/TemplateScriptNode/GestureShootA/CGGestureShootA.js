/**
 * @file CGGestureShootA.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect shoot A gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureShootA extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.PISTOL;
    this.twoHandGesture = false;
  }
}

exports.CGGestureShootA = CGGestureShootA;
