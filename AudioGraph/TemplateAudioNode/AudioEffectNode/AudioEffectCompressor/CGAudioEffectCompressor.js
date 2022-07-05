/**
 * @file CGAudioEffectCompressor.js
 * @author
 * @date 2021/12/31
 * @brief CGAudioEffectCompressor.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioEffectCompressor extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'compressor';
    this.audioGraph = null;
    this.portIndexToParamName = {
      1: 'pre_gain',
      2: 'threshold',
      3: 'knee',
      4: 'ratio',
      5: 'attack',
      6: 'release',
      7: 'pre_delay',
      8: 'release_zone_1',
      9: 'release_zone_2',
      10: 'release_zone_3',
      11: 'release_zone_4',
      12: 'post_gain',
      13: 'wet',
      14: 'attenuation_dB_thd',
      15: 'detector_avg_thd',
    };
    this.portRangeMap = {
      1: [0, 100],
      2: [-100, 0],
      3: [0, 40],
      4: [1, 20],
      5: [0, 1],
      6: [0, 1],
      7: [0, 1],
      8: [0, 1],
      9: [0, 1],
      10: [0, 1],
      11: [0, 1],
      12: [0, 100],
      13: [0, 1],
      14: [0, 2],
      15: [0, 1],
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
    }
  }

  beforeStart(sys) {
    this.updateParamsValue();
  }

  onUpdate(sys, dt) {
    this.updateParamsValue();
  }

  updateParamsValue() {
    if (!this.audioNode) {
      return;
    }
    const keys = Object.keys(this.portIndexToParamName);
    for (let i = 0; i < keys.length; i++) {
      const oriValue = this.params[keys[i]];
      let curValue = this.inputs[keys[i]]();
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

  initAudio(sys) {
    if (this.audioGraph) {
      this.audioNode = this.audioGraph.createAudioEffectNode(this.audioNodeName, null);
    }
  }
}

exports.CGAudioEffectCompressor = CGAudioEffectCompressor;
