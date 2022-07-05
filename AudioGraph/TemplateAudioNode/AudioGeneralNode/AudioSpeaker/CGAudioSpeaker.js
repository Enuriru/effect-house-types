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
}

exports.CGAudioSpeaker = CGAudioSpeaker;
