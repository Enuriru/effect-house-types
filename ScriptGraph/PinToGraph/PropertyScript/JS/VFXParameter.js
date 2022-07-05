const Amaz = effect.Amaz;

class VFXParameter {
  constructor() {}

  setProperty(objects, property, value, valueType) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null;
    }
    if (valueType === 'Vector4f') {
      for (let obj of objects) {
        if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
                if(obj.getCtxBlock(i).exposeProperties.getVec4(property))
                  obj.getCtxBlock(i).exposeProperties.setVec4(property, value);
            }
        }
      }
    } 
    else if (valueType === 'Vector3f') {
        for (let obj of objects) {
          if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
              if(obj.getCtxBlock(i).exposeProperties.getVec4(property))
                obj.getCtxBlock(i).exposeProperties.setVec4(property, new Amaz.Vector4f(value.x, value.y, value.z, 0.0));
            }
          }
        }
    }
    else if (valueType === 'Vector2f') {
        for (let obj of objects) {
          if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
              if(obj.getCtxBlock(i).exposeProperties.getVec2(property))
                obj.getCtxBlock(i).exposeProperties.setVec2(property, value);
            }
          }
        }
    }
    else if (valueType === 'Int') {
        for (let obj of objects) {
          if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
              if(obj.getCtxBlock(i).exposeProperties.getInt(property))
                obj.getCtxBlock(i).exposeProperties.setInt(property, value);
            }
          }
        }
    }
    else if (valueType === 'Double') {
        for (let obj of objects) {
          if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
              if(obj.getCtxBlock(i).exposeProperties.getFloat(property))
                obj.getCtxBlock(i).exposeProperties.setFloat(property, value);
            }
          }
        }
    }
    else if (valueType === 'Color') {
      for (let obj of objects) {
        if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
              if(obj.getCtxBlock(i).exposeProperties.getVec4(property))
                obj.getCtxBlock(i).exposeProperties.setVec4(property, new Amaz.Vector4f(value.r, value.g, value.b, value.a));
            }
        }
      }
    }
    else if (valueType === 'Texture2D') {
      for (let obj of objects) {
        if (obj) {
            for(var i = 0; i < obj.ctxBlocks.size(); i++){
              if(obj.getCtxBlock(i).exposeProperties.getTex(property))
                obj.getCtxBlock(i).exposeProperties.setTex(property, value);
            }
        }
      }
    }
  }

  getProperty(objects, property, valueType) {
    if (!Array.isArray(objects) || objects.length === 0 || objects[0] === null || objects[0] === undefined) {
      return null;
    }
    if (valueType === 'Vector4f') {
    //   return objects[0].getTex(property);
        return new Amaz.Vector4f(0, 0, 0, 0);
    } else if (valueType === 'Color') {
    //   const vec4 = objects[0].getVec4(property);
    //   return new Amaz.Color(vec4.x, vec4.y, vec4.z, vec4.w);
        return new Amaz.Color(0, 0, 0, 0);
    }
  }
}

exports.VFXParameter = VFXParameter;
