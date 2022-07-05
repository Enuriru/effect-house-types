/**
 * @file CGAudioSpeaker.js
 * @author
 * @date 2021/11/30
 * @brief CGAudioSpeaker.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioSpeaker extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'SinkNode';
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onUpdate(sys, dt) {
    const curVol = this.inputs[1]() / 100.0;
    if (this.audioGainNode) {
      this.audioGainNode.gain = curVol;
    }
  }

  initAudio() {
    if (this.audioGraph) {
      this.audioGainNode = this.audioGraph.createAudioNode('GainNode', null);
      this.audioGainNode.gain = 1;
      this.audioNode = this.audioGainNode;
      if (this.sinkNode) {
        this.audioGainNode.connect(this.sinkNode);
      } else {
        console.error('Speaker Node connection error: can not connection to sinknode');
      }
    }
  }
}

exports.CGAudioSpeaker = CGAudioSpeaker;
