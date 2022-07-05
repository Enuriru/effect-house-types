/**
 * @file CGVolumeDetection.js
 * @author
 * @date 2021/12/7
 * @brief CGVolumeDetection.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGVolumeDetection extends BaseNode {
 constructor() {
  super();
  this.audioNode = null;
  this.audioNodeName = 'volume_detection';
  this.audioGraph = null;
 }

 setInput(index, func) {
  this.inputs[index] = func;
 }

 getOutput(index) {
  if (index === 0) {
   return this.audioNode;
  } else {
   return this.outputs[index];
  }
 }

 onUpdate(sys, dt) {
  const enable = this.inputs[1]();
  if (this.audioNode && enable) {
   const result = this.audioNode.getResult();
   if (result) {
    const featureList = result.featureList;
    if (!featureList.empty()) {
     const feature = featureList.popBack();
     this.outputs[1] = feature.values.get(0);
    }
   }
  }
 }

 initAudio() {
  if (this.audioGraph) {
   this.audioNode = this.audioGraph.createAudioExtractorNode(this.audioNodeName, null);
  }
 }
};

exports.CGVolumeDetection = CGVolumeDetection;
