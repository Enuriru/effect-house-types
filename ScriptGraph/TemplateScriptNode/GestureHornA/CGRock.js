/**
 * @file CGRock.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect horn A gesture.
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGRock extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.ROCK;
    this.twoHandGesture = false;
  }
}

exports.CGRock = CGRock;
