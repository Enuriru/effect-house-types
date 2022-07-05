const Amaz = effect.Amaz;

class FaceMakeupProperty {
  constructor() {}

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return;
    }
    if (property === "offset" && value instanceof effect.Amaz.Vector2f) {
      objects[0]["xoffset"] = value.x;
      objects[0]["yoffset"] = value.y;
    } else {
      objects[0][property] = value;
      objects[0].setUniform(property, value);
    }
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    if (property === "offset") {
      let value = new effect.Amaz.Vector2f;
      value.x = objects[0]["xoffset"];
      value.y = objects[0]["yoffset"];
      return value;
    }
    return objects[0][property];
  }
}

exports.FaceMakeupProperty = FaceMakeupProperty;
