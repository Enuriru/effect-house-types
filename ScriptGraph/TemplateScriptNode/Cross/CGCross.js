/**
 * @file CGCross.js
 * @author runjiatian
 * @date 2022/3/23
 * @brief CGCross.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

 const {BaseNode} = require('./BaseNode');
 const Amaz = effect.Amaz;
 
 class CGCross extends BaseNode {
   constructor() {
     super();
   }
 
   getOutput(index) {
      let vecA = this.inputs[0]();
      let vecB = this.inputs[1]();
      if(vecA == undefined || vecB == undefined){
        return;
      }
      else if(this.valueType === 'Vector3f'){
        let vectorA = new Amaz.Vector3f(vecA.x, vecA.y, vecA.z);
        let vectorB = new Amaz.Vector3f(vecB.x, vecB.y, vecB.z);
        return vectorA.cross(vectorB);
      }
      else if(this.valueType === 'Vector4f'){
        let vectorA = new Amaz.Vector3f(vecA.x, vecA.y, vecA.z);
        let vectorB = new Amaz.Vector3f(vecB.x, vecB.y, vecB.z);
        let result = vectorA.cross(vectorB);
        return new Amaz.Vector4f(result.x, result.y, result.z, 0.0);
      }
    }
 }
 
 exports.CGCross = CGCross;
 