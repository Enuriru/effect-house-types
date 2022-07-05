local SharedMaterials = SharedMaterials or {}
SharedMaterials.__index = SharedMaterials

function SharedMaterials.new()
  local self = setmetatable({}, SharedMaterials)
  return self
end

function SharedMaterials:setProperty(objects, property, value)
  if #objects == 0 then
    return
  end
  local material = Amaz.Vector()
  material:pushBack(value)
  objects[1][property] = material
end

function SharedMaterials:getProperty(objects, property)
  if #objects == 0 then
    return
  end
  return objects[1][property]:get(0);
end

return SharedMaterials