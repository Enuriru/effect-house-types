const Amaz = effect.Amaz;

class SharedMaterials {
  constructor() {}

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const material = new Amaz.Vector();
    if (objects[0] instanceof effect.Amaz.SkinMeshRenderer) {
      const skinMaterial = value.instantiate();
      //This is for ausl
      skinMaterial.enableMacro('AE_AMAZING_USE_BONES', 1);
      // //This is for glsl
      skinMaterial.enableMacro('AMAZING_USE_BONES', 1);
      material.pushBack(skinMaterial);
    } else {
      material.pushBack(value);
    }
    objects[0][property] = material;
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    return objects[0][property].get(0);
  }
}

exports.SharedMaterials = SharedMaterials;
