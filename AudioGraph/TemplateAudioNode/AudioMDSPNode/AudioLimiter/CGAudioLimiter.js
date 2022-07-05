/**
 * @file CGAudioLimiter.js
 * @author
 * @date 2021/12/8
 * @brief CGAudioLimiter.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAudioLimiter extends BaseNode {
 constructor() {
  super();
  this.audioNode = null;
  this.audioNodeName = 'MDSPNode';
  this.audioGraph = null;
  this.portMap = {
   1:1,
   2:2,
   3:3
  }
  this.portRangeMap = {
   1: [0, 24],
   2: [-24, 0],
   3: [1, 3000]
  }
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
  for (let i = 0 ; i < keys.length; i++) {
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
     console.error("set mdspNode param: ", mdspPort, curValue);
     const normValue = (curValue - range[0]) / [range[1] - range[0]];
     this.audioNode.dynamicParameterChange(0, mdspPort, normValue);
    }
    this.params[i] = curValue;
   }
  }
 }

 initAudio(sys) {
  if (this.audioGraph) {
   this.audioNode = this.audioGraph.createAudioNode("MDSPNode", null);
   this.audioNode.addSearchPath(sys.scene.assetMgr.rootDir + "audio/AudioLimiter")
   this.audioNode.setupMDSPGraphFromFile(sys.scene.assetMgr.rootDir + "audio/AudioLimiter/config.json")
  }
 }
};

exports.CGAudioLimiter = CGAudioLimiter;
