/**
 * @file CGGestureCabbage.js
 * @author Weifeng
 * @date 2021-12-30
 * @brief Detect cabbage gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureCabbage extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.CABBAGE;
    this.twoHandGesture = false;
  }
}

exports.CGGestureCabbage = CGGestureCabbage;
