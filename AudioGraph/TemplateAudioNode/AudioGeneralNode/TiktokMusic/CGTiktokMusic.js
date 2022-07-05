/**
 * @file CGTiktokMusic.js
 * @author
 * @date 2022/4/5
 * @brief CGTiktokMusic.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGTiktokMusic extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioOnlineNode = null;
    this.audioNodeName = 'MusicSourceNode';
  }

  getOutput(index) {
    if (this.isPreview) {
      return this.audioNode;
    } else {
      return this.audioOnlineNode;
    }
  }

  initAudio(sys) {
    if (this.audioGraph) {
      if (this.isPreview) {
        this.audioNode = this.audioGraph.createAudioNode('GainNode', null);
        this.audioNode.gain = 1.0;
        this.audioNode.setByPass(true);
        this.audioOnlineNode = null;
      } else {
        this.audioOnlineNode = this.audioGraph.createAudioNode('MusicSourceNode', new Amaz.Map());
        this.audioNode = null;
      }
    }
  }
}

exports.CGTiktokMusic = CGTiktokMusic;
