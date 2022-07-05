/**
 * @file CGGestureNamaste.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect namaste gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureNamaste extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.NAMASTE;
    this.twoHandGesture = true;
  }
}

exports.CGGestureNamaste = CGGestureNamaste;
