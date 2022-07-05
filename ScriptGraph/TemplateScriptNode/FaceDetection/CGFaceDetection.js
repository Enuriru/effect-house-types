/**
 * @file CGFaceDetection.js
 * @author liujiacheng
 * @date 2021/8/18
 * @brief CGFaceDetection.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceDetection extends BaseNode {
  constructor() {
    super();
    this.faceIndexMap = {
      'Face 0': 0,
      'Face 1': 1,
      'Face 2': 2,
      'Face 3': 3,
      'Face 4': 4,
    };
  }

  onUpdate(sys, dt) {
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();
    const curFaceCount = algResult.getFaceCount();
    const faceIdxInput = this.inputs[0]();
    if (faceIdxInput === null) {
      return;
    }
    const faceIdx = this.faceIndexMap[faceIdxInput];
    if (faceIdx === undefined) {
      return;
    }
    if (this.faceCount <= faceIdx && curFaceCount > faceIdx) {
      if (this.nexts[0]) {
        this.nexts[0]();
      }
    }
    if (curFaceCount > faceIdx) {
      if (this.nexts[1]) {
        this.nexts[1]();
      }
    }
    if (this.faceCount > faceIdx && curFaceCount <= faceIdx) {
      if (this.nexts[2]) {
        this.nexts[2]();
      }
    }
    if (curFaceCount <= faceIdx) {
      if (this.nexts[3]) {
        this.nexts[3]();
      }
    }
    this.faceCount = curFaceCount;
  }
}

exports.CGFaceDetection = CGFaceDetection;
