const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();
const amg = require('./amg');
const FaceMaskProvider = require('./facemask-provider').FaceMaskProvider;
const BlendFilter = require('./blend-filter').BlendFilter;
const Utils = require('./utils').Utils;
const { filterDeckShaderMap } = require('./FilterDeckShaderMap');

const KIRA_SIZE = 64;
const KIRA_SIZE_INV = 1.0 / KIRA_SIZE;
const PIXEL_PER_KIRA = 2;
const KIRA_WIDTH_INV = 1.0 / (KIRA_SIZE * PIXEL_PER_KIRA);
const KIRA_INIT_SIZE = 160;
const KIRA_INIT_COUNT = 150;
const KIRA_SCALE_FACTOR = 1.0;
const KIRA_BRIGHTNESS_FACTOR = 1.0;
const HALF_QUAD_EDGE_LENGTH = 0.1;

const BLENDMODE = {
  'NORMAL': 1,
  'DARKEN': 2,
  'MUTIPLY': 3,
  'COLORBURN': 4,
  'LIGHTEN': 5,
  'SCREEN': 6,
  'COLORDODGE': 7,
  'LINEARDODGE': 8,
  'OVERLAY': 9,
  'ADD': 10,
  'SOFTLIGHT': 11
}

const PropertiesEnum = {
  SIZE: 'Size',
  SIZE_RANDOMNESS: 'Size Randomness',
  BRIGHTNESS: 'Brightness',
  OPACITY: 'Opacity',
  INTENSITY: 'Intensity',
  COLOR1: 'Color1',
  COLOR2: 'Color2',
  OCCLUDEFACE: 'Occlude Face',
  BLENDMODE: 'Blend Mode',
  PATTERN1: 'Pattern1',
  PATTERN2: 'Pattern2',
  PATTERN3: 'Pattern3',
  SPEED: 'Speed',
}

// Write your own filter, once done and nice, we'll typescriptize it as a standard node of filtersystem
class KiraFilter extends amg.FilterNode {
  constructor(name, properties) {
    super(name, properties);
    this._kiraPointMesh = this.createKiraMesh();
    this._pointSpriteMat = Utils.createEmptyMaterial()
    Utils.addPassToMaterial(this._pointSpriteMat, filterDeckShaderMap, false, true);

    // Create placeholder attribute for Kira Mask
    this._kiraTex = new Amaz.Texture2D();
    this._kiraTex.filterMin = Amaz.FilterMode.NEAREST;
    this._kiraTex.filterMag = Amaz.FilterMode.NEAREST;

    let attDesc = this._pointSpriteMat.xshader.passes.get(0).renderState.colorBlend.attachments.get(0);
    attDesc.srcColorBlendFactor = Amaz.BlendFactor.ONE;
    attDesc.dstColorBlendFactor = Amaz.BlendFactor.ONE;
    attDesc.srcAlphaBlendFactor = Amaz.BlendFactor.ONE;
    attDesc.dstAlphaBlendFactor = Amaz.BlendFactor.ONE;
    attDesc.ColorBlendOp = Amaz.BlendOp.ADD;
    attDesc.AlphaBlendOp = Amaz.BlendOp.ADD;

    let depthStencil = this._pointSpriteMat.xshader.passes.get(0).renderState.depthstencil;
    depthStencil.depthTestEnable = false;
    depthStencil.depthWriteEnable = false;

    // cache a reference to js script component's properties map
    this.map = properties.PropertiesMap;
    this.frameCounter = 0;
    this.elapsedTime = 0;
    this.rt = properties.rt;
  }

  createKiraMesh() {
    let mesh = new Amaz.Mesh()
    let subMesh = new Amaz.SubMesh()
    // setup attributes
    let attribs = new Amaz.Vector()
    let attribPos = new Amaz.VertexAttribDesc()
    attribPos.semantic = Amaz.VertexAttribType.POSITION
    attribs.pushBack(attribPos);
    let attribuv = new Amaz.VertexAttribDesc();
    attribuv.semantic = Amaz.VertexAttribType.TEXCOORD0;
    attribs.pushBack(attribuv);
    mesh.vertexAttribs = attribs
    subMesh.primitive = Amaz.Primitive.TRIANGLES
    subMesh.mesh = mesh
    mesh.addSubMesh(subMesh)
    mesh.clearAfterUpload = false
    return mesh
  }

  setKiraMesh(mesh, pointsCount) {
    if (pointsCount === 0) {
      pointsCount = 1
    }
    let rowCount = Math.ceil(pointsCount / KIRA_SIZE) - 1
    let colCount = pointsCount - rowCount * KIRA_SIZE
    let vertices = new Amaz.FloatVector()
    let indices = new Amaz.UInt16Vector()
    if (rowCount > 0) {
      let counter = 0;
      for (let i = 0; i < rowCount; ++i) {
        for (let j = 0; j < KIRA_SIZE - 1; ++j) {
          const u = j * PIXEL_PER_KIRA * KIRA_WIDTH_INV + 0.5 * KIRA_WIDTH_INV
          const v = i * KIRA_SIZE_INV + 0.5 * KIRA_SIZE_INV
          // v0
          // position data
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          // uv data, used to determine bling point position
          vertices.pushBack(u);
          vertices.pushBack(v);

          // v1
          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          // v2
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          // v3
          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          // triangle 1
          indices.pushBack(0 + counter);
          indices.pushBack(1 + counter);
          indices.pushBack(2 + counter);
          // triangle 2
          indices.pushBack(1 + counter);
          indices.pushBack(3 + counter);
          indices.pushBack(2 + counter);
          counter += 4;
        }
      }
    }

    if (rowCount > -1) {
      let counter = 0;
      for (let k = 0; k < colCount - 1; ++k) {
        const u = k * PIXEL_PER_KIRA * KIRA_WIDTH_INV + 0.5 * KIRA_WIDTH_INV
        const v = rowCount * KIRA_SIZE_INV + 0.5 * KIRA_SIZE_INV
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          vertices.pushBack(-HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(HALF_QUAD_EDGE_LENGTH);
          vertices.pushBack(0);
          vertices.pushBack(u);
          vertices.pushBack(v);

          indices.pushBack(0 + counter);
          indices.pushBack(1 + counter);
          indices.pushBack(2 + counter);
          indices.pushBack(1 + counter);
          indices.pushBack(3 + counter);
          indices.pushBack(2 + counter);
          counter += 4;
      }
    }

    mesh.vertices = vertices
    mesh.submeshes.get(0).indices16 = indices
  }

  // setup texture
  handleDirty(cmdBuffer, texturePool) {

    if (this.needUpdateTexture) {
      if (this.isInputsReady() && this.isOutputsReady()) {
        cmdBuffer.setRenderTexture(this.getOutput(0));
        cmdBuffer.clearRenderTexture(
          true,
          true,
          new Amaz.Color(0.0, 0.0, 0.0, 0.0),
          0
        );
        this.setKiraMesh(this._kiraPointMesh, KIRA_INIT_COUNT * this.map.get(PropertiesEnum.INTENSITY));
        cmdBuffer.drawMesh(
          this._kiraPointMesh,
          new Amaz.Matrix4x4f(),
          this._pointSpriteMat,
          0,
          0,
          null
        );
      }
    }
    // blit
  }

  setProp(name, value) {
    super.setProp(name, value);
    // TODO: check if runtime dirty
    if (name === 'mask') {
      this.mask = value;
    }
  }

  setMaterialProperties() {
    // Set float uniforms
    this._pointSpriteMat.setFloat("u_KiraSizeScale", this.map.get(PropertiesEnum.SIZE) * KIRA_SCALE_FACTOR);
    this._pointSpriteMat.setFloat("u_KiraSizeRandomExtent", this.map.get(PropertiesEnum.SIZE_RANDOMNESS));
    this._pointSpriteMat.setFloat("u_KiraBrightness", this.map.get(PropertiesEnum.BRIGHTNESS) * KIRA_BRIGHTNESS_FACTOR);
    this._pointSpriteMat.setFloat("u_KiraOpacity", this.map.get(PropertiesEnum.OPACITY));
    this._pointSpriteMat.setFloat("u_halfQuadSideLength", HALF_QUAD_EDGE_LENGTH);
    this.aspectRatio = this.rt.width / this.rt.height;
    this._pointSpriteMat.setFloat("u_aspectRatio", this.aspectRatio);


    // Set Face Occuluder Uniform
    if (this.map.get(PropertiesEnum.OCCLUDEFACE)) {
      this._pointSpriteMat.enableMacro("AE_USE_MASK", 1);
      this._pointSpriteMat.setTex("u_MaskTex", this.getProp("mask"));
    }
    else {
      this._pointSpriteMat.disableMacro("AE_USE_MASK");
    }

    // Set Assigned Color Uniform
    this._pointSpriteMat.setVec4("u_ColorOne", new Amaz.Vector4f(this.map.get(PropertiesEnum.COLOR1).r, this.map.get(PropertiesEnum.COLOR1).g, this.map.get(PropertiesEnum.COLOR1).b, this.map.get(PropertiesEnum.COLOR1).a));
    this._pointSpriteMat.setVec4("u_ColorTwo", new Amaz.Vector4f(this.map.get(PropertiesEnum.COLOR2).r, this.map.get(PropertiesEnum.COLOR2).g, this.map.get(PropertiesEnum.COLOR2).b, this.map.get(PropertiesEnum.COLOR2).a));

    // Set Noise Texture
    this._pointSpriteMat.setTex("u_NoiseTex", this.getProp("noiseTex"));

    // Update texture
    let patterns = [];
    patterns.push(this.map.get('Pattern1'));
    patterns.push(this.map.get('Pattern2'));
    patterns.push(this.map.get('Pattern3'));
    let texID = 0;
    for (let i = 0; i < patterns.length; ++i) {
      if (patterns[i] !== undefined && patterns[i] !== null && patterns[i] !== 'None') {
        this._pointSpriteMat.setTex("u_KiraPattern" + texID, patterns[i]);
        texID++;
      }
    }
    if (texID === 0) {
      this._pointSpriteMat.disableMacro("AE_USE_PATTERN");
    } else {
      this._pointSpriteMat.enableMacro("AE_USE_PATTERN");
      this._pointSpriteMat.setInt("u_KiraPatternCount", texID);
    }
  }

  updateKiraFilter(cmdBuffer, texturePool) {
    this.setMaterialProperties();
    this.handleDirty(cmdBuffer, texturePool);

    let algoResult = Amaz.AmazingManager.getSingleton('Algorithm').getAEAlgorithmResult();
    let kiraInfo = algoResult.getKiraInfo();
    if (kiraInfo) {
      let kiraMask = kiraInfo.mask;
      this._kiraTex.storage(kiraMask);
      this._pointSpriteMat.setTex("u_KiraTex", this._kiraTex);
    }
  }

  onUpdate(_dt, cmdBuffer, texturePool) {
    // run free fps in the first 5 frames to prevent blue screen artifacts
    if (this.frameCounter < 5) {
      this.updateKiraFilter(cmdBuffer, texturePool);
      this.frameCounter++;
    } else {
      let speed = this.map.get(PropertiesEnum.SPEED);
      // speed is a value range from [0, 1];
      // remap it to [0.75 - 0.95] which is the sweet spot for bling speed
      speed = 0.75 + 0.2 * speed;
      speed = Number(speed.toFixed(4));
      const timeToDelay = 1 - speed;
      this.elapsedTime += _dt;
      if (this.elapsedTime > timeToDelay) {
        this.elapsedTime = 0;
        this.updateKiraFilter(cmdBuffer, texturePool);
      }
    }
  }
}

class FilterDeck extends amg.Script {
  constructor() {
    super();
    this.name = "FilterDeck";
    this.blendMode = 'LINEARDODGE'
  }

  onEnable() {
    const cameraEntity = this.entity.scene.findByComponent(amg.CameraComponent);
    if (cameraEntity) {
      this.camera = cameraEntity.camera;
    } else {
      console.warn('camera not found');
    }

    const blingComp = this.getBlingComponent();
    this.propertiesMap = blingComp.properties;
    this.faceMaskProvider = new FaceMaskProvider();
    this.faceMaskRT = this.faceMaskProvider.getTexture();

    let asstMgr = amg.Engine.engine.scene.native.assetMgr;
    let bling1 = asstMgr.SyncLoad("textures/defaultBling.png");
    let bling2 = bling1;
    let bling3 = bling1;
    let noiseImg = asstMgr.SyncLoad("textures/noise.png");
    this.filterSys = amg.FilterGraphRegistry.create('MyGraph' + Math.random());

    this.filterSys.bind(this.camera, amg.CameraRenderEvent.AfterRender, [this.faceMaskRT]);
    this.rt = this.camera.renderTexture;
    this.filterSys.add(new KiraFilter('kira', {
      Texture1: bling1,
      Texture2: bling2,
      Texture3: bling3,
      noiseTex: noiseImg,
      mask: this.faceMaskRT,
      PropertiesMap: this.propertiesMap,
      rt: this.rt,
    }))

    this.filterSys.add(new BlendFilter(
      'blend',
      {
        blendMode: BLENDMODE[this.blendMode],
      }
    ))
    this.filterSys.link('internal_blit', 0, 'blend', 1);
  }

  onUpdate(deltaTime) {
    this.faceMaskProvider.onUpdate(deltaTime)
    this.faceMaskRT = this.faceMaskProvider.getTexture();
    this.filterSys.getFilter('kira').setProp('mask', this.faceMaskRT);
    this.filterSys.getFilter('blend').setProp('blendMode', BLENDMODE[this.propertiesMap.get(PropertiesEnum.BLENDMODE)]);
  }

  onDisable() {
    this.filterSys.unbind(this.camera, amg.CameraRenderEvent.AfterRender, [this.faceMaskRT]);
  }

  onDestroy() {
  }

  getBlingComponent() {
    const jsScriptComps = this.entity.native.getComponents('JSScriptComponent');
    for (let i = 0; i < jsScriptComps.size(); i++) {
      const comp = jsScriptComps.get(i);
      if (comp.path === 'js/FilterDeck.js') {
        return comp;
      }
    }
  }
}

exports.FilterDeck = FilterDeck;
