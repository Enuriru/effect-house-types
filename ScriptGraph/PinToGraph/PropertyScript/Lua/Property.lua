local Property = Property or {}
Property.__index = Property

local map = {}

function Property.new()
  local self = setmetatable({}, Property)
  return self
end

function Property:setProperty(objects, property, value)
  if #objects == 0 then
    return
  end
  if property == "localEulerAngle" then
    map[tostring(objects[1].guid)] = value
  end
  objects[1][property] = value
end

function Property:getProperty(objects, property)
  if #objects == 0 then
    return nil
  end
  if property == "localPosition" then
    local position = objects[1][property]
    return Amaz.Vector3f(position.x, position.y, position.z)
  elseif property == "localEulerAngle" then
    if map[tostring(objects[1].guid)] ~= nil then
      return map[tostring(objects[1].guid)]
    end
    return objects[1].localEulerAngle
  end
  return objects[1][property]
end

return Property