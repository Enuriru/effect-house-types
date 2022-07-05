const amg = require('./dist/amg.cjs.development');

const Amaz = effect.Amaz;

class BlingProperty {
  constructor() {}

  // To do: script component property get/set
  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    jsObject.propertiesMap.set(property, value);
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    return jsObject.propertiesMap.get(property);
  }
}

exports.BlingProperty = BlingProperty;
