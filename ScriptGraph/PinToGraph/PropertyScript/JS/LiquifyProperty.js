class LiquifyProperty {
  constructor() {}

  // To do: script component property get/set
  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    if (jsObject !== null && jsObject !== undefined) {
      const componentProperties = jsObject.component().properties;
      if (property === 'radius') {
        componentProperties.set(property, value * 12.0);
      } else {
        componentProperties.set(property, value);
      }
    }
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    if (jsObject !== null && jsObject !== undefined) {
      const componentProperties = jsObject.component().properties;
      if (property === 'radius') {
        return componentProperties.get(property) / 12;
      }
      return componentProperties.get(property);
    }
  }
}

exports.LiquifyProperty = LiquifyProperty;
