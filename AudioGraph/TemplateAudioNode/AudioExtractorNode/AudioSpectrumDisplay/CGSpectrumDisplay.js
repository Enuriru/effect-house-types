/**
 * @file CGSpectrumDisplay.js
 * @author
 * @date 2021/12/8
 * @brief CGSpectrumDisplay.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGSpectrumDisplay extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'spectrum_display';
    this.audioGraph = null;
    this.num_output_bin = 512;
    this.portIndexToParamName = {
      2: 'output_type',
    };
    this.frequency = [];
    for (let i = 0; i < this.num_output_bin; i++) {
      this.frequency[i] = 0;
    }
    for (let i = 1; i <= 8; i++) {
      this.outputs[i] = 0;
    }
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
    this.updateParamsValue();
    const enable = this.inputs[1]();
    if (this.audioNode && enable) {
      const result = this.audioNode.getResult();
      if (result) {
        const featureList = result.featureList;
        if (!featureList.empty()) {
          const feature = featureList.popBack();
          for (let i = 0; i < feature.values.size(); i++) {
            this.frequency[i] = feature.values.get(i);
          }
          for (let i = 0; i < 512; i += 64) {
            this.outputs[i / 64 + 1] = this.avg(this.frequency.slice(i, 64 + i));
          }
        }
      }
    }
  }

  avg(arr) {
    if (Array.isArray(arr)) {
      let arrSum = 0;
      for (let i = 0; i < arr.length; i++) {
        arrSum += arr[i];
      }
      return arrSum / arr.length;
    }
  }

  beforeStart(sys) {
    this.updateParamsValue();
  }

  updateParamsValue() {
    if (this.audioNode === null) {
      return;
    }
    const outputType = this.inputs[2]();
    if (true === outputType) {
      this.audioNode.setStringParameter('output_type', 'db');
    } else {
      this.audioNode.setStringParameter('output_type', 'byte');
    }
  }

  initAudio() {
    if (this.audioGraph) {
      this.audioNode = this.audioGraph.createAudioExtractorNode(this.audioNodeName, null);
      this.audioNode.setStringParameter('num_output_bin', this.num_output_bin);
    }
  }
}

exports.CGSpectrumDisplay = CGSpectrumDisplay;
