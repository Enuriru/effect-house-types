const Amaz = effect.Amaz;

class AnimatorProperty {
  constructor() {
    this.modeMap = {
      Loop: 0,
      PingPong: -1,
      Clamp: -2,
      Once: 1,
    };
    this.reverseModeMap = {
      0: 'Loop',
      '-1': 'PingPong',
      '-2': 'Clamp',
      1: 'Once',
    };
  }

  getRunningClip(animator) {
    const layer = animator.getAnimationLayer(0);
    const clip = layer.currentState.clips.get(0);
    return clip;
  }

  initWrapModes(objects, ...modes) {
    const animator = objects[0];
    const animations = animator.animations;
    for (let i = 0; i < animations.size(); ++i) {
      const animaz = animations.get(i);
      const clip = animaz.getClip('', animator);
      clip.setWrapMode(modes[i]);
    }
  }

  setWrapMode(animator, animazName, mode) {
    const animations = animator.animations;
    for (let i = 0; i < animations.size(); ++i) {
      const animaz = animations.get(i);
      if (animaz.name === animazName) {
        const clip = animaz.getClip('', animator);
        clip.setWrapMode(mode);
        return;
      }
    }
  }

  getWrapMode(animator, animazName) {
    const animations = animator.animations;
    for (let i = 0; i < animations.size(); ++i) {
      const animaz = animations.get(i);
      if (animaz.name === animazName) {
        const clip = animaz.getClip('', animator);
        return clip.getWrapMode();
      }
    }
  }

  playClip(animator, animazName) {
    const animations = animator.animations;
    for (let i = 0; i < animations.size(); ++i) {
      const animaz = animations.get(i);
      if (animaz.name === animazName) {
        const clip = animaz.getClip('', animator);
        animator.play(clip.name, clip.getWrapMode());
        return;
      }
    }
  }

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }

    if (property === 'playback') {
      const animator = objects[0];
      this.playClip(animator, value);
    } else if (property.startsWith('playMode ')) {
      const animator = objects[0];
      const animazName = property.substring(property.indexOf(' ') + 1);
      const animations = animator.animations;
      const runningClip = this.getRunningClip(animator);
      for (let i = 0; i < animations.size(); ++i) {
        const animaz = animations.get(i);
        if (animaz.name === animazName) {
          const clip = animaz.getClip('', animator);
          clip.setWrapMode(this.modeMap[value]);
          if (clip === runningClip) {
            clip.play();
          }
          return;
        }
      }
    }
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }

    if (property === 'playback') {
      const animator = objects[0];
      const runningClip = this.getRunningClip(animator);
      const animations = animator.animations;
      for (let i = 0; i < animations.size(); ++i) {
        const animaz = animations.get(i);
        const clip = animaz.getClip('', animator);
        if (clip === runningClip) {
          return animaz.name;
        }
      }
    } else if (property.startsWith('playMode ')) {
      const animator = objects[0];
      const animazName = property.substring(property.indexOf(' ') + 1);
      const mode = this.getWrapMode(animator, animazName);
      return this.reverseModeMap[`${mode}`];
    }
  }
}

exports.AnimatorProperty = AnimatorProperty;
