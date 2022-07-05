/**
 * @file CGOnSetDetection.js
 * @author
 * @date 2021/12/6
 * @brief CGOnSetDetection.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAEDDetection extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'aed';
    this.audioGraph = null;
    this.portIndexToParamName = {
      2: 'aed_threshold',
    };
    this.portRangeMap = {
      2: [0, 1],
    };
    this.params = {};
    this.resultMap = {
      0: "dog",
      1: "cat",
      2: "cow",
      3: "chicken",
      4: "pig",
      5: "sheep",
    };
  }

  setInput(index, func) {
    this.inputs[index] = func;
    this.params[index] = Number.MAX_VALUE;
  }

  getOutput(index) {
    if (index === 1) {
      return this.audioNode;
    } else {
      return this.outputs[index];
    }
  }

  onUpdate(sys, dt) {
    //this.updateParamsValue();
    const enable = this.inputs[1]();
    if (this.audioNode && enable) {
      const result = this.audioNode.getResult();
      if (result) {
        const featureList = result.featureList;
        if (!featureList.empty()) {
          const feature = featureList.popBack();
          this.parseResult(feature.values);
        }
      }
    }
  }

  parseResult(values) {
    let result = undefined;
    let currentMax = 0;
    const keys = Object.keys(this.resultMap);
    for (let i = 0; i < keys.length; i++) {
      let curScore = values.get(i);
      if (curScore > currentMax) {
        currentMax = curScore;
        result = this.resultMap[keys[i]];
      }
    }
    if(result) {
      this.outputs[2] = result;
      if (this.nexts[0]) {
        this.nexts[0]();
      }
    }
  }


  onInit(sys) {
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
          if (oriValue !== curValue) {
            this.audioNode.setParameter(paramName, curValue);
          }
        }
        this.params[keys[i]] = curValue;
      }
    }
  }

  initAudio() {
    if (this.audioGraph) {
      const extractorMap = new Amaz.Map();
      extractorMap.insert("modelName", "aed_pets"); // specify model name
      this.audioNode = this.audioGraph.createAudioExtractorNode(this.audioNodeName, extractorMap);
    }
  }
}

exports.CGAEDDetection = CGAEDDetection;
