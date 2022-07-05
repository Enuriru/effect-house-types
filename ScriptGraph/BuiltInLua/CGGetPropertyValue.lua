local CGGetPropertyValue = CGGetPropertyValue or {}
CGGetPropertyValue.__index = CGGetPropertyValue

function CGGetPropertyValue.new()
    local self = setmetatable({}, CGGetPropertyValue)
    self.object = nil
    self.property = nil
    self.propertyFunc = nil
    return self
end

function CGGetPropertyValue:getOutput(index)
    if self.propertyFunc == nil then
        return nil
    end
    local objects = {}
    objects[1] = self.object
    return self.propertyFunc:getProperty(objects, self.property, self.valueType)
end

return CGGetPropertyValue
