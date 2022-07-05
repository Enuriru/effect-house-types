const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGGestureDetection extends BaseNode {
  constructor() {
    super();
    this.gestureDetected = false;
    this.handIndexMap = {
      'Hand 0': 0,
      'Hand 1': 1,
      Either: -1,
    };
    this.handActionMap = {
      'Backhand 3-Finger Pointing Up': Amaz.HandAction.THREE,
      '4-Finger Pointing Up': Amaz.HandAction.FOUR,
      Fist: Amaz.HandAction.FIST,
      'Open Palm': Amaz.HandAction.HAND_OPEN,
      '"I Love You"': Amaz.HandAction.ROCK,
      Horns: Amaz.HandAction.ROCK2,
      'Index Pointing up': Amaz.HandAction.INDEX_FINGER_UP,
      Victory: Amaz.HandAction.VICTORY,
      'Thumb up': Amaz.HandAction.THUMB_UP,
      'Hand Heart(Thumb Up)': Amaz.HandAction.HEART_A,
      'Hand Heart(Thumb Down)': Amaz.HandAction.HEART_B,
      'Open Fist Heart': Amaz.HandAction.HEART_C,
      'Finger Heart': Amaz.HandAction.HEART_D,
      'Index Pointing': Amaz.HandAction.PISTOL,
      '2-Finger Pointing': Amaz.HandAction.PISTOL2,
      '3-Finger Pointing Up': Amaz.HandAction.SWEAR,
      OK: Amaz.HandAction.OK,
      '"Call Me"': Amaz.HandAction.PHONECALL,
      'V(Thumb and Index)': Amaz.HandAction.BIG_V,
      'Touching Palms': Amaz.HandAction.NAMASTE,
      'Kung Fu Salute(Fist Uncovered)': Amaz.HandAction.BEG,
      '"Pray"': Amaz.HandAction.PRAY,
      'Palm up': Amaz.HandAction.PLAM_UP,
      'Kung Fu Salute (Fist Covered)': Amaz.HandAction.THANKS,
      'Wrist V': Amaz.HandAction.HOLDFACE,
      Salute: Amaz.HandAction.SALUTE,
      'Palm To Front': Amaz.HandAction.SPREAD,
      'Pinched Fingers': Amaz.HandAction.CABBAGE,
      'Thumb down': Amaz.HandAction.THUMB_DOWN,
      'Index and Middle Pointing Up': Amaz.HandAction.DOUBLE_FINGER_UP,
    };

    this.twoHandGesture = false;
    this.indexMap = {};
  }

  updateMap() {
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    const count = algResult.getHandCount();
    if (count === 0) {
      this.indexMap[0] = undefined;
      this.indexMap[1] = undefined;
    } else if (count === 1) {
      this.indexMap[0] = 0;
      this.indexMap[1] = undefined;
    } else {
      const hand0 = algResult.getHandInfo(0);
      const hand1 = algResult.getHandInfo(1);
      const id0 = hand0.ID;
      const id1 = hand1.ID;
      if (id0 < id1) {
        this.indexMap[0] = 0;
        this.indexMap[1] = 1;
      } else {
        this.indexMap[0] = 1;
        this.indexMap[1] = 0;
      }
    }
  }

  onUpdate(sys, dt) {
    this.updateMap();

    const whichHand = this.inputs[0]();
    const gesture = this.inputs[1]();

    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult && whichHand !== null && gesture !== null) {
      const index = this.handIndexMap[whichHand];
      const action = this.handActionMap[gesture];

      if (index === undefined || action === undefined) {
        return;
      }

      let hasAction = false;
      if (index === -1) {
        for (let i = 0; i < 2; ++i) {
          const actualIndex = this.indexMap[i];
          if (actualIndex !== undefined) {
            const hand = algResult.getHandInfo(actualIndex);
            if (hand) {
              hasAction = hasAction || hand.action === action;
            }
          }
        }
      } else {
        const actualIndex = this.indexMap[index];
        if (actualIndex !== undefined) {
          const hand = algResult.getHandInfo(actualIndex);
          if (hand) {
            hasAction = hand.action === action;
          }
        }
      }

      if (this.nexts[0] && hasAction && !this.gestureDetected) {
        this.nexts[0]();
      }
      if (this.nexts[1] && hasAction) {
        this.nexts[1]();
      }
      if (this.nexts[2] && this.gestureDetected && !hasAction) {
        this.nexts[2]();
      }
      if (this.nexts[3] && !hasAction) {
        this.nexts[3]();
      }
      this.gestureDetected = hasAction;
    }
  }
}

exports.CGGestureDetection = CGGestureDetection;
