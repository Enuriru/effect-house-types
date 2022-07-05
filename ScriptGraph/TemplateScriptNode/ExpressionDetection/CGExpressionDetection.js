/**
 * @file CGExpressionDetection.js
 * @author liujiacheng
 * @date 2021/8/19
 * @brief CGExpressionDetection.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGExpressionDetection extends BaseNode {
  constructor() {
    super();
    this.expressionDetected = false;
    this.faceIndexMap = {
      'Face 0': 0,
      'Face 1': 1,
      'Face 2': 2,
      'Face 3': 3,
      'Face 4': 4,
      Any: -1,
    };
    this.expressionMap = {
      Happy: Amaz.FaceAttrExpression.HAPPY,
      Angry: Amaz.FaceAttrExpression.ANGRY,
      Surprise: Amaz.FaceAttrExpression.SURPRISE,
      Disgust: Amaz.FaceAttrExpression.DISGUST,
      Fear: Amaz.FaceAttrExpression.FEAR,
      Sad: Amaz.FaceAttrExpression.SAD,
      Neutral: Amaz.FaceAttrExpression.NEUTRAL,
    };
  }

  onUpdate(sys, dt) {
    let expressionInput = this.inputs[1]();
    let whichFace = this.inputs[0]();

    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult !== null && expressionInput !== null && whichFace !== null) {
      const expression = this.expressionMap[expressionInput];
      const index = this.faceIndexMap[whichFace];

      if (index === undefined || expression === undefined) {
        return;
      }

      let curExpressionDetected = false;
      if (index === -1) {
        for (let i = 0; i < 5; ++i) {
          const face = algResult.getFaceAttributeInfo(i);
          if (face) {
            curExpressionDetected = curExpressionDetected || face.exp_type === expression;
          }
        }
      } else {
        const face = algResult.getFaceAttributeInfo(index);
        if (face) {
          curExpressionDetected = face.exp_type === expression;
        }
      }

      if (curExpressionDetected && !this.expressionDetected) {
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      }
      if (curExpressionDetected) {
        if (this.nexts[1]) {
          this.nexts[1]();
        }
      }
      if (!curExpressionDetected && this.expressionDetected) {
        if (this.nexts[2]) {
          this.nexts[2]();
        }
      }
      if (!curExpressionDetected) {
        if (this.nexts[3]) {
          this.nexts[3]();
        }
      }

      this.expressionDetected = curExpressionDetected;
    }
  }
}

exports.CGExpressionDetection = CGExpressionDetection;
