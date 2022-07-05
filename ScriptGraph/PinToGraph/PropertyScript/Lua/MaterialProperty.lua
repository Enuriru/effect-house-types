local MaterialProperty = MaterialProperty or {}
MaterialProperty.__index = MaterialProperty

function MaterialProperty.new()
  local self = setmetatable({}, MaterialProperty)
  return self
end

function MaterialProperty:setProperty(objects, property, value, valueType)
  -- Amaz.LOGE("Texture2D: ", valueType)
  if #objects == 0 then
    return
  end
  if valueType == "Texture2D" then
    --Amaz.LOGE("Texture2D: ", property)
    objects[1]:setTex(property, value)
  elseif valueType == "Color" then
    objects[1]:setVec4(property, Amaz.Vector4f(value.r, value.g, value.b, value.a))
  end
end

function MaterialProperty:getProperty(objects, property, valueType)
  if #objects == 0 then
    return nil
  end
  if valueType == "Texture2D" then
    return objects[1]:getTex(property)
  elseif valueType == "Color" then
    local vec4 = objects[1]:getVec4(property)
    return Amaz.Color(vec4.x, vec4.y, vec4.z, vec4.w)
  end
end

return MaterialProperty