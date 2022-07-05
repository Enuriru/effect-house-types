/**
 * @file CGAnimatorController.js
 * @author xuyuan
 * @date 2021/10/14
 * @brief CGAnimatorController.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAnimatorController extends BaseNode {
  constructor() {
    super();
    this.component = null;
    this.animationList = new Array();
    this.animationSize = 0;
    this.currentClip = null;
    this.loops = 0;
    this.currentLoop = 0;
    this.infinity = false;
    this.errorConfig = false;
    this.stayLastFrame = false;
    this.finish = false;
    this.sys = null;
    this.state = '';
    this.chosenIndex = -1;
  }

  beforeStart(sys) {
    this.sys = sys;
    this.errorConfig = false;
    this.component = this.inputs[2]();
    if (!this.component || false === this.component.isInstanceOf('Animator')) {
      this.errorConfig = true;
      return;
    }
    this.loops = this.inputs[4]();
    if (this.loops === 0) {
      console.error('animation loops 0 times !!');
      this.errorConfig = true;
      return;
    }
    if (this.loops === -1) {
      this.infinity = true;
    }
    this.stayLastFrame = this.inputs[5]();
    this.animationList = this.component.animations;
    this.animationSize = this.animationList.size();
    if (this.animationSize < 1) {
      console.error('animations size is 0 !!');
      this.errorConfig = true;
      return;
    }
    let prevClip = this.currentClip;
    this.chosenIndex = this.inputs[3]();
    if (this.chosenIndex >= this.animationSize || this.chosenIndex < 0) {
      console.error('animation chooseIndex error !!');
      this.errorConfig = true;
      return;
    }
    let chooseAnim = this.animationList.get(this.chosenIndex);
    if (!chooseAnim) {
      console.error('get chosen animation error !!');
      this.errorConfig = true;
      return;
    }
    this.currentClip = chooseAnim.getClip('', this.component);
    if (!this.currentClip) {
      console.error('get clip from animation error !!');
      this.errorConfig = true;
      return;
    }
    sys.eventListener.registerListener(sys.script, Amaz.AnimazEventType.ANIM_END, this.currentClip, sys.script);
  }

  execute(index) {
    if (this.nexts[0]) {
      this.nexts[0]();
    }
    if (this.errorConfig) {
      return;
    }
    // if (this.finish === true && index !== 0) {
    //   return;
    // }
    if (this.component.entity.visible === false) {
      this.component.entity.visible = true;
    }
    if (index === 0) {
      this.finish = false;
      this.currentLoop = 0;
      if (this.sys) {
        this.beforeStart(this.sys);
      }
      this.state = 'play';
      let clipPlaySpeed = this.currentClip.getSpeed();
      this.component.schedule(this.currentClip, 1, clipPlaySpeed);
      if (this.nexts[1]) {
        this.nexts[1]();
      }
    } else if (index === 1) {
      this.component.unschedule(this.currentClip);
      this.state = 'stop';
      if (this.nexts[2]) {
        this.nexts[2]();
      }
    }
    // else if (index === 2) {
    //   if (this.state !== 'play' && this.state !== 'resume') {
    //     return;
    //   }
    //   this.state = 'pause';
    //   this.component.unschedule(this.currentClip);
    // } else if (index === 3) {
    //   if (this.state !== 'pause') {
    //     return;
    //   }
    //   this.state = 'resume';
    //   let clipPlaySpeed = this.currentClip.getSpeed();
    //   this.component.schedule(this.currentClip, 1, clipPlaySpeed);
    // }
  }

  onCallBack(sys, clip, eventType) {
    if (eventType === Amaz.AnimazEventType.ANIM_END) {
      if (clip.equals(this.currentClip) && this.state !== 'stop') {
        this.currentLoop = this.currentLoop + 1;
        if (this.currentLoop >= this.loops && false === this.infinity) {
          this.component.unschedule(this.currentClip);
          if (this.stayLastFrame === false) {
            this.component.entity.visible = false;
          }
          this.finish = true;
        } else {
          let clipPlaySpeed = this.currentClip.getSpeed();
          this.component.schedule(this.currentClip, 1, clipPlaySpeed);
        }
      }
    }
  }

  onLateUpdate(dt) {
    if (this.finish) {
      if (this.nexts[3]) {
        this.nexts[3]();
      }
      this.finish = false;
    }
  }

  onDestroy(sys) {}
}

exports.CGAnimatorController = CGAnimatorController;
