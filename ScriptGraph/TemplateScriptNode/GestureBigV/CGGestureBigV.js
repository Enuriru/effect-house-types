/**
 * @file CGGestureBigV.js
 * @author Weifeng
 * @date 2021-12-30
 * @brief Detect bigV gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureBigV extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.BIG_V;
    this.twoHandGesture = false;
  }
}

exports.CGGestureBigV = CGGestureBigV;
