/**
 * @file CGAudioBiquadFilter.js
 * @author xuyuan
 * @date 2021/12/8
 * @brief CGAudioBiquadFilter.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioBiquadFilter extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'MDSPNode';
    this.audioGraph = null;
    this.portMap = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
    };
    this.portRangeMap = {
      1: [0, 7],
      2: [20, 20000],
      3: [0.1, 20],
      4: [-20, 20],
      5: [-1, 1],
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
    const keys = Object.keys(this.params);
    for (let i = 0; i < keys.length; i++) {
      const oriValue = this.params[keys[i]];
      let curValue = this.inputs[keys[i]]();
      if (oriValue !== curValue) {
        const mdspPort = this.portMap[keys[i]];
        if (mdspPort) {
          const range = this.portRangeMap[keys[i]];
          if (range && range.length === 2) {
            if (curValue < range[0]) {
              curValue = range[0];
            } else if (curValue > range[1]) {
              curValue = range[1];
            }
          }
          const normValue = (curValue - range[0]) / [range[1] - range[0]];
          this.audioNode.dynamicParameterChange(0, mdspPort, normValue);
        }
        this.params[i] = curValue;
      }
    }
  }

  initAudio(sys) {
    if (this.audioGraph) {
      this.audioNode = this.audioGraph.createAudioNode('MDSPNode', null);
      this.audioNode.addSearchPath(sys.scene.assetMgr.rootDir + 'audio/AudioBiquadFilter');
      this.audioNode.setupMDSPGraphFromFile(sys.scene.assetMgr.rootDir + 'audio/AudioBiquadFilter/config.json');
    }
  }
}

exports.CGAudioBiquadFilter = CGAudioBiquadFilter;
