/**
 * @file CGFour.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect four gesture
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGFour extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.FOUR;
    this.twoHandGesture = false;
  }
}

exports.CGFour = CGFour;
