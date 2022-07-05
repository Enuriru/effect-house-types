/**
 * @file CGAnimSeqStop.js
 * @author xuyuan
 * @date 2021/11/10
 * @brief CGAnimSeqStop.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAnimSeqStop extends BaseNode
{
    constructor() {
        super();
        this.component = null;
    }

    execute(index) {
        this.component = this.inputs[1]();
        if (this.component) {
            this.component.stop();
            this.component.entity.visible = false;
            this.component.frameIndex = 0;
            if (this.nexts[0]) {
                this.nexts[0]();
            }
        }
    }
};

exports.CGAnimSeqStop = CGAnimSeqStop;
