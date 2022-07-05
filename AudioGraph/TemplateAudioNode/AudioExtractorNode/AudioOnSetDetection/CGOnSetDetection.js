/**
 * @file CGOnSetDetection.js
 * @author
 * @date 2021/12/6
 * @brief CGOnSetDetection.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGOnSetDetection extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'onset_detection';
    this.audioGraph = null;
    this.portIndexToParamName = {
      3: 'threshold',
    };
    this.portRangeMap = {
      3: [40, 200],
    };
    this.params = {};
  }

  setInput(index, func) {
    this.inputs[index] = func;
    this.params[index] = Number.MAX_VALUE;
  }

  getOutput(index) {
    if (index === 0) {
      return this.audioNode;
    } else {
      return this.outputs[index];
    }
  }

  onUpdate(sys, dt) {
    this.updateParamsValue();
    const enable = this.inputs[1]();
    const keepValue = this.inputs[2]();
    if (this.audioNode && enable) {
      const result = this.audioNode.getResult();
      if (result) {
        const featureList = result.featureList;
        if (!featureList.empty()) {
          const feature = featureList.popBack();
          this.outputs[1] = feature.values.get(0);
        }
      } else {
        if (false === keepValue) {
          this.outputs[1] = 0;
        }
      }
    }
  }

  beforeStart(sys) {
    this.updateParamsValue();
  }

  updateParamsValue() {
    if (!this.audioNode) {
      return;
    }
    const keys = Object.keys(this.portIndexToParamName);
    for (let i = 0; i < keys.length; i++) {
      const oriValue = this.params[keys[i]];
      let curValue = this.inputs[keys[i]] ? this.inputs[keys[i]]() : oriValue;
      if (oriValue !== curValue) {
        const paramName = this.portIndexToParamName[keys[i]];
        if (paramName) {
          const range = this.portRangeMap[keys[i]];
          if (range && range.length === 2) {
            if (curValue < range[0]) {
              curValue = range[0];
            } else if (curValue > range[1]) {
              curValue = range[1];
            }
          }
          this.audioNode.setParameter(paramName, curValue);
        }
        this.params[keys[i]] = curValue;
      }
    }
  }

  initAudio() {
    if (this.audioGraph) {
      this.audioNode = this.audioGraph.createAudioExtractorNode(this.audioNodeName, null);
    }
  }
}

exports.CGOnSetDetection = CGOnSetDetection;
