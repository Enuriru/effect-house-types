const Amaz = effect.Amaz;

const { InsetRenderer } = require('InsetRenderer');
const { InsetConstants } = require('InsetConstants');
const Keys = InsetConstants.Keys;

// ------ HUMAN FACE CONSTANTS ------

// Face 106 cutout points
const FACE_106_CUTOUT_POINTS = {};
FACE_106_CUTOUT_POINTS[Keys.RIGHT_EYE] = [62, 76, 63, 58, 59, 75, 60, 61];
FACE_106_CUTOUT_POINTS[Keys.LEFT_EYE] = [52, 53, 72, 54, 55, 56, 73, 57];
FACE_106_CUTOUT_POINTS[Keys.RIGHT_BROW] = [39, 40, 41, 42, 71, 70, 69, 68];
FACE_106_CUTOUT_POINTS[Keys.LEFT_BROW] = [33, 34, 35, 36, 67, 66, 65, 64];
FACE_106_CUTOUT_POINTS[Keys.MOUTH] = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95];
FACE_106_CUTOUT_POINTS[Keys.INNER_MOUTH] = [96, 97, 98, 99, 100, 101, 102, 103];
FACE_106_CUTOUT_POINTS[Keys.HEAD] = [35, 40, 32, 24, 20, 19, 18, 16, 14, 13, 12, 8, 0];
FACE_106_CUTOUT_POINTS[Keys.NOSE] = [43, 81, 83, 51, 50, 49, 48, 47, 82, 80]; // Two points removed
// FACE_106_CUTOUT_POINTS[NOSE] = [78, 43, 79, 81, 83, 51, 50, 49, 48, 47, 82, 80]; // All points

// Face extra cutout points
const FACE_EXTRA_CUTOUT_POINTS = {};
// Face 240
FACE_EXTRA_CUTOUT_POINTS[Keys.RIGHT_EYE] = [21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
FACE_EXTRA_CUTOUT_POINTS[Keys.LEFT_EYE] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
FACE_EXTRA_CUTOUT_POINTS[Keys.RIGHT_BROW] = [7, 8, 9, 10, 11, 12, 5, 4, 3, 2, 1, 0];
FACE_EXTRA_CUTOUT_POINTS[Keys.LEFT_BROW] = [0, 1, 2, 3, 4, 5, 12, 11, 10, 9, 8, 7];
FACE_EXTRA_CUTOUT_POINTS[Keys.MOUTH] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 61, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 60];
FACE_EXTRA_CUTOUT_POINTS[Keys.INNER_MOUTH] = [62, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 63, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30];
// Face 280
FACE_EXTRA_CUTOUT_POINTS[Keys.LEFT_IRIS] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
FACE_EXTRA_CUTOUT_POINTS[Keys.RIGHT_IRIS] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

// Enum map to avoid string compare
const FACE_EXTRA_ENUM = {};
FACE_EXTRA_ENUM[Keys.RIGHT_EYE] = 1;
FACE_EXTRA_ENUM[Keys.LEFT_EYE] = 2;
FACE_EXTRA_ENUM[Keys.RIGHT_BROW] = 3;
FACE_EXTRA_ENUM[Keys.LEFT_BROW] = 4;
FACE_EXTRA_ENUM[Keys.MOUTH] = 5;
FACE_EXTRA_ENUM[Keys.INNER_MOUTH] = 6;
FACE_EXTRA_ENUM[Keys.LEFT_IRIS] = 7;
FACE_EXTRA_ENUM[Keys.RIGHT_IRIS] = 8;

// ------ PET FACE CONSTANTS ------

// Property to pet face type enums map
const FACE_TYPE = {};
FACE_TYPE[Keys.CAT] = Amaz.FacePetType.CAT;
FACE_TYPE[Keys.DOG] = Amaz.FacePetType.DOG;
FACE_TYPE[Keys.HUMAN] = Amaz.FacePetType.HUMAN;

// Map of cutout points for cat face insets
const CAT_FACE_CUTOUT_POINTS = {};
CAT_FACE_CUTOUT_POINTS[Keys.RIGHT_EYE] = [76, 75, 74, 73, 72, 79, 78, 77];
CAT_FACE_CUTOUT_POINTS[Keys.LEFT_EYE] = [64, 65, 66, 67, 68, 69, 70, 71];
CAT_FACE_CUTOUT_POINTS[Keys.RIGHT_EAR] = [19, 33, 34, 35, 36, 37, 38, 39, 16, 17, 18];
CAT_FACE_CUTOUT_POINTS[Keys.LEFT_EAR] = [0, 26, 27, 28, 29, 30, 31, 32, 23, 24, 25];
CAT_FACE_CUTOUT_POINTS[Keys.NOSE] = [45, 44, 46, 47];
CAT_FACE_CUTOUT_POINTS[Keys.MOUTH] = [52, 51, 50, 49, 48, 57, 58, 59, 60, 59, 58, 57, 56, 55, 54, 53];
CAT_FACE_CUTOUT_POINTS[Keys.NOSE_MOUTH] = [44, 46, 60, 9, 8, 7, 52, 45];
CAT_FACE_CUTOUT_POINTS[Keys.HEAD] = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 26, 27, 28, 29, 30, 31, 32, 23, 22, 21, 20, 19, 33, 34, 35, 36, 37, 38, 39];

// Map of cutout points for dog face insets
// TODO: update these with the new keypoints (these no longer work)
const DOG_FACE_CUTOUT_POINTS = {};
DOG_FACE_CUTOUT_POINTS[Keys.RIGHT_EYE] = [87, 86, 85, 84, 83, 82, 81, 80];
DOG_FACE_CUTOUT_POINTS[Keys.LEFT_EYE] = [72, 73, 74, 75, 76, 77, 78, 79];
DOG_FACE_CUTOUT_POINTS[Keys.RIGHT_EAR] = [16, 17, 18, 19, 33, 34, 35, 36, 37, 38, 39];
DOG_FACE_CUTOUT_POINTS[Keys.LEFT_EAR] = [23, 24, 25, 0, 26, 27, 28, 29, 30, 31, 32];
DOG_FACE_CUTOUT_POINTS[Keys.NOSE] = [52, 51, 50, 49, 48, 47, 46, 45];
DOG_FACE_CUTOUT_POINTS[Keys.MOUTH] = [71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56];
DOG_FACE_CUTOUT_POINTS[Keys.NOSE_MOUTH] = [43, 12, 11, 10, 9, 8, 7, 6, 5, 4];
DOG_FACE_CUTOUT_POINTS[Keys.HEAD] = [26, 27, 28, 29, 30, 31, 32, 23, 22, 21, 20, 19, 33, 34, 35, 36, 37, 38, 39, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

// Class: FaceInset
// Responsible for linking UI properties to the base class for human/cat/dog face inset
class FaceInset extends InsetRenderer {

    constructor() {
        super();
        this.framecounter = 0;
    }

    // onStart
    onStart() {
        this._comp = this.component();
        this.properties = this._comp.properties;
        super.onStart();
    }

    // onUpdate
    // Updates the face inset depending on whether or not the selected inset is a human or animal
    onUpdate(dt) {
        /* Prevent placeholder face inset material from displaying */
        if (this.framecounter < 2) {
            debugger;
            const renderer = this.entity.getComponent("MeshRenderer");
            if (renderer) {
                renderer.enabled = false; 
            }
            this.framecounter++;
        }
        var algResult = Amaz.AmazingManager.getSingleton('Algorithm').getAEAlgorithmResult();
        if (FACE_TYPE[this.get(Keys.FACE_TYPE)] == FACE_TYPE[Keys.HUMAN]) {
            this._humanFaceUpdate(algResult);
        } else if (FACE_TYPE[this.get(Keys.FACE_TYPE)] == FACE_TYPE[Keys.CAT] ||
            FACE_TYPE[this.get(Keys.FACE_TYPE)] == FACE_TYPE[Keys.DOG]) {
            this._loge("Pet face type is not yet supported");
            // this._petFaceUpdate(algResult);
        } else {
            this._loge("No face type selected");
        }
    }

    _log(msg) {
        console.warn("FaceInsetLog", msg);
    }

    _loge(msg) {
        console.warn("FaceInsetError", msg);
    }

    // _humanFaceUpdate
    // If a human face is available, send the keypoints, indices, and rotation to the base class
    _humanFaceUpdate(algResult) {
        const faceIndex = this.get(Keys.FACE_INDEX);
        const faceInfo = algResult.getFaceBaseInfo(faceIndex);
        if (faceInfo) {
            const eulerAngles = new Amaz.Vector3f(faceInfo.pitch, faceInfo.yaw, faceInfo.roll);
            const cutoutPointIndices = this._getInsetKeypointIndices();
            if (this._shouldUseFaceExtra()) {
                const faceExtraInfo = algResult.getFaceExtraInfo(faceIndex);
                if (faceExtraInfo) {
                    const keypoints = this._getFaceExtraKeypoints(faceExtraInfo);
                    this._setInsetProperties(keypoints, cutoutPointIndices, eulerAngles);
                } else {
                    this._setInsetProperties(); // set as undefined
                }
            } else {
                const keypoints = faceInfo.points_array;
                this._setInsetProperties(keypoints, cutoutPointIndices, eulerAngles);
            }
        } else {
            this._setInsetProperties();  // set as undefined
        }
    }

    // _petFaceUpdate
    // If a cat or dog face is available, send the keypoints, indices, and rotation to the base class
    _petFaceUpdate(result) {
        const index = Math.floor(this.get(Keys.FACE_INDEX));
        // const petFaceInfo = result.getPetFaceInfo(this.get(Keys.FACE_INDEX)); // Disabled for now
        if (petFaceInfo && petFaceInfo.face_pet_type == FACE_TYPE[this.get(Keys.FACE_TYPE)] && petFaceInfo.face_pet_type != FACE_TYPE[HUMAN]) {
            const keypoints = petFaceInfo.points_array;
            let insetKeypointIndices = this._getInsetKeypointIndices();
            const eulerAngles = Amaz.Vector3f(petFaceInfo.pitch, petFaceInfo.yaw, -petFaceInfo.roll);
            this._setInsetProperties(keypoints, insetKeypointIndices, eulerAngles);
        } else {
            this._setInsetProperties(); // set as undefined
        }
    }

    // _shouldUseFaceExtra
    // Returns whether or not to use faceExtra keypoints depending on selected properties
    _shouldUseFaceExtra() {
        return this.get(Keys.USE_HIGH_QUALITY) && FACE_EXTRA_ENUM[this.get(Keys.FACE_AREA)] != null;
    }

    // _getInsetKeypointIndices
    // Returns the indices for the selected face type and keypoint resolution
    _getInsetKeypointIndices() {
        const faceType = FACE_TYPE[this.get(Keys.FACE_TYPE)];
        const faceAreaKey = this.get(Keys.FACE_AREA);
        if (faceType == Amaz.FacePetType.HUMAN) {
            if (this._shouldUseFaceExtra()) {
                return FACE_EXTRA_CUTOUT_POINTS[faceAreaKey];
            } else {
                return FACE_106_CUTOUT_POINTS[faceAreaKey];
            }
        } else if (faceType == Amaz.FacePetType.DOG) {
        } else if (faceType == Amaz.FacePetType.CAT) {
            return CAT_FACE_CUTOUT_POINTS[faceAreaKey];
        }
    }

    // _isFaceExtraSelected
    // Returns whether the faceExtra cutoutType is the one selected or not
    _isFacePartSelected(cutoutType) {
        return FACE_EXTRA_ENUM[this.get(Keys.FACE_AREA)] === FACE_EXTRA_ENUM[cutoutType];
    }

    // _useExtentCenter
    // Overwrite from parent class. Only return true for eyes
    _useExtentCenter() {
        return this._isFacePartSelected(Keys.LEFT_EYE) || this._isFacePartSelected(Keys.RIGHT_EYE);
    }

    // _getFaceExtraKeypoints
    // Takes the faceExtraInfo object and returns the corresponding keypoints depending
    // on properties
    _getFaceExtraKeypoints(faceExtraInfo) {
        if (this._isFacePartSelected(Keys.LEFT_EYE)) {
            return faceExtraInfo.eye_left;
        } else if (this._isFacePartSelected(Keys.RIGHT_EYE)) {
            return faceExtraInfo.eye_right;
        } else if (this._isFacePartSelected(Keys.LEFT_BROW)) {
            return faceExtraInfo.eyebrow_left;
        } else if (this._isFacePartSelected(Keys.RIGHT_BROW)) {
            return faceExtraInfo.eyebrow_right;
        } else if (this._isFacePartSelected(Keys.MOUTH) || this._isFacePartSelected(Keys.INNER_MOUTH)) {
            return faceExtraInfo.lips;
        } else if (this._isFacePartSelected(Keys.LEFT_IRIS)) {
            return faceExtraInfo.left_iris;
        } else if (this._isFacePartSelected(Keys.RIGHT_IRIS)) {
            return faceExtraInfo.right_iris;
        } else {
            return null;
        }
    }

    onEnable() {
        if (this._renderer !== null && this._renderer !== undefined) {
            this._renderer.enabled = true;
        }
    }

    onDisable() {
        if (this._renderer !== null && this._renderer !== undefined) {
            this._renderer.enabled = false;
        }
    }

    component() {
        const jsScriptComps = this.entity.getComponents('JSScriptComponent');
        for (let i = 0; i < jsScriptComps.size(); i++) {
            const comp = jsScriptComps.get(i);
            if (comp.path === 'js/FaceInset.js') {
                return comp;
            }
        }
    }
}

exports.FaceInset = FaceInset;