const Amaz = effect.Amaz;

class FilterProperty {
  constructor() {}

  setProperty(objects, property, value) {
    console.warn('setFilterProperty');
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    console.warn(property);
    jsObject.propertiesMap.set(property, value);
  }

  getProperty(objects, property) {
    console.warn('getFilterProperty');
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    const jsObject = objects[0].getScript().ref;
    return jsObject.propertiesMap.get(property);
  }
}

exports.FilterProperty = FilterProperty;
