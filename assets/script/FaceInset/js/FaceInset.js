const amg = require('./amg');

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

// Face extra cutout points
const FACE_EXTRA_CUTOUT_POINTS = {};
FACE_EXTRA_CUTOUT_POINTS[Keys.RIGHT_EYE] = [21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
FACE_EXTRA_CUTOUT_POINTS[Keys.LEFT_EYE] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
FACE_EXTRA_CUTOUT_POINTS[Keys.RIGHT_BROW] = [7, 8, 9, 10, 11, 12, 5, 4, 3, 2, 1, 0];
FACE_EXTRA_CUTOUT_POINTS[Keys.LEFT_BROW] = [0, 1, 2, 3, 4, 5, 12, 11, 10, 9, 8, 7];
FACE_EXTRA_CUTOUT_POINTS[Keys.MOUTH] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 61, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 60];
FACE_EXTRA_CUTOUT_POINTS[Keys.INNER_MOUTH] = [62, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 63, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30];

// Map from property string to amg enum for face parts
const FACE_PART_MAP = {};
FACE_PART_MAP[Keys.HEAD] = amg.FacePart.Whole;
FACE_PART_MAP[Keys.RIGHT_EYE] = amg.FacePart.RightEye;
FACE_PART_MAP[Keys.LEFT_EYE] = amg.FacePart.LeftEye;
FACE_PART_MAP[Keys.NOSE] = amg.FacePart.Nose;
FACE_PART_MAP[Keys.LEFT_BROW] = amg.FacePart.LeftEyeBrow;
FACE_PART_MAP[Keys.RIGHT_BROW] = amg.FacePart.RightEyeBrow;
FACE_PART_MAP[Keys.LEFT_EAR] = amg.FacePart.LeftEar;
FACE_PART_MAP[Keys.RIGHT_EAR] = amg.FacePart.RightEar;

// Enum map to avoid string compare
const FACE_EXTRA_ENUM = {};
FACE_EXTRA_ENUM[Keys.RIGHT_EYE] = 1;
FACE_EXTRA_ENUM[Keys.LEFT_EYE] = 2;
FACE_EXTRA_ENUM[Keys.RIGHT_BROW] = 3;
FACE_EXTRA_ENUM[Keys.LEFT_BROW] = 4;
FACE_EXTRA_ENUM[Keys.MOUTH] = 5;
FACE_EXTRA_ENUM[Keys.INNER_MOUTH] = 6;

// Map from quality level to UseFaceExtra flag
const USE_FACE_EXTRA = {};
USE_FACE_EXTRA[Keys.QUALITY_LOW] = false;
USE_FACE_EXTRA[Keys.QUALITY_MEDIUM] = true;
USE_FACE_EXTRA[Keys.QUALITY_HIGH] = true;

// ------ PET FACE CONSTANTS ------

// Property to pet face type enums map
const FACE_TYPE = {};
FACE_TYPE[Keys.HUMAN] = amg.FaceType.Human;
FACE_TYPE[Keys.CAT] = amg.FaceType.Cat;
FACE_TYPE[Keys.DOG] = amg.FaceType.Dog;


// Map of cutout points for cat face insets
const CAT_FACE_CUTOUT_POINTS = {};
CAT_FACE_CUTOUT_POINTS[Keys.RIGHT_EYE] = [76, 75, 74, 73, 72, 79, 78, 77];
CAT_FACE_CUTOUT_POINTS[Keys.LEFT_EYE] = [64, 65, 66, 67, 68, 69, 70, 71];
CAT_FACE_CUTOUT_POINTS[Keys.RIGHT_EAR] = [19, 33, 34, 35, 36, 37, 38, 39, 16, 17, 18];
CAT_FACE_CUTOUT_POINTS[Keys.LEFT_EAR] = [0, 26, 27, 28, 29, 30, 31, 32, 23, 24, 25];
CAT_FACE_CUTOUT_POINTS[Keys.NOSE] = [45, 44, 46, 47];
CAT_FACE_CUTOUT_POINTS[Keys.MOUTH] = [44, 46, 60, 9, 8, 7, 52, 45];
CAT_FACE_CUTOUT_POINTS[Keys.HEAD] = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 26, 27, 28, 29, 30, 31, 32, 23, 22, 21, 20, 19, 33, 34, 35, 36, 37, 38, 39];

// Map of cutout points for dog face insets
// TODO: update these with the new keypoints (these no longer work)
const DOG_FACE_CUTOUT_POINTS = {};
DOG_FACE_CUTOUT_POINTS[Keys.RIGHT_EYE] = [66, 67, 68, 69, 70, 71, 72, 73];
DOG_FACE_CUTOUT_POINTS[Keys.LEFT_EYE] = [58, 59, 60, 61, 62, 63, 64, 65];
DOG_FACE_CUTOUT_POINTS[Keys.RIGHT_EAR] = [16, 17, 18, 19, 83, 84, 85, 86, 87, 88, 89];
DOG_FACE_CUTOUT_POINTS[Keys.LEFT_EAR] = [0, 25, 24, 23, 82, 81, 80, 79, 78, 77, 76];
DOG_FACE_CUTOUT_POINTS[Keys.NOSE] = [31, 32, 33, 34, 35, 36, 37, 38];
DOG_FACE_CUTOUT_POINTS[Keys.MOUTH] = [5, 6, 7, 8, 9, 10, 11, 36, 35, 34];
DOG_FACE_CUTOUT_POINTS[Keys.HEAD] = [0, 5, 6, 7, 8, 9, 10, 11, 16, 89, 88, 87, 86, 85, 84, 83, 19, 21, 23, 82, 81, 80, 79, 78, 77, 76];

const MAX_NUM_HUMAN_FACES = 5; // found in amg

// Class: FaceInset
// Responsible for linking UI properties to the base class for human/cat/dog face inset
class FaceInset extends InsetRenderer {

    constructor() {
        super();
    }

    // onStart
    onStart() {
        this._guid = this.entity.native.guid;
        this._comp = this.getFaceInsetComponent();
        this._properties = this._comp.properties;
        super.onStart();
    }

    // onUpdate
    // Updates the face inset depending on whether or not the selected inset is a human or animal
    onUpdate(dt) {
        this._setFilter();
        if (FACE_TYPE[this.get(Keys.FACE_TYPE)] == FACE_TYPE[Keys.CAT] ||
            FACE_TYPE[this.get(Keys.FACE_TYPE)] == FACE_TYPE[Keys.DOG]) {
            this._petFaceUpdate();
        } else {
            this._humanFaceUpdate();
        }
    }

    // onEnable
    onEnable() {
        // super.onEnable();
    }

    // onDisable
    onDisable() {
        // super.onDisable();
        FaceInset.prototype._faceTypesUsed[this._guid.toString()] = null;
    }

    // onDestroy
    onDestroy() {
        FaceInset.prototype._faceTypesUsed[this._guid.toString()] = null;
    }

    // getFaceInsetComponent
    // Returns native script component object for Face Inset
    getFaceInsetComponent() {
        const jsScriptComps = this.entity.native.getComponents('JSScriptComponent');
        for (let i = 0; i < jsScriptComps.size(); i++) {
            const comp = jsScriptComps.get(i);
            if (comp.path === 'js/FaceInset.js') {
                return comp;
            }
        }
    }

    // *** PUBLIC ***
    // *** setters / getters for properties ***

    // return amg.FaceType
    get faceType() {
        return FACE_TYPE[this.get(Keys.FACE_TYPE)];
    }

    set faceType(newValue) {
        let typeStr = null;
        for (const key of Object.keys(FACE_TYPE)) {
            const val = FACE_TYPE[key];
            if (val == newValue) {
                typeStr = key;
                break;
            }
        }
        if (typeStr) {
            this.set(Keys.FACE_TYPE, typeStr);
        }
    }

    // return number
    get faceIndex() {
        return this.get(Keys.FACE_INDEX);
    }

    set faceIndex(newValue) {
        this.set(Keys.FACE_INDEX, newValue);
    }

    // return amg.FacePart
    get facePart() {
        return FACE_PART_MAP[this.get(Keys.FACE_AREA)];
    }

    set facePart(newValue) {
        let facePartStr = null;
        for (const key of Object.keys(FACE_PART_MAP)) {
            const val = FACE_PART_MAP[key];
            if (val == newValue) {
                facePartStr = key;
                break;
            }
        }
        if (facePartStr) {
            this.set(Keys.FACE_AREA, facePartStr);
        }
    }

    // return number
    get opacity() {
        return this.get(Keys.OPACITY);
    }

    set opacity(newValue) {
        this.set(Keys.OPACITY, newValue);
    }

    // return boolean
    get useFeathering() {
        return this.get(Keys.USE_FEATHERING);
    }

    set useFeathering(newValue) {
        this.set(Keys.USE_FEATHERING, newValue);
    }

    // return number
    get featheringScale() {
        return this.get(Keys.FEATHERING_SCALE);
    }

    set featheringScale(newValue) {
        this.set(Keys.FEATHERING_SCALE, newValue);
    }

    // return boolean
    get useOutline() {
        return this.get(Keys.USE_OUTLINE);
    }

    set useOutline(newValue) {
        this.set(Keys.USE_OUTLINE, newValue);
    }

    // return number
    get outlineThickness() {
        return this.get(Keys.OUTLINE_THICKNESS);
    }

    set outlineThickness(newValue) {
        this.set(Keys.OUTLINE_THICKNESS);
    }

    // return bool
    get useDepthTest() {
        return this.get(Keys.USE_DEPTH_TEST);
    }

    set useDepthTest(newValue) {
        this.set(Keys.USE_DEPTH_TEST);
    }

    useCameraInput() {
        this.set(Keys.INPUT_TEXTURE, Keys.CAMERA_INPUT_TEXTURE);
    }

    useFinalRenderInput() {
        this.set(Keys.INPUT_TEXTURE, Keys.FINAL_RENDER_TEXTURE);
    }

    // *** PRIVATE ***

    _log(msg) {
        console.warn("FaceInsetLog", msg);
    }

    _loge(msg) {
        console.warn("FaceInsetError", msg);
    }

    // _setFilter
    // Sets the amg.Head API's filter to use the corresponding face types for all active face insets
    _setFilter() {
        // Use global variable to track exiting face types
        let faceType = FACE_TYPE[this.get(Keys.FACE_TYPE)];
        let storedFaceType = FaceInset.prototype._faceTypesUsed[this._guid.toString()];
        if (faceType != storedFaceType)
        {
            FaceInset.prototype._faceTypesUsed[this._guid.toString()] = faceType;
            let faceTypesUsed = new Set();
            for (const guid of Object.keys(FaceInset.prototype._faceTypesUsed)) {
                let ft = FaceInset.prototype._faceTypesUsed[guid];
                if (ft != null) {
                    faceTypesUsed.add(ft);
                }
            }
            amg.Head.setFilter(Array.from(faceTypesUsed)); 
        }
    }

    // _humanFaceUpdate
    // If a human face is available, send the keypoints, indices, and rotation to the base class
    _humanFaceUpdate() {
        const faceIndex = this.get(Keys.FACE_INDEX);
        let faceInfo = amg.Head.faces[faceIndex];
        if (faceInfo != null) {
            const eulerAngles = new amg.Vec3(faceInfo.pitch, faceInfo.yaw, faceInfo.roll);
            const cutoutPointIndices = this._getInsetKeypointIndices();
            if (this._useFaceExtra()) {
                let keypoints = this._getFaceExtraKeypoints(faceInfo);
                if (keypoints) {
                    this._setInsetProperties(keypoints, cutoutPointIndices, eulerAngles);
                } else {
                    this._setInsetProperties(); // set as undefined
                }
            } else {
                const keypoints = amg.Head.getLandmark(amg.FacePart.Whole, faceIndex, amg.FaceLandmarkType.Face106);
                this._setInsetProperties(keypoints, cutoutPointIndices, eulerAngles);
            }
        } else {
            this._setInsetProperties();  // set as undefined
        }
    }

    // _petFaceUpdate
    // If a cat or dog face is available, send the keypoints, indices, and rotation to the base class
    _petFaceUpdate() {
        let petFaceInfo;
        const faceType = FACE_TYPE[this.get(Keys.FACE_TYPE)];
        for (let i = 0; i <= MAX_NUM_HUMAN_FACES; i++) {
            let faceInfo = amg.Head.faces[i];
            if (faceInfo && faceInfo.type != amg.FaceType.Human && faceInfo.type == faceType) {
                petFaceInfo = faceInfo;
                break;
            }
        }
        if (petFaceInfo && petFaceInfo.type == faceType && petFaceInfo.type != amg.FaceType.Human) {
            const keypoints = petFaceInfo.landmarksPetV2;
            const eulerAngles = new amg.Vec3(petFaceInfo.pitch, petFaceInfo.yaw, -petFaceInfo.roll);
            let insetKeypointIndices = this._getInsetKeypointIndices();
            this._setInsetProperties(keypoints, insetKeypointIndices, eulerAngles);
        } else {
            this._setInsetProperties(); // set as undefined
        }
    }

    // _useFaceExtra
    // Returns whether or not to use faceExtra keypoints depending on selected properties
    _useFaceExtra() {
        return USE_FACE_EXTRA[this.get(Keys.QUALITY)] && FACE_EXTRA_ENUM[this.get(Keys.FACE_AREA)] != null;
    }

    // _getInsetKeypointIndices
    // Returns the indices for the selected face type and keypoint resolution
    _getInsetKeypointIndices() {
        const faceType = FACE_TYPE[this.get(Keys.FACE_TYPE)];
        const faceAreaKey = this.get(Keys.FACE_AREA);
        if (faceType == FACE_TYPE[Keys.HUMAN]) {
            if (this._useFaceExtra()) {
                return FACE_EXTRA_CUTOUT_POINTS[faceAreaKey];
            } else {
                return FACE_106_CUTOUT_POINTS[faceAreaKey];
            }
        } else if (faceType == FACE_TYPE[Keys.DOG]) {
            return DOG_FACE_CUTOUT_POINTS[faceAreaKey];
        } else if (faceType == FACE_TYPE[Keys.CAT]) {
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
    // Returns amg.Head landmark depending on script property
    _getFaceExtraKeypoints(faceInfo) {
        if (this._isFacePartSelected(Keys.LEFT_EYE)) {
            return faceInfo.landmarks240EyeLeft;
        } else if (this._isFacePartSelected(Keys.RIGHT_EYE)) {
            return faceInfo.landmarks240EyeRight;
        } else if (this._isFacePartSelected(Keys.LEFT_BROW)) {
            return faceInfo.landmarks240EyebrowLeft;
        } else if (this._isFacePartSelected(Keys.RIGHT_BROW)) {
            return faceInfo.landmarks240EyebrowRight;
        } else if (this._isFacePartSelected(Keys.MOUTH) || this._isFacePartSelected(Keys.INNER_MOUTH)) {
            return faceInfo.landmarks240Lip;
        } else {
            return null;
        }
    }
}

FaceInset.prototype._faceTypesUsed = {};

exports.FaceInset = FaceInset;