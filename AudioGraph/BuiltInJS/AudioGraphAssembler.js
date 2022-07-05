/**
 * @file AudioGraphAssembler.js
 * @author xuyuan
 * @date 2021/11/29
 * @brief AudioGraphFactory.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;

class AudioGraphAssembler {
  constructor() {
    this._audioModule = Amaz.AmazingManager.getSingleton('AMGAudioModule');
    this._audioProxyMap = new Amaz.Map();
    this._audioProxyMap.insert('samplerate', 44100);
    this._audioProxy = this._audioModule.createAudioProxy(this._audioProxyMap);
    this._audioGraph = this._audioProxy.createAudioGraph();
    this._fileSourceMap = new Amaz.Map();
    this._sinkMap = new Amaz.Map();
    this._micMap = new Amaz.Map();
    if (this._audioProxy && this._audioGraph) {
      this._sinkNode = this._audioGraph.createAudioNode('SinkNode', this._sinkMap);
    }
    // if (this._audioProxy && this._audioGraph) {
    //   this._micSourceNode = this._audioGraph.createAudioNode('MicSourceNode', this._micMap);
    // }
    this._proxyActive = false;
    this._usedInGraph = false;
  }

  static getInstance() {
    if (!AudioGraphAssembler._instance) {
      AudioGraphAssembler._instance = new AudioGraphAssembler();
    }
    return AudioGraphAssembler._instance;
  }

  getAudioGraph() {
    return this._audioGraph;
  }

  startProxy() {
    if (this._proxyActive === true) {
      return;
    }
    if (this._audioProxy && this._audioGraph) {
      //to fix mic record in 093
      //this._micSourceNode.pout(0).connect(this._sinkNode.pin(1));
      this._audioProxy.useAudioGraph(this._audioGraph);
      this._audioProxy.start();
      //this._micSourceNode.start();
      this._proxyActive = true;
    } else {
      console.error('Audio Graph start Proxy error !!!');
    }
  }

  releaseProxy() {
    if (this._proxyActive === false) {
      return;
    }
    if (this._audioProxy) {
      this._audioProxy.stop();
      this._audioModule.destroyAudioProxy(this._audioProxy);
      this._proxyActive = false;
    }
  }

  createAudioNode(sys, node) {
    if (node.audioNodeName && node.audioNodeName !== '') {
      node.audioGraph = this._audioGraph;
      if (node.audioNodeName === 'SinkNode') {
        node.sinkNode = this.sinkNode();
      }
      node.initAudio && node.initAudio(sys);
    }
  }

  sinkNode() {
    return this._sinkNode;
  }

  // micSourceNode() {
  //   return this._micSourceNode;
  // }
}

exports.AudioGraphAssembler = AudioGraphAssembler;
