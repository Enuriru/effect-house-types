const Amaz = effect.Amaz;

const map = {};

class Property {
  constructor() {}

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return;
    }
    if (property === 'localEulerAngle') {
      map[objects[0].guid.toString()] = value;
    } else if (objects[0] instanceof Amaz.FaceStretchComponent && property === 'Intensity') {
      objects[0][property] = value / 100.0;
      return;
    }
    objects[0][property] = value;
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    if (property === 'localPosition') {
      const position = objects[0][property];
      return new Amaz.Vector3f(position.x, position.y, position.z);
    } else if (property === 'localEulerAngle') {
      if (map[objects[0].guid.toString()] !== undefined) {
        return map[objects[0].guid.toString()];
      }
      return objects[0][property];
    } else if (objects[0] instanceof Amaz.FaceStretchComponent && property === 'Intensity') {
      return objects[0][property] * 100;
    }
    return objects[0][property];
  }
}

exports.Property = Property;
