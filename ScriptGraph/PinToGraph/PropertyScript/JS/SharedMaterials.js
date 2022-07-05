const Amaz = effect.Amaz;

class SharedMaterials {
  constructor() {}

  // value: [material, skinMaterial]
  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0 || !Array.isArray(value) || value.length !== 2) {
      return null;
    }
    const material = new Amaz.Vector();
    if (objects[0] instanceof Amaz.SkinMeshRenderer) {
      material.pushBack(value[1]);
    } else {
      material.pushBack(value[0]);
    }
    objects[0][property] = material;
  }

  getNormalMaterial(material) {
    const guid = material.guid.toString();
    if (SharedMaterials.materialMap.has(guid)) {
      return SharedMaterials.materialMap.get(guid);
    } else {
      const normalMaterial = material.instantiate();
      normalMaterial.disableMacro('AE_AMAZING_USE_BONES');
      return normalMaterial;
    }
  }

  getSkinMaterial(material) {
    const guid = material.guid.toString();
    if (SharedMaterials.materialMap.has(guid)) {
      return SharedMaterials.materialMap.get(guid);
    } else {
      const skinMaterial = material.instantiate();
      skinMaterial.enableMacro('AE_AMAZING_USE_BONES', 1);
      return skinMaterial;
    }
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const material = objects[0][property].get(0);
    if (material.enabledMacros.has('AE_AMAZING_USE_BONES')) {
      // material is skin material
      return [this.getNormalMaterial(material), material];
    } else {
      // material is normal material
      return [material, this.getSkinMaterial(material)];
    }
  }
}

SharedMaterials.materialMap = new Map();

exports.SharedMaterials = SharedMaterials;
