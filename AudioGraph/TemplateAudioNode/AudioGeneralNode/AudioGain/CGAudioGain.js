/**
 * @file CGAudioGain.js
 * @author xuyuan
 * @date 2021/12/27
 * @brief CGAudioGain.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioGain extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'GainNode';
    this.audioGraph = null;
    this.portRangeMap = {
      1: [0, 100],
    };
    this.params = {};
  }

  setInput(index, func) {
    this.inputs[index] = func;
    this.params[index] = 0;
  }

  beforeStart(sys) {
    this.updateParamsValue();
  }

  onUpdate(sys, dt) {
    this.updateParamsValue();
  }

  getOutput(index) {
    return this.audioNode;
  }

  updateParamsValue() {
    if (!this.audioNode) {
      return;
    }
    const oriGain = this.params[1];
    let curGain = this.inputs[1]();
    if (oriGain !== curGain) {
      const gainRange = this.portRangeMap[1];
      if (curGain < gainRange[0]) {
        curGain = 0;
      }
      if (curGain > gainRange[1]) {
        curGain = 100;
      }
      this.audioNode.gain = curGain / 100.0;
      this.params[1] = curGain;
    }
  }

  initAudio() {
    if (this.audioGraph) {
      this.audioNode = this.audioGraph.createAudioNode(this.audioNodeName, null);
    }
  }
}

exports.CGAudioGain = CGAudioGain;
