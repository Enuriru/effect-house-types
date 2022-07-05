const Amaz = effect.Amaz;
const handCenterIndex = 21;
const handCenterHelpIndex = 0;
const thumbIndex = 3;
const thumbHelpIndex = 2;
const indexFingerIndex = 7;
const indexFingerHelpIndex = 5;
const middleFingerIndex = 11;
const middleFingerHelpIndex = 9;
const ringFingerIndex = 15;
const ringFingerHelpIndex = 13;
const pinkieIndex = 19;
const pinkieHelpIndex = 17;
const wristIndex = 0;
const wristHelpIndex = 21;
const thumbTopIndex = 4;
const indexFingerTopIndex = 8;
const middleFingerTopIndex = 12;
const ringFingerTopIndex = 16;
const pinkieTopIndex = 20;

let indexFingerTipId = handCenterIndex;
let indexFingerHelpId = handCenterHelpIndex;

class HandCapture {
  constructor() {
    this.name = 'JSComponent';
    this.handTransform = null;
    this._onStarted = false;
    this.fingerID = 0;
    this.distance = -20;
  }
  onStart() {
    this.handTransform = this.entity.getComponent('Transform');
    this.camera = this.getCamera();
    this.cameraTransform = this.camera.entity.getComponent('Transform');
  }
  getCamera() {
    let entities = this.entity.scene.entities;
    for (let i = 0; i < entities.size(); i++) {
      let ent = entities.get(i);
      let cameras = ent.getComponentsRecursive('Camera');
      if (0 < cameras.size()) return cameras.get(0);
    }
    return null;
  }
  /*
   * @return this attached component, since this property does not exist for JS Scripts
   */
  component() {
    const jsScriptComps = this.entity.getComponents('JSScriptComponent');
    for (let i = 0; i < jsScriptComps.size(); i++) {
      const comp = jsScriptComps.get(i);
      const className = comp.getScript().className;
      if (className === this.script.className) {
        return comp;
      }
    }
  }
  getChildrenEntities() {
    let ret = [];
    if (this.entity === undefined) {
      return ret;
    }

    const collectChildren = entity => {
      const thisTransform = entity.getComponent('Transform');
      const childrenTransforms = thisTransform.children;
      for (let idx = 0; idx < childrenTransforms.size(); ++idx) {
        const childTransform = childrenTransforms.get(idx);
        ret.push(childTransform.entity);
        collectChildren(childTransform.entity);
      }
    };

    collectChildren(this.entity);

    return ret;
  }

  calculateAngle(Point1, Point2) {
    let dtX = Point1.x - Point2.x;
    let dtY = Point1.y - Point2.y;
    let angle = Math.atan2(dtY, dtX) - Math.PI / 2;
    return angle;
  }
  onUpdate(dt) {
    const componentProperties = this.component().properties;

    this.distance = componentProperties.get('distanceToScreen');

    this.fingerID = componentProperties.get('handAnchor');
    if (this.fingerID === 0) {
      indexFingerTipId = handCenterIndex;
      indexFingerHelpId = handCenterHelpIndex;
    } else if (this.fingerID === 1) {
      indexFingerTipId = thumbTopIndex;
      indexFingerHelpId = thumbHelpIndex;
    } else if (this.fingerID === 2) {
      indexFingerTipId = indexFingerTopIndex;
      indexFingerHelpId = indexFingerHelpIndex;
    } else if (this.fingerID === 3) {
      indexFingerTipId = middleFingerTopIndex;
      indexFingerHelpId = middleFingerHelpIndex;
    } else if (this.fingerID === 4) {
      indexFingerTipId = ringFingerTopIndex;
      indexFingerHelpId = ringFingerHelpIndex;
    } else if (this.fingerID === 5) {
      indexFingerTipId = pinkieTopIndex;
      indexFingerHelpId = pinkieHelpIndex;
    } else if (this.fingerID === 6) {
      indexFingerTipId = thumbIndex;
      indexFingerHelpId = thumbHelpIndex;
    } else if (this.fingerID === 7) {
      indexFingerTipId = indexFingerIndex;
      indexFingerHelpId = indexFingerHelpIndex;
    } else if (this.fingerID === 8) {
      indexFingerTipId = middleFingerIndex;
      indexFingerHelpId = middleFingerHelpIndex;
    } else if (this.fingerID === 9) {
      indexFingerTipId = ringFingerIndex;
      indexFingerHelpId = ringFingerHelpIndex;
    } else if (this.fingerID === 10) {
      indexFingerTipId = pinkieIndex;
      indexFingerHelpId = pinkieHelpIndex;
    } else if (this.fingerID === 11) {
      indexFingerTipId = wristIndex;
      indexFingerHelpId = wristHelpIndex;
    }

    let angle = 0;
    let algorithmManager = Amaz.AmazingManager.getSingleton('Algorithm');
    let result = algorithmManager.getAEAlgorithmResult();
    let handCount = result.getHandCount();
    let childEntities = this.getChildrenEntities();
    let isVisible = handCount > 0;
    for (let i = 0; i < childEntities.length; i++) {
      childEntities[i].selfvisible = isVisible;
    }
    if (handCount > 0) {
      let handInfo = result.getHandInfo(0);
      if (handInfo !== null) {
        let key_points_is_detect = handInfo.key_points_3d_is_detect;
        if (key_points_is_detect) {
          let destxyCoord = handInfo.key_points_xy.get(indexFingerTipId);
          let destxyHelp = handInfo.key_points_xy.get(indexFingerHelpId);
          if (indexFingerIndex === wristIndex) {
            angle = this.calculateAngle(destxyHelp, destxyCoord);
          } else {
            angle = this.calculateAngle(destxyCoord, destxyHelp);
          }
          if (angle === NaN) {
            angle = (-handInfo.rot_angle / 180) * Math.PI;
          }
          let destCoord = new Amaz.Vector3f(destxyCoord.x, destxyCoord.y, this.distance - this.camera.zNear + 4);
          let drawCoord = this.camera.viewportToWorldPoint(destCoord);
          this.handTransform.setWorldPosition(drawCoord);
        }
      }
    }

    this.rotate = componentProperties.get('rotateAxisZ');
    let entityRotate = this.handTransform.getWorldOrientation();
    let destRotate = entityRotate.quaternionToEuler();
    if (this.rotate === false) {
      destRotate.z = 0;
    } else {
      destRotate.z = angle;
    }
    entityRotate = entityRotate.eulerToQuaternion(destRotate);
    this.handTransform.setWorldOrientation(entityRotate);
  }
  onLateUpdate(dt) {}
}
exports.HandCapture = HandCapture;
