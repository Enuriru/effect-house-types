const Amaz = effect.Amaz;

class FaceMakeupMaterialProperty {
  constructor() {}

  setProperty(objects, property, value, valueType) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return;
    }
    if (objects[0].sharedMaterials.size() === 0) {
      return;
    }
    const material = objects[0].sharedMaterials.get(0);
    if (valueType === 'Color') {
      material.setVec4(property, new Amaz.Vector4f(value.r, value.g, value.b, value.a));
    } else if (valueType === 'Texture2D') {
      material.setTex(property, value);
    } else if (valueType === 'Double') {
      material.setFloat(property, value);
    }
  }

  getProperty(objects, property, valueType) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    if (objects[0].sharedMaterials.size() === 0) {
      return new Amaz.Color();
    }
    const material = objects[0].sharedMaterials.get(0);
    if (valueType === 'Color') {
      const vec4 = material.getVec4(property);
      return new Amaz.Color(vec4.x, vec4.y, vec4.z, vec4.w);
    } else if (valueType === 'Texture2D') {
      return material.getTex(property);
    } else if (valueType === 'Double') {
      return material.getFloat(property);
    }
  }
}

exports.FaceMakeupMaterialProperty = FaceMakeupMaterialProperty;
