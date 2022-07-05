local ScriptComponentProperty = ScriptComponentProperty or {}
ScriptComponentProperty.__index = ScriptComponentProperty

function ScriptComponentProperty.new()
  local self = setmetatable({}, ScriptComponentProperty)
  return self
end

function ScriptComponentProperty:setProperty(objects, property, value)
  if #objects == 0 then
    return
  end
  local luaObject = Amaz.ScriptUtils.getLuaObj(objects[1]:getScript())
  luaObject[property] = value
end

function ScriptComponentProperty:getProperty(objects, property)
  if #objects == 0 then
    return nil
  end
  local luaObject = Amaz.ScriptUtils.getLuaObj(objects[1]:getScript())
  return luaObject[property]
end

return ScriptComponentProperty