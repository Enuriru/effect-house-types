const Amaz = effect.Amaz;

/**
 * This is different from ScriptComponentProperty.js, using properties of the scriptComponent.
 */
class ScriptComponentPropertyV2 {
  constructor() {}

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    objects[0].properties.set(property, value);
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    return objects[0].properties.get(property);
  }
}

exports.ScriptComponentPropertyV2 = ScriptComponentPropertyV2;
