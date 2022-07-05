/**
 * @file CGMouthOpen.js
 * @author xuyuan
 * @date 2021/8/13
 * @brief CGMouthOpen.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

 const {BaseNode} = require('./BaseNode');
 const Amaz = effect.Amaz;
 
 class CGMouthOpen extends BaseNode {
   constructor() {
     super();
     this.actionDetected = false;
   }
 
   onUpdate(sys, dt) {
     const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
     const algResult = algMgr.getAEAlgorithmResult();
     let faceIdx = this.inputs[0]();
 
     if (algResult !== null && faceIdx !== null) {
       const face = algResult.getFaceBaseInfo(Math.round(faceIdx));
       if (face === undefined || face === null) {
         return;
       }
 
       const hasAction = face.hasAction(Amaz.FaceAction.MOUTH_AH);
       if (!this.actionDetected && hasAction) {
         if (this.nexts[0]) {
           this.nexts[0]();
         }
       } else if (this.actionDetected && hasAction) {
         if (this.nexts[1]) {
           this.nexts[1]();
         }
       } else if (this.actionDetected && !hasAction) {
         if (this.nexts[2]) {
           this.nexts[2]();
         }
       } else {
         if (this.nexts[3]) {
           this.nexts[3]();
         }
       }
       this.actionDetected = hasAction;
     }
   }
 }
exports.CGMouthOpen = CGMouthOpen;
