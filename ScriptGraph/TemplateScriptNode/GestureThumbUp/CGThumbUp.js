/**
 * @file CGThumbUp.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect thumb up gesture.
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGThumbUp extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.THUMB_UP;
    this.twoHandGesture = false;
  }
}

exports.CGThumbUp = CGThumbUp;
