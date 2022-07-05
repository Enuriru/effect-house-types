const Amaz = effect.Amaz;

class ScriptComponentProperty {
  constructor() {}

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    jsObject[property] = value;
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    return jsObject[property];
  }
}

exports.ScriptComponentProperty = ScriptComponentProperty;
