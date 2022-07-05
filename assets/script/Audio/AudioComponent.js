/**
 * @file AudioComponent.js
 * @author xuyuan
 * @date 2022/1/24
 * @brief AudioComponent.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {AudioGraphAssembler} = require('./AudioGraphAssembler');
const Amaz = effect.Amaz;

class AudioComponent {
  constructor() {
    this.audioPlayMode = undefined;
    this.loopCount = 1;
    this.currentLoop = 0;
    this.playState = 'stop';
    this.audioMute = undefined;
    this.audioVolume = undefined;
    this.isAutoPlay = undefined;
    this.audioFilePath = '';
    this.audioDuration = 0;
    this.timer = 0;
    this.audioSourceNode = null;
    this.audioGainNode = null;
    this.audioSinkNode = null;
    this.dirty = false;
    this.enabled = true;
    this.prevEntityVisibleState = true;
    this.entityVisible = true;
    this.isFinished = false;
    this.previewPaused = false;
  }

  onInit() {
    this.audioSourceNode = AudioGraphAssembler.getInstance().getAudioGraph().createAudioNode('FileSourceNode', null);
    if (!this.audioSourceNode) {
      console.error('AudioComponent create audio source node failed');
    }
    this.audioGainNode = AudioGraphAssembler.getInstance().getAudioGraph().createAudioNode('GainNode', null);
    if (!this.audioGainNode) {
      console.error('AudioComponent create audio gain node failed');
    }
    this.audioSinkNode = AudioGraphAssembler.getInstance().sinkNode();
    if (!this.audioSinkNode) {
      console.error('AudioComponent get audio sink node failed');
      return;
    }
    this.updateProperties();
    this.dirty = false;
    if (this.enabled === true) {
      this.enabled = undefined;
    }
    if (this.audioPlayMode === 'Once' || this.audioPlayMode === 'Loop') {
      this.audioSourceNode.setLoop(false);
    } else if (this.audioPlayMode === 'Infinite') {
      //loop have bug in 1030 for some audio resource
      //this.audioSourceNode.setLoop(true);
    }
    this.audioSourceNode.connect(this.audioGainNode);
    this.audioGainNode.pout(0).connect(this.audioSinkNode.pin(0));
    //this.audioGainNode.pout(0).connect(this.audioSinkNode.pin(1));
    if (AudioGraphAssembler.getInstance()._usedInGraph === false) {
      AudioGraphAssembler.getInstance().startProxy();
    }
  }

  updateProperties() {
    //for component control
    if (this.volume !== this.audioVolume) {
      this.audioVolume = this.volume;
      if (this.audioVolume > 100) {
        this.audioVolume = 100;
      } else if (this.audioVolume < 0) {
        this.audioVolume = 0;
      }
      this.audioGainNode.gain = this.audioVolume / 100.0;
    }
    if (this.audioMute !== this.mute) {
      if (this.mute === true) {
        this.audioGainNode.gain = 0;
      } else {
        this.audioGainNode.gain = this.audioVolume / 100.0;
      }
      this.audioMute = this.mute;
    }
    if (
      this.isAutoPlay !== this.autoPlay ||
      this.audioPlayMode !== this.playMode ||
      this.loopCount !== this.loopAmount
    ) {
      this.isAutoPlay = this.autoPlay;
      this.audioPlayMode = this.playMode;
      this.loopCount = this.loopAmount;
      if (this.audioPlayMode === 'Once') {
        this.loopCount = 1;
      }
      this.dirty = true;
    }

    if (this.duration !== this.audioDuration || this.resPath !== this.audioFilePath) {
      this.stop();
      this.audioDuration = this.duration;
      this.audioFilePath = this.resPath;
      if (this.audioDuration === 0 || this.audioFilePath === '') {
        this.enabled = false;
      } else {
        this.enabled = true;
      }
      const resPath = this.getNativeComponent().entity.scene.assetMgr.rootDir + this.audioFilePath;
      this.audioSourceNode.setSource(resPath);
      this.dirty = true;
    }
  }

  resetRecordData() {
    this.currentLoop = 0;
    this.timer = 0;
  }

  stop() {
    if (this.audioSourceNode) {
      this.audioSourceNode.stop();
      this.playState = 'stop';
    }
  }

  play() {
    if (this.audioSourceNode) {
      this.audioSourceNode.start();
      this.playState = 'play';
      this.isFinished = false;
    }
  }

  resetToPlay() {
    this.currentLoop = 0;
    this.timer = 0;
    if (
      this.enabled === true &&
      this.getNativeComponent().entity &&
      this.getNativeComponent().entity.visible === true
    ) {
      this.play();
    }
  }

  stopAndReset() {
    this.stop();
    this.currentLoop = 0;
    this.timer = 0;
  }

  pause() {
    if (this.audioSourceNode) {
      this.audioSourceNode.pause();
      this.playState = 'pause';
    }
  }

  resume() {
    if (this.audioSourceNode) {
      this.audioSourceNode.resume();
      this.playState = 'resume';
    }
  }

  onStart() {
    if (this.autoPlay === true) {
      this.play();
    }
  }

  onEnable() {
    if (this.enabled !== undefined) {
      //first enable come ,do not need play
      this.enabled = true;
      this.resetToPlay();
    } else {
      this.enabled = true;
    }
  }

  onDisable() {
    this.enabled = false;
    this.stopAndReset();
  }

  onUpdate(dt) {
    if (dt === 0 && this.previewPaused === false && (this.playState === 'play' || this.playState === 'resume')) {
      this.pause();
      this.previewPaused = true;
    } else if (dt !== 0 && this.previewPaused === true) {
      if (this.playState === 'pause') {
        this.resume();
      }
      this.previewPaused = false;
    }
    if (
      this.getNativeComponent().entity &&
      this.getNativeComponent().entity.visible === false &&
      this.prevEntityVisibleState === true
    ) {
      this.stopAndReset();
      this.prevEntityVisibleState = false;
      this.enabled = false;
      return;
    }
    if (
      this.getNativeComponent().entity &&
      this.getNativeComponent().entity.visible === true &&
      this.prevEntityVisibleState === false
    ) {
      this.resetToPlay();
      this.prevEntityVisibleState = true;
      this.enabled = true;
    }
    if (this.enabled === false || this.previewPaused === true) {
      return;
    }
    this.updateProperties();
    if (this.dirty) {
      this.stop();
      this.resetRecordData();
      this.dirty = false;
      if (this.isAutoPlay === true) {
        if (this.audioPlayMode === 'Once' || this.audioPlayMode === 'Loop') {
          this.audioSourceNode.setLoop(false);
        } else if (this.audioPlayMode === 'Infinite') {
          //this.audioSourceNode.setLoop(true);
        }
        this.play();
      } else {
        return;
      }
    }
    if (this.playState === 'play' || this.playState === 'resume') {
      this.timer += dt * 1000;
      if (this.timer >= this.audioDuration) {
        if (this.audioPlayMode === 'Loop' || this.audioPlayMode === 'Once') {
          this.currentLoop += 1;
        } else {
          this.currentLoop = -1;
        }
        this.timer = 0;
        this.play();
        if (this.currentLoop >= this.loopCount) {
          this.stop();
          this.isFinished = true;
        }
      }
    }
  }

  onEvent(event) {
    if (event.type === Amaz.AppEventType.COMPAT_BEF) {
      const event_result1 = event.args.get(0);
      if (event_result1 === Amaz.BEFEventType.BET_RECORD_VIDEO) {
        const event_result2 = event.args.get(1);
        if (event_result2 === Amaz.BEF_RECODE_VEDIO_EVENT_CODE.RECODE_VEDIO_START) {
          if (this.playState === 'pause') {
            this.resume();
          }
        } else if (event_result2 === Amaz.BEF_RECODE_VEDIO_EVENT_CODE.RECODE_VEDIO_END) {
          if (this.playState === 'play' || this.playState === 'resume') {
            this.pause();
          }
        }
      }
    }
  }

  onDestroy() {
    if (AudioGraphAssembler.getInstance()._usedInGraph === false) {
      AudioGraphAssembler.getInstance().releaseProxy();
    }
  }

  getNativeComponent() {
    return this.getComponent('AudioComponent');
  }

  getAudioSourceNode() {
    return this.audioSourceNode;
  }

  getAudioGainNode() {
    return this.audioGainNode;
  }
}

exports.AudioComponent = AudioComponent;
