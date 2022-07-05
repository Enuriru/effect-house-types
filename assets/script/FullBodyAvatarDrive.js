const amg = require('./amg');

const Amaz = effect.Amaz;
class FullBodyAvatarDrive {
  constructor() {
    this.name = 'FullBodyAvatarDrive';
    Amaz.AmazingManager.init(1280, 720);
    this._onStarted = false;
    this.rootEntity = null;
    this.cameraTrans = null;
    this.cameraComp = null;
    this.boneTransform = {};
    this.boneInitOrientation = {};
    this.currBoneOrientation = {};
    this.followBody = true;
    this.modelRatio = 1.0;
    this.useModelScale = true;
    this.pelvisScale = new Amaz.Vector3f(1.0, 1.0, 1.0);
    this.horizontalOffset = 0.0;
    this.verticalOffset = 0.0;
    this.running = true;
    this.renderers = [];
    this.renderersInitEnabled = [];
    this.kBoneIds = [
      'ePelvis',
      'eLeftHip',
      'eRightHip',
      'eSpine',
      'eLeftKnee',
      'eRightKnee',
      'eSpine1',
      'eLeftAnkle',
      'eRightAnkle',
      'eSpine2',
      'eLeftFoot',
      'eRightFoot',
      'eNeck',
      'eLeftCollar',
      'eRightCollar',
      'eHead',
      'eLeftUpperArm',
      'eRightUpperArm',
      'eLeftForeArm',
      'eRightForeArm',
      'eLeftWrist',
      'eRightWrist',
      'eLeftHand',
      'eRightHand',
    ];
    this.kBoneNameMap = {
      ePelvis: 'Pelvis',
      eSpine: 'Spine1',
      eSpine1: 'Spine2',
      eSpine2: 'Spine3',
      eNeck: 'Neck',
      eHead: 'Head',
      eLeftCollar: 'L_Shoulder',
      eLeftUpperArm: 'L_UpperArm',
      eLeftForeArm: 'L_ForeArm',
      eLeftWrist: 'L_Hand',
      eRightCollar: 'R_Shoulder',
      eRightUpperArm: 'R_UpperArm',
      eRightForeArm: 'R_ForeArm',
      eRightWrist: 'R_Hand',
      eLeftHip: 'L_Thigh',
      eLeftKnee: 'L_Shin',
      eLeftAnkle: 'L_Foot',
      eRightHip: 'R_Thigh',
      eRightKnee: 'R_Shin',
      eRightAnkle: 'R_Foot',
    };

    //keys are children, values are parents
    this.parentMap = {
      eLeftHip: 'ePelvis',
      eLeftKnee: 'eLeftHip',
      eLeftAnkle: 'eLeftKnee',
      eRightHip: 'ePelvis',
      eRightKnee: 'eRightHip',
      eRightAnkle: 'eRightKnee',
      eSpine: 'ePelvis',
      eSpine1: 'eSpine',
      eSpine2: 'eSpine1',
      eNeck: 'eSpine2',
      eHead: 'eNeck',
      eLeftCollar: 'eSpine2',
      eLeftUpperArm: 'eLeftCollar',
      eLeftForeArm: 'eLeftUpperArm',
      eLeftWrist: 'eLeftForeArm',
      eLeftHand: 'eLeftWrist',
      eRightCollar: 'eSpine2',
      eRightUpperArm: 'eRightCollar',
      eRightForeArm: 'eRightUpperArm',
      eRightWrist: 'eRightForeArm',
      eRightHand: 'eRightWrist',
    };
    this.frameIndex = 0;
    this.step = 0.02;
    this.frameNum = 50;
  }
  ValidQuat(qua) {
    if (typeof qua === 'undefined') {
      return false;
    }
    const value = qua.x * qua.x + qua.y * qua.y + qua.z * qua.z + qua.w * qua.w;
    return Math.abs(value - 1.0) < 0.2;
  }
  //reset bones orientations T-pose
  //the three parameters below are used to slerp two quaternions
  ResetBones() {
    if (this.frameIndex < this.frameNum) {
      this.frameIndex = this.frameIndex + 1;
    }
    for (const boneId in this.kBoneNameMap) {
      const boneTransform = this.boneTransform[boneId];
      if (boneTransform && typeof this.currBoneOrientation[boneId] === 'undefined') {
        boneTransform.setWorldOrientation(this.boneInitOrientation[boneId]);
      } else {
        const beginQua = Amaz.Quaternionf.mul(this.currBoneOrientation[boneId], this.boneInitOrientation[boneId]);
        let endQua = new Amaz.Quaternionf(0.0, 0.0, 0.0, 1.0);
        if (boneTransform && typeof boneTransform !== 'undefined') {
          endQua = this.boneInitOrientation[boneId];
          const currQua = Amaz.Quaternionf.slerp(beginQua, endQua, this.frameIndex * this.step);
          boneTransform.setWorldOrientation(currQua);
        }
      }
    }
  }

  /* 
   * @return first found camera in same layer as entity, or null
   */ 
  getCamera() {
    const entities = this.scene.entities;
    for (let i = 0; i <  entities.size(); i++) {
      const entity = entities.get(i);
      const cameras = entity.getComponentsRecursive('Camera');
      for (let j = 0; j < cameras.size(); j++) {
        const camera = cameras.get(j);
        if (camera.layerVisibleMask.test(this.entity.layer)) {
          return camera;
        }
      }
    }
    // No visible camera in layer
    return null;
  }

  /* 
   * @return this attached component, since this property does not exist for JS Scripts
   */ 
  component() {
    return this.entity.getComponent('JSScriptComponent');
    // TODO: properly handle future case of multiple JS ScriptComps on 1 entity
    // const jsScriptComps = this.entity.getComponents('JSScriptComponent');
    // for (let i = 0; i <  jsScriptComps.size(); i++) {
    //   const comp = jsScriptComps.get(i);
    //   const className = comp.getScript().className;
    //   if (className === this.script.className) {
    //     return comp;
    //   }
    // }
  }


  onStart() {
    if (this._onStarted) {
      return;
    }
    this._onStarted = true;
    this.properties = this.component().properties;

    const cameraComp = this.getCamera();
    if (cameraComp) {
      this.cameraComp = cameraComp;
      this.cameraTrans =  cameraComp.entity.getComponent('Transform');
    }

    const rootEnt = this.entity;
    if (rootEnt) {
      this.rootEntity = rootEnt;
    }
    const rootTransform = this.rootEntity.getComponent('Transform');
    const identiyQuat = new Amaz.Quaternionf().identity();
    const identyVec3 = new Amaz.Vector3f(1.0, 1.0, 1.0);
    let rootTransformOri = identiyQuat;
    let rootTransformScale = identyVec3;
    if (rootTransform && typeof rootTransform !== 'undefined') {
      //  Store current orientation, reset to identity for getting initial rotations
      rootTransformOri = rootTransform.getWorldOrientation();
      rootTransformScale = rootTransform.worldScale;
      rootTransform.setWorldOrientation(identiyQuat);
      rootTransform.worldScale = identyVec3
    }

    // const componentProperties = this.component().properties;

    this.followBody = this.properties.get('followBody');
    for (const boneId in this.kBoneNameMap) {
      const boneTran = this.properties.get(this.kBoneNameMap[boneId]);
      if (boneTran && typeof boneTran !== 'undefined') {
        this.boneInitOrientation[boneId] = boneTran.getWorldOrientation();
        this.boneTransform[boneId] = boneTran;
      } else {
        // disable
        console.warn('full skeleton does not match');
      }
    }

    if (this.boneTransform['eSpine'] &&  this.boneTransform['ePelvis'] && this.boneTransform['eHead']) {
      const algoHeadPos = new Amaz.Vector3f(0.00498956, 0.3525724, 0.03653179);
      const algoPelvisPos = new Amaz.Vector3f(-0.00179506, -0.22333343, 0.02821913);
      const algoDist = algoHeadPos.distance(algoPelvisPos);
      const avatarHeadPos = this.boneTransform['eHead'].getWorldPosition();
      const avatarPelvisPos = this.boneTransform['ePelvis'].getWorldPosition();
      const avatarDist = avatarHeadPos.distance(avatarPelvisPos);
      this.modelRatio = algoDist / avatarDist;
      this.pelvisScale = this.boneTransform['ePelvis'].worldScale;
    } else {
      // If all the parameters needed to properly calculate the ratio aren't defined, don't rescale results
      this.useModelScale = false;
    }


    if (rootTransform && typeof rootTransform !== 'undefined') {
      // Set translation matrix back after getting initial rotations
      rootTransform.setWorldOrientation(rootTransformOri);
      rootTransform.worldScale = rootTransformScale;
    }

    this.renderers = this.entity.getComponentsRecursive('Renderer');
    for (let i = 0; i < this.renderers.size(); i++) {
      const renderer = this.renderers.get(i);
      this.renderersInitEnabled.push(renderer.enabled);
    }
    this.ResetBones();
  }

  onUpdate() {
    if (!this._onStarted) {
      this.onStart();
    }
    if (!this.running || typeof this.cameraComp === 'undefined') {
      this.frameIndex = this.frameNum;
      this.ResetBones();
      return;
    }
    let validTracking = true;
    let avatarInfo = null;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (typeof this.cameraTrans === 'undefined') {
        validTracking = false;
        break;
      }
      const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
      if (!amg.Body3D.trackingMode) {
        algMgr.setAlgorithmParamInt('', 'skeleton_0', 'base_skip_frames', 0);
        algMgr.setAlgorithmParamInt('', 'skeleton_0', 'skeleton_image_mode', 1);
        algMgr.setAlgorithmParamInt('', 'skeleton_0', 'skeleton_body_max_count', 2);
      } else {
        algMgr.setAlgorithmParamInt('', 'skeleton_0', 'base_skip_frames', -1);
      }
      const avatarCount = amg.Body3D.bodies.length;
      if (avatarCount < 1) {
        validTracking = false;
        break;
      }
      //get algorithm result
      avatarInfo = amg.Body3D.bodies[0];
      break;
    }

    // const componentProperties = this.component().properties;
    this.followBody = this.properties.get('followBody');
    const isDetected =  0 < amg.Body3D.bodies.length;

    const isVisible = this.properties.get('isVisible');
    for (let i = 0; i < this.renderers.size(); i++) {
      const renderer = this.renderers.get(i);
      if (!isDetected && this.followBody) {
        // If no Body is detected in scene, disable any renderers.
        renderer.enabled = false;
      } else {
        // Otherwise restore its initial enabled state based on visiblity.
        renderer.enabled = this.renderersInitEnabled[i] && isVisible;
      }
    }
    if (!validTracking) {
      return;
    }

    //handle Joint animation begin
    if (avatarInfo && avatarInfo.focalLength !== 0) {
      const tanAlgoHalfFov = (0.5 * avatarInfo.imageHeight) / avatarInfo.focalLength;
      // Not updating camera FOV right now, as it affects the whole scene.
      // Revisit if results are not satisfactory
      // this.cameraComp.fovy = (Math.atan(tanAlgoHalfFov) * 360) / Math.PI;
      const tanRealHalfFov = Math.tan((this.cameraComp.fovy * Math.PI) / 360);
      const factor = tanRealHalfFov / tanAlgoHalfFov;
      const factorVec3 = new Amaz.Vector3f(factor, factor, 1.0);
      const camMat = this.cameraTrans.getWorldMatrix();
      const camPos = this.cameraTrans.getWorldPosition();
      const camOri = this.cameraTrans.getWorldOrientation();
      const rootTransform = this.rootEntity.getComponent('Transform');
      //get joint rotations and positions
      const quaternions = avatarInfo.jointRotations;
      const joints = avatarInfo.jointPositions;
      //Calculate the scaling of the center point of the joint ball structure
      if (this.followBody) {
        const identity = new Amaz.Matrix4x4f().setIdentity();
        const modelScale = this.modelRatio * factor;
        if (rootTransform && typeof rootTransform !== 'undefined') {
          rootTransform.setWorldMatrix(identity);
        }
        if (this.boneTransform['ePelvis']) {
          const parentTransform = this.boneTransform['ePelvis'].parent;
          if (parentTransform && typeof rootTransform !== 'undefined') {
            parentTransform.setWorldMatrix(identity);
          }
          // Scale the pelvis by model ratio scaled by the initial scale of pelvis
          if (this.useModelScale) {
            this.boneTransform['ePelvis'].localScale = (new Amaz.Vector3f(modelScale, modelScale, modelScale)).scale(this.pelvisScale);
          }
        }
      }
      //Calculate the rotation of the child joints one by one based on the rotation returned by the algorithm and the rotation of the parent joint
      for (let i = 0; i < this.kBoneIds.length - 1; i++) {
        const boneId = this.kBoneIds[i];
        const parentId = this.parentMap[boneId];
        if (parentId && typeof parentId !== 'undefined') {
          if (i > 0 && i < quaternions.size() - 1) {
            const qua = quaternions.get(i);
            let quaParent = this.currBoneOrientation[parentId];
            if (quaParent && typeof quaParent === 'undefined') {
              quaParent = new Amaz.Quaternionf(0.0, 0.0, 0.0, 1.0);
            }
            this.currBoneOrientation[boneId] = Amaz.Quaternionf.mul(quaParent, qua);
          }
        } else {
          this.currBoneOrientation[boneId] = quaternions.get(i);
        }
        //based on the initial rotation and camera rotation of the articulated sphere structure, the setWorldOrientation of each joint
        const boneTransform = this.boneTransform[boneId];
        if (boneTransform && typeof boneTransform !== 'undefined') {
          const qua = this.currBoneOrientation[boneId];
          if (this.ValidQuat(qua)) {
            const worldori = Amaz.Quaternionf.mul(camOri, qua);
            let fworldori = Amaz.Quaternionf.mul(worldori, this.boneInitOrientation[boneId]);
            if (!this.followBody) {
              fworldori = Amaz.Quaternionf.mul(rootTransform.getWorldOrientation(), fworldori);
            }
            boneTransform.setWorldOrientation(fworldori);
          }
        }
      }
      //Update the coordinates of the center joint
      if (this.followBody) {
        const localOffset = Amaz.Quaternionf.rotateVectorByQuat(
          quaternions.get(0),
          new Amaz.Vector3f(this.horizontalOffset, this.verticalOffset, -0.03)
        );
        let pelvisJoint = joints.get(0);
        if (this.useModelScale) {
          pelvisJoint.scale(factorVec3);
        }

        pelvisJoint = pelvisJoint.add(localOffset);
        pelvisJoint = camMat.multiplyVector3(pelvisJoint);
        pelvisJoint = pelvisJoint.add(camPos);
        // follow pelvis joint
        if (this.boneTransform['ePelvis']) {
          this.boneTransform['ePelvis'].localPosition = pelvisJoint;
        }
        //    --- handle Joint animation end
      }
    }
  }
}

exports.FullBodyAvatarDrive = FullBodyAvatarDrive;
