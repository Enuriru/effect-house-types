/**
 * @file CGAudioEffectReverb.js
 * @author
 * @date 2021/12/30
 * @brief CGAudioEffectReverb.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioEffectReverb extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'reverb1';
    this.audioGraph = null;
    this.portIndexToParamName = {
      1: 'room_size',
      2: 'damping',
      3: 'stereo_depth',
      4: 'wet',
      5: 'dry',
      6: 'wet_gaindB',
      7: 'dry_gaindB',
    };
    this.portRangeMap = {
      1: [0, 2],
      2: [0, 0.9],
      3: [0, 1],
      4: [0, 1],
      5: [0, 1],
      6: [0, 1],
      7: [0, 1],
    };
    this.params = {};
    this.enable = true;
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
    const enable = this.inputs[8]();
    if (this.enable !== enable) {
      this.enable = enable;
      if (this.enable) {
        this.audioNode.setByPass(false);
      } else {
        this.audioNode.setByPass(true);
        return;
      }
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
          if (oriValue !== curValue) {
            this.audioNode.setParameter(paramName, curValue);
          }
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

exports.CGAudioEffectReverb = CGAudioEffectReverb;
