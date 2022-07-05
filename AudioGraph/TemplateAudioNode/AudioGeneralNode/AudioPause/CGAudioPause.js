/**
 * @file CGAudioPlay.js
 * @author
 * @date 2021/11/29
 * @brief CGAudioPlay.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAudioPause extends BaseNode {
 constructor() {
  super();
  this.audioNode = null;
 }

 execute(index) {
  if (this.inputs[1]) {
   this.audioNode = this.inputs[1]();
  }
  if (this.audioNode) {
   this.audioNode.pause();
   if (this.nexts[0]) {
    this.nexts[0]();
   }
  }
 }

 setInput(index, func) {
  if (index === 1 && func) {
   this.audioNode = func();
  }
  this.inputs[index] = func;
 }

 getOutput(index) {
  return this.audioNode;
 }
};

exports.CGAudioPause = CGAudioPause;
