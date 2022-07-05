/**
 * @file CGGestureThree.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect three gesture.
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureThree extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.THREE;
    this.twoHandGesture = false;
  }
}

exports.CGGestureThree = CGGestureThree;
