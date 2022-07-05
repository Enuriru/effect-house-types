const amg = require('./amg');
const Amaz = effect.Amaz;

const K_FACEIDX = 'faceIdx';

const RAD_TO_DEG = 2.0 / 3.14159 * 180;

class FaceShapeController {

    constructor() {
        this.name = 'FaceShapeController'
        this.renderers = [];
        this.renderersRestoreState = [];
        this.faceTransform = null;
        this.faceMeshInfo = null;
        this.properties = null;
        this.previousState = {detected: true};
    }

    onInit() {
        console.warn('[FaceShapeController]: onInit');
        amg.Head.getInstance().init();
    }

    onStart() {
        console.warn('[FaceShapeController]: onStart');
        this.properties = this.component().properties;
        this.renderers = this.entity.getComponentsRecursive('Renderer');
        for (let i = 0; i < this.renderers.size(); i++) {
            const renderer = this.renderers.get(i);
            this.renderersRestoreState[i] = renderer.enabled;
        }
        this.faceTransform = this.getComponent('Transform');
        if (this.faceTransform === null) {
            return;
        }

        amg.Head.on(amg.FaceEvent.Detected, (id) => this.updateVisiblity());
        amg.Head.on(amg.FaceEvent.Lost, (id) => this.updateVisiblity());
    }

    updateVisiblity() {
        const isFaceDetected = this._isCurrentFaceDetected();
        const faceFound = !this.previousState.detected && isFaceDetected;
        const faceLost = this.previousState.detected && !isFaceDetected;
        for (let i = 0; i < this.renderers.size(); i++) {
            const renderer = this.renderers.get(i);
            if (faceLost) {
                // Store state of renderer when face is lost
                this.renderersRestoreState[i] = renderer.enabled;
            } else if (faceFound) {
                // Restore state of renderer after face is refound
                renderer.enabled = this.renderersRestoreState[i];
            }
        }
    }

    onUpdate(dt) {
        const isFaceDetected = this._isCurrentFaceDetected();

        for (let i = 0; i < this.renderers.size(); i++) {
            const renderer = this.renderers.get(i);
            if (!isFaceDetected) {
                if (!this.previousState.detected && renderer.enabled) {
                    // If there is a runtime change in renderer enabling when no face detected, update restored state
                    this.renderersRestoreState[i] = renderer.enabled;
                }
                renderer.enabled = false;
            }
        }

        this.previousState.detected = isFaceDetected;
        if (!isFaceDetected) {
            return;
        }

        const camera = this._getFaceCamera();

        // follow face transform
        this._setFaceTransform(camera);
    }

    /* 
     * @return this attached component, since this property does not exist for JS Scripts
     */ 
    component() {
        const jsScriptComps = this.entity.getComponents('JSScriptComponent');
        for (let i = 0; i <  jsScriptComps.size(); i++) {
            const comp = jsScriptComps.get(i);
            if (comp.path === 'js/FaceShapeController.js') {
                return comp;
            }
        }
    }

    /* 
     * @return true if property face index is found by algorithm result, false otherwise
     */ 
    _isCurrentFaceDetected() {
        const faceCount = amg.Head.faces.length;
        let faceIdx = this._loadCurrentParams(K_FACEIDX);
        if (faceIdx < 0 || faceIdx >= 5 || faceIdx === null) {
            faceIdx = 0;
        }

        let isFaceDetected = true;
        if (faceCount <= faceIdx) {
            isFaceDetected = false;
        } else {
            const face = amg.Head.faces[faceIdx];
            if (!face) {
                return false;
            }
            this.faceMeshInfo = face.faceMesh
            if (this.faceMeshInfo === null) {
                isFaceDetected = false;
            }
        }
        return isFaceDetected;
    }

    _loadCurrentParams(key) {
        return this.properties.get(key)
    }

    _getFaceCamera() {
        const entities = this.scene.entities;
        for(let i = 0; i < entities.size(); i++) {
            const ent = entities.get(i);
            const cameras = ent.getComponentsRecursive('Camera');
            for (let j = 0; j < cameras.size(); j++) {
                const camera = cameras.get(j);
                if (camera.layerVisibleMask.test(this.entity.layer)) {
                  return camera;
                }
              }
        }
        return;
    }

    _setFaceTransform(camera) {
        let oriMVP = new Amaz.Matrix4x4f();
        oriMVP.copy(this.faceMeshInfo.mvp);
        let oriModel = new Amaz.Matrix4x4f();
        oriModel.copy(this.faceMeshInfo.modelMatrix);
        let faceModelInv = new Amaz.Matrix4x4f();
        faceModelInv.copy(oriModel);
        faceModelInv.invert_Full();
        oriMVP.mul(faceModelInv);
        const fov = Math.atan(1.0 / oriMVP.get(1, 1)) * RAD_TO_DEG;
        camera.fovy = fov;
        camera.type = Amaz.CameraType.PERSPECTIVE;
        const cameraTransform = camera.entity.getComponent('Transform');
        const cameraPos = cameraTransform.getWorldPosition();
        oriModel.addTranslate(cameraPos);
        this.faceTransform.setWorldMatrix(oriModel);
    }
}

exports.FaceShapeController = FaceShapeController;
