local LightColorProperty = LightColorProperty or {}
LightColorProperty.__index = LightColorProperty

function LightColorProperty.new()
  local self = setmetatable({}, LightColorProperty)
  return self
end

function LightColorProperty:setProperty(objects, property, value)
  if #objects == 0 then
    return
  end
  objects[1][property] = Amaz.Vector3f(value.r, value.g, value.b)
end

function LightColorProperty:getProperty(objects, property)
  if #objects == 0 then
    return nil
  end
  local vec3 = objects[1][property]
  return Amaz.Color(vec3.x, vec3.y, vec3.z, 1.0)
end

return LightColorProperty