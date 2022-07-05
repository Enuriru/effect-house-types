local CGGetEntity = CGGetEntity or {}
CGGetEntity.__index = CGGetEntity

function CGGetEntity.new()
    local self = setmetatable({}, CGGetEntity)
    return self
end

function CGGetEntity:getOutput(index)
    return self.__graph.__component.entity
end


return CGGetEntity
