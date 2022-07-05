/**
 * @file CGAnimSeqResume.js
 * @author xuyuan
 * @date 2021/11/10
 * @brief CGAnimSeqResume.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require("./BaseNode");

class CGAnimSeqResume extends BaseNode {
    constructor() {
        super();
        this.component = null;
    }

    execute(index) {
        this.component = this.inputs[1]();
        if (this.component) {
            this.component.play();
            if (this.nexts[0]) {
                this.nexts[0]();
            }
        }
    }
};

exports.CGAnimSeqResume = CGAnimSeqResume;
