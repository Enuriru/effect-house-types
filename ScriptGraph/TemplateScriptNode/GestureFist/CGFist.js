/**
 * @file CGFist.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect fist gesture.
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGFist extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.FIST;
    this.twoHandGesture = false;
  }
}

exports.CGFist = CGFist;
