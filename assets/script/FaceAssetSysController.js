const amg = require('./amg');
const Amaz = effect.Amaz;
class FaceAssetSysController {
  constructor() {
    this.name = 'FaceAssetSysController';
    this.faceIds = [];
    this.faceScriptComps = [];
    this.faceRenderers = [];
    this.morpherComps = [];
  }

  onInit() {
    console.warn('[onInit]: FaceAssetSysController');
  }

  onStart() {
    console.warn('[OnStart]: FaceAssetSysController');
    this.on(Amaz.AMGListenerType.ALWAYS_INVOKE_TYPE, 'onCallback');
    for (let i = 0; i < this.faceScriptComps.length; i++) {
      let faceId = this.faceScriptComps[i].properties.get('faceIdx');
      const faceRenderer = this.faceScriptComps[i].entity.getComponent('MeshRenderer');
      const morpherComp = this.faceScriptComps[i].entity.getComponent('MorpherComponent');
      if (!faceRenderer && !faceId) {
        break;
      }
      if (faceId !== null) {
        faceRenderer.mesh = faceRenderer.mesh.clone();
        this.faceRenderers.push(faceRenderer);
        this.faceIds.push(faceId);
        this.morpherComps.push(morpherComp);
        if(morpherComp) {
          const channelWeights = morpherComp.channelWeights.copy();
          morpherComp.basemesh = faceRenderer.mesh;
          const morpher = morpherComp.getMorpher();
          if(morpher && morpher.channels.size() === channelWeights.size()){
            morpherComp.channelWeights = channelWeights;
          }
        }
      }
    }
  }

  onCallback(sys, sender, eventType) {
    console.warn('onCallback : ', sys, sender, eventType);
  }

  onUpdate(dt) {
    // console.warn('onUpdate MainSystem');

    if (this.faceIds.length === this.faceRenderers.length) {
      for (let i = 0; i < this.faceRenderers.length; i++) {
        this._updateFaceMesh(i);
      }
    }
  }

  _updateFaceMesh(faceMeshId) {
    let faceId = this.faceIds[faceMeshId];
    const faceShapeMesh = this.faceRenderers[faceMeshId].mesh;
    if (faceShapeMesh !== undefined && faceShapeMesh !== null) {
      // face mesh update
      const faces = amg.Head.faces;
      const faceCount = faces.length;
      if (faceId < 0 || faceId > 5) {
        faceId = 0;
      }
      if (faceCount <= faceId) {
        return false;
      }

      let faceMeshInfo = faces[faceId].faceMesh;

      if (faceMeshInfo === null) {
        return false;
      }

      const oriPos = faceMeshInfo.vertexes;
      const oriNormals = faceMeshInfo.normals;

      if (oriPos !== undefined && oriNormals !== undefined && 0 < oriPos.size() && 0 < oriNormals.size()) {
        faceShapeMesh.setVertexArray(oriPos);
        faceShapeMesh.setNormalArray(oriNormals);
      }

      const morpherComp = this.morpherComps[faceMeshId];
      if (morpherComp) {
        morpherComp.basemesh = faceShapeMesh;
      }
    }
  }

  onComponentAdded(comp) {
    if (comp.isInstanceOf('JSScriptComponent') && comp.path === 'js/FaceShapeController.js') {
      this.faceScriptComps.push(comp);
    }
  }

  onComponentRemoved(comp) {
    if (comp.isInstanceOf('JSScriptComponent') && comp.path === 'js/FaceShapeController.js') {
      const renderer = comp.entity.getComponent('MeshRenderer');
      for (let i = 0; i < this.faceScriptComps.length; i++) {
        if (this.faceScriptComps[i] === comp) {
          this.faceScriptComps.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.faceRenderers.length; i++) {
        if (this.faceRenderers[i] === renderer) {
          this.faceRenderers.splice(i, 1);
          this.faceIds.splice(i, 1);
          this.morpherComps.splice(i, 1);
          break;
        }
      }
    }
  }

  onEvent(event) {}
}

exports.FaceAssetSysController = FaceAssetSysController;
