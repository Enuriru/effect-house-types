/**
 * @file CGAnimSeqGetCurrentFrame.js
 * @author xuyuan
 * @date 2021/11/10
 * @brief CGAnimSeqGetCurrentFrame.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAnimSeqGetCurrentFrame extends BaseNode {
    constructor() {
        super();
        this.component = null;
    }

    getOutput(index) {
        this.component = this.inputs[0]();
        if (this.component) {
            return this.component.frameIndex;
        }
        return 0;
    }
};

exports.CGAnimSeqGetCurrentFrame = CGAnimSeqGetCurrentFrame;
