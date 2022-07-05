/**
 * @file CGVictory.js
 * @author Weifeng
 * @date 2022-01-04
 * @brief Detect victory gesture.
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGVictory extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.VICTORY;
    this.twoHandGesture = false;
  }
}

exports.CGVictory = CGVictory;
