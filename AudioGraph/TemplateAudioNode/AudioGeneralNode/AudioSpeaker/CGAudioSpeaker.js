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
    this.onlineMusicSpeaker = false;
  }

  setInput(index, func) {
    this.inputs[index] = func;
  }

  onUpdate(sys, dt) {
    let curVol = this.inputs[1]() / 100.0;
    if (curVol > 1) {
      curVol = 1;
    } else if (curVol < 0) {
      curVol = 0;
    }
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
        if (this.onlineMusicSpeaker === false) {
          //this.audioGainNode.pout(0).connect(this.sinkNode.pin(1));
        }
      } else {
        console.error('Speaker Node connection error: can not connection to sinknode');
      }
    }
  }
}

exports.CGAudioSpeaker = CGAudioSpeaker;
