/**
 * @file CGAudioSource.js
 * @author
 * @date 2021/11/29
 * @brief CGAudioSource.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAudioSource extends BaseNode {
  constructor() {
   super();
   this.audioPath = '';
   this.audioNode = null;
   this.audioNodeName = 'FileSourceNode';
  }

  setInput(index, func) {
    if (index === 0 && func) {
        this.audioPath = func();
    }
    this.inputs[index] = func;
  }

  beforeStart(sys) {
      const path = sys.scene.assetMgr.rootDir + this.audioPath;
      if (this.audioNode) {
          this.audioNode.setSource(path);
      }
  }

  getOutput(index) {
    return this.audioNode;
  }

  initAudio() {
      if (this.audioGraph) {
          this.audioNode = this.audioGraph.createAudioNode(this.audioNodeName, null);
      }
  }

};

exports.CGAudioSource = CGAudioSource;
