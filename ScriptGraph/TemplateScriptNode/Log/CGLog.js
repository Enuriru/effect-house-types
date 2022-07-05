/**
 * @file CGLog.js
 * @author xuyuan
 * @date 2021/10/15
 * @brief CGLog.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGLog extends BaseNode {
  constructor() {
    super();
  }

  execute(index) {
    if (this.inputs[1]) {
      const logText = this.inputs[1]();
      if (logText) {
        console.log('CREATOR_GRAPH_TAG: ', log);
      }
    }
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }
}

exports.CGLog = CGLog;
