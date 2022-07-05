/**
 * @file CGAudioMixer.js
 * @author xuyuan
 * @date 2021/12/27
 * @brief CGAudioMixer.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioMixer extends BaseNode {
  constructor() {
    super();
    this.outputAudioNode = null;
    this.audioNodes = [];
    this.audioNodeName = 'GainNode';
    this.audioGraph = null;
    this.portRangeMap = {
      1: [-1, 1],
      3: [-1, 1],
    };
    this.params = {};
  }

  setInput(index, func) {
    this.inputs[index] = func;
    this.params[index] = 0;
    if (index === 0) {
      const inputStream1 = this.inputs[index]();
      if (inputStream1) {
        inputStream1.connect(this.audioNodes[0]);
      }
    }
    if (index === 2) {
      const inputStream2 = this.inputs[index]();
      if (inputStream2) {
        inputStream2.connect(this.audioNodes[1]);
      }
    }
  }

  beforeStart(sys) {
    this.updateParamsValue();
  }

  onUpdate(sys, dt) {
    this.updateParamsValue();
  }

  getOutput(index) {
    return this.outputAudioNode;
  }

  updateParamsValue() {
    if (this.outputAudioNode === null || this.audioNodes[0] === null || this.audioNodes[1] === null) {
      return;
    }
    const keys = Object.keys(this.portRangeMap);
    for (let i = 0; i < keys.length; i++) {
      const oriGain = this.params[keys[i]];
      let curGain = this.inputs[keys[i]]();
      if (oriGain !== curGain) {
        const gainRange = this.portRangeMap[1];
        if (curGain < gainRange[0]) {
          curGain = -1;
        }
        if (curGain > gainRange[1]) {
          curGain = 1;
        }
        this.audioNodes[i].gain = curGain;
        this.params[keys[i]] = curGain;
      }
    }
  }

  onInit() {
    if (this.inputs[0] && this.inputs[0]() && this.audioNodes[0]) {
      this.inputs[0]().connect(this.audioNodes[0]);
    }
    if (this.inputs[2] && this.inputs[2]() && this.audioNodes[1]) {
      this.inputs[2]().connect(this.audioNodes[1]);
    }
  }

  initAudio() {
    if (this.audioGraph) {
      this.outputAudioNode = this.audioGraph.createAudioNode(this.audioNodeName, null);
      this.outputAudioNode.gain = 1;
      this.audioNodes[0] = this.audioGraph.createAudioNode(this.audioNodeName, null);
      this.audioNodes[0].gain = 1;
      this.audioNodes[1] = this.audioGraph.createAudioNode(this.audioNodeName, null);
      this.audioNodes[1].gain = 1;
      if (this.outputAudioNode && this.audioNodes[0] && this.audioNodes[1]) {
        this.audioNodes[0].connect(this.outputAudioNode);
        this.audioNodes[1].connect(this.outputAudioNode);
      }
    }
  }
}

exports.CGAudioMixer = CGAudioMixer;
