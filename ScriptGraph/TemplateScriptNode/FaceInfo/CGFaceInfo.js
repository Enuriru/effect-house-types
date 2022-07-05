const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGFaceInfo extends BaseNode {
  constructor() {
    super();
    // holding an algorithm manager instance here
    this.algoMgr = null;
    // cache an face 2d point array here
    this.facePts2D = new Array();
  }

  getOutput(index) {
    const faceIndex = this.inputs[0]();

    if (faceIndex === undefined || faceIndex === null) {
      return null;
    }

    if (!this._checkFaceIndexValidity(faceIndex)) {
      return null;
    }

    if (this.algoMgr === null) {
      this.algoMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    }

    let algoRes = this.algoMgr.getAEAlgorithmResult();
    let faceBaseInfo = algoRes.getFaceBaseInfo(faceIndex);
    if (!faceBaseInfo) {
      return;
    }

    if (index === 0) {
      return this._returnFaceRect(faceBaseInfo);
    } else if (index === 1) {
      return this._returnScaleMultiplier(faceBaseInfo);
    } else if (index === 2) {
      return this._return2DKeypoints(faceBaseInfo);
    }
  }

  _checkFaceIndexValidity(faceIndex) {
    return faceIndex === 0 || faceIndex === 1 || faceIndex === 2 || faceIndex === 3 || faceIndex === 4;
  }

  _returnFaceRect(faceBaseInfo) {
    return faceBaseInfo.rect;
  }

  _returnScaleMultiplier(faceBaseInfo) {
    return 1.0; // TODO: Remove if we are sure don't need this anymore
  }

  _return2DKeypoints(faceBaseInfo) {
    const facePtsVec2Vec = faceBaseInfo.points_array;
    // // Consider using this logic in the future as an improvement
    // if (this.facePoints.length != face.points_array.size())
    //   this.facePoints.splice(0, this.facePoints.length)
    this.facePts2D.splice(0, this.facePts2D.length);
    for (let i = 0; i < facePtsVec2Vec.size(); i++) {
      const vec2 = facePtsVec2Vec.get(i);
      this.facePts2D.push(vec2);
    }
    return this.facePts2D;
  }
}

exports.CGFaceInfo = CGFaceInfo;
