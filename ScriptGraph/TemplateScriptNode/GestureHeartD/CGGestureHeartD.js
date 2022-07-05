/**
 * @file CGGestureHeartD.js
 * @author Weifeng
 * @date 2021-12-31
 * @brief Detect heart D gesture
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {CGGestureDetectionBase} = require('./CGGestureDetectionBase');
const Amaz = effect.Amaz;

class CGGestureHeartD extends CGGestureDetectionBase {
  constructor() {
    super();
    this.action = Amaz.HandAction.HEART_D;
    this.twoHandGesture = false;
  }
}

exports.CGGestureHeartD = CGGestureHeartD;
