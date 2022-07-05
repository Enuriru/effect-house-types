/**
 * @file CGAudioEffectHQFader.js
 * @author
 * @date 2021/12/31
 * @brief CGAudioEffectHQFader.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioEffectHQFader extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'hq_fader';
    this.audioGraph = null;
    this.portIndexToParamName = {
      1: 'peak',
      2: 'hardLimit',
      3: 'targetLoudness',
      4: 'loudness',
      5: 'volume',
      6: 'on',
      7: 'normalizedToTargetLoudness',
      8: 'normalizedToPeak',
    };
    this.portRangeMap = {
      2: [0, 1],
      3: [-30, 0],
      4: [-90, 12],
      5: [0, 1],
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

exports.CGAudioEffectHQFader = CGAudioEffectHQFader;
