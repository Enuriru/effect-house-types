/**
 * @file CGGestureThumbDown.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect thumb down gesture.
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureThumbDown extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.THUMB_DOWN;
    this.twoHandGesture = false;
  }
}

exports.CGGestureThumbDown = CGGestureThumbDown;
