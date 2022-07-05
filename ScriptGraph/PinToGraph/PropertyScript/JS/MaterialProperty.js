const Amaz = effect.Amaz;

class MaterialProperty {
  constructor() {}

  setProperty(objects, property, value, valueType) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    if (valueType === 'Texture2D') {
      for (let obj of objects) {
        if (obj) {
          obj.setTex(property, value);
        }
      }
    } else if (valueType === 'Color') {
      for (let obj of objects) {
        if (obj) {
          obj.setVec4(property, new Amaz.Vector4f(value.r, value.g, value.b, value.a));
        }
      }
    } else if (valueType === 'Float') {
      for (let obj of objects) {
        if (obj) {
          obj.setFloat(property, value);
        }
      }
    } else if (valueType === 'Vec2') {
      for (let obj of objects) {
        if (obj) {
          obj.setVec2(property, value);
        }
      }
    } else if (valueType === 'Vec3') {
      for (let obj of objects) {
        if (obj) {
          obj.setVec3(property, value);
        }
      }
    } else if (valueType === 'Vec4') {
      for (let obj of objects) {
        if (obj) {
          obj.setVec4(property, value);
        }
      }
    }
  }

  getProperty(objects, property, valueType) {
    if (!Array.isArray(objects) || objects.length === 0 || objects[0] === null || objects[0] === undefined) {
      return null;
    }
    if (valueType === 'Texture2D') {
      return objects[0].getTex(property);
    } else if (valueType === 'Color') {
      const vec4 = objects[0].getVec4(property);
      return new Amaz.Color(vec4.x, vec4.y, vec4.z, vec4.w);
    }
  }
}

exports.MaterialProperty = MaterialProperty;
