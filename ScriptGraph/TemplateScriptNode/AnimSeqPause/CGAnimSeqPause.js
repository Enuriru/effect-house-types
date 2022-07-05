/**
 * @file CGAnimSeqStop.js
 * @author xuyuan
 * @date 2021/11/10
 * @brief CGAnimSeqStop.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAnimSeqPause extends BaseNode {
    constructor() {
        super();
        this.component = null;
    }

    execute() {
        this.component = this.inputs[1]();
        if (this.component) {
            this.component.pause();
            if (this.nexts[0]) {
                this.nexts[0]()
            }
        }
    }
};

exports.CGAnimSeqPause = CGAnimSeqPause;
