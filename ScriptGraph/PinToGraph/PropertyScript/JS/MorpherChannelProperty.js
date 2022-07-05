const Amaz = effect.Amaz;

class MorpherChannelProperty {
  constructor() {}

  setProperty(objects, property, value) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return;
    }
    objects[0].setChannelWeight(property, value);
  }

  getProperty(objects, property) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    return objects[0].getChannelWeight(property);
  }
}

exports.MorpherChannelProperty = MorpherChannelProperty;
