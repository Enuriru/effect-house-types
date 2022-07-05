/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line node/no-missing-require
const amg = require('./amg');

const Amaz = effect.Amaz;
class FullBodyAvatarSystem {
  constructor() {
    this.name = 'FullBodyAvatarSystem';
  }
  onInit() {
  }

  onStart() {
    this.on(Amaz.AMGListenerType.ALWAYS_INVOKE_TYPE, 'onCallback');
    amg.Body3D.on(amg.BodyEvent.Detected, this.onDetect);
    amg.Body3D.on(amg.BodyEvent.Lost, this.onLost);
  }
  //callback function for Body2D detect, make console logs
  onDetect() {
    // console.log('[Body3D]Body3D Detected');
  }
  //callback function for Body2D lost, make console logs
  onLost() {
    // console.log('[Body3D]Body3D Lost');
  }

  onUpdate(dt) {
  }

  // onComponentAdded(comp) {}
}

exports.FullBodyAvatarSystem = FullBodyAvatarSystem;
