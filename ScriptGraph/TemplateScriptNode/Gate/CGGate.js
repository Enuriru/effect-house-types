/**
 * @file CGGate.js
 * @author runjiatian
 * @date 2022/4/20
 * @brief CGGate.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGGate extends BaseNode {
  constructor() {
    super();
    this.doorOpen = true;
  }

  beforeStart(sys){
    this.doorOpen = !this.inputs[4]();
  }

  execute(index) {
    if(index === 1)
    {
      this.doorOpen = true;
    }
    else if(index === 2)
    {
      this.doorOpen = false;
    }
    else if(index === 3)
    {
      this.doorOpen = !this.doorOpen;
    }
    else if(index === 0)
    {
      if(this.doorOpen){
        if(this.nexts[0]){
          this.nexts[0]();
        }
      }
    }
  }
}

exports.CGGate = CGGate;
