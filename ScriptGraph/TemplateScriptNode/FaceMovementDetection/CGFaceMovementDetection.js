const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceMovementDetection extends BaseNode {
  constructor() {
    super();
    this.actionDetected = false;
    this.faceIndexMap = {
      'Face 0': 0,
      'Face 1': 1,
      'Face 2': 2,
      'Face 3': 3,
      'Face 4': 4,
      Any: -1,
    };
    this.faceActionMap = {
      'Eye Blink Left': Amaz.FaceAction.EYE_BLINK_LEFT,
      'Eye Blink Right': Amaz.FaceAction.EYE_BLINK_RIGHT,
      'Eye Blink Both': Amaz.FaceAction.EYE_BLINK,
      'Eye Blink Either': Amaz.FaceAction.EYE_BLINK,
      'Mouth Open': Amaz.FaceAction.MOUTH_AH,
      'Mouth Pout': Amaz.FaceAction.MOUTH_POUT,
      'Eyebrow Wiggle': Amaz.FaceAction.BROW_JUMP,
    };
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  bothEyeBlink(face) {
    return face.hasAction(Amaz.FaceAction.EYE_BLINK_LEFT) && face.hasAction(Amaz.FaceAction.EYE_BLINK_RIGHT);
  }

  onUpdate(sys, dt) {
    let whichFace = this.inputs[0]();
    let movement = this.inputs[1]();

    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult !== null && whichFace !== null && movement !== null) {
      const index = this.faceIndexMap[whichFace];
      const action = this.faceActionMap[movement];
      if (index === undefined || action === undefined) {
        return;
      }

      let hasAction = false;
      if (index === -1) {
        for (let i = 0; i < 5; ++i) {
          const face = algResult.getFaceBaseInfo(i);
          if (face) {
            if (movement === 'Eye Blink Both') {
              hasAction = hasAction || this.bothEyeBlink(face);
            } else {
              hasAction = hasAction || face.hasAction(action);
            }
          }
        }
      } else {
        const face = algResult.getFaceBaseInfo(index);
        if (face) {
          if (movement === 'Eye Blink Both') {
            hasAction = this.bothEyeBlink(face);
          } else {
            hasAction = face.hasAction(action);
          }
        }
      }
      if (!this.actionDetected && hasAction) {
        if (this.nexts[0]) {
          this.nexts[0]();
        }
      }
      if (hasAction) {
        if (this.nexts[1]) {
          this.nexts[1]();
        }
      }
      if (this.actionDetected && !hasAction) {
        if (this.nexts[2]) {
          this.nexts[2]();
        }
      }
      if (!hasAction) {
        if (this.nexts[3]) {
          this.nexts[3]();
        }
      }
      this.actionDetected = hasAction;
    }
  }
}

exports.CGFaceMovementDetection = CGFaceMovementDetection;
