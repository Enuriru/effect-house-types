/**
 * @file AudioComponentController.js
 * @author
 * @date 2022/1/28
 * @brief AudioComponentController.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAudioComponentController extends BaseNode {
  constructor() {
    super();
    this.audioComponent = null;
    this.componentRef = null;
    this.enable = true;
    this.playState = '';
  }

  onInit() {
    this.audioComponent = this.inputs[4]();
    if (
      this.audioComponent &&
      this.audioComponent.isInstanceOf('JSScriptComponent') === true &&
      this.audioComponent.name === 'AudioComponent'
    ) {
      this.audioComponent.getScript().ref.configInGraph = true;
    }
  }

  execute(index) {
    this.audioComponent = this.inputs[4]();
    if (
      this.audioComponent.isInstanceOf('JSScriptComponent') === false ||
      this.audioComponent.name !== 'AudioComponent'
    ) {
      console.error('CGAudioComponentController input component is not a AudioComponent');
      return;
    }
    this.componentRef = this.audioComponent.getScript().ref;
    if (index === 0) {
      this.componentRef.resetToPlay();
      this.playState = 'play';
      if (this.nexts[0]) {
        this.nexts[0]();
      }
    }
    if (index === 1) {
      this.componentRef.stopAndReset();
      this.playState = 'stop';
      if (this.nexts[1]) {
        this.nexts[1]();
      }
    }
    if (index === 2) {
      if (this.playState === 'stop') {
        return;
      }
      this.componentRef.pause();
      this.playState = 'pause';
    }
    if (index === 3) {
      if (this.playState !== 'pause') {
        return;
      }
      this.componentRef.resume();
      this.playState = 'resume';
    }
  }

  onEvent(event) {
    if (event.type === Amaz.AppEventType.COMPAT_BEF) {
      const event_result1 = event.args.get(0);
      if (event_result1 === Amaz.BEFEventType.BET_RECORD_VIDEO) {
        const event_result2 = event.args.get(1);
        if (event_result2 === Amaz.BEF_RECODE_VEDIO_EVENT_CODE.RECODE_VEDIO_START) {
          //this.enable = true;
        } else if (event_result2 === Amaz.BEF_RECODE_VEDIO_EVENT_CODE.RECODE_VEDIO_END) {
          //this.enable = false;
        }
      }
    }
  }

  onUpdate(sys, dt) {
    if (this.audioComponent && this.componentRef) {
      if (this.componentRef.isFinished === true) {
        if (this.nexts[2]) {
          this.nexts[2]();
        }
        this.componentRef.isFinished = null;
      }
    }
  }
}

exports.CGAudioComponentController = CGAudioComponentController;
