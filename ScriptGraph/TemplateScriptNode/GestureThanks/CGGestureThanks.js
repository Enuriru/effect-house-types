/**
 * @file CGGestureThanks.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect thanks gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureThanks extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.BEG;
    this.twoHandGesture = true;
  }
}

exports.CGGestureThanks = CGGestureThanks;
