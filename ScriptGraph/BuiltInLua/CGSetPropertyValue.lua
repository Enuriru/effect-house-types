local CGSetPropertyValue = CGSetPropertyValue or {}
CGSetPropertyValue.__index = CGSetPropertyValue

function CGSetPropertyValue.new()
    local self = setmetatable({}, CGSetPropertyValue)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.object = nil
    self.property = nil
    self.propertyFunc = nil
    self.resource = nil
    self.resourcePath = nil
    return self
end

function CGSetPropertyValue:setNext(index, node)
    self.nexts[index] = node
end

function CGSetPropertyValue:setInput(index, func)
    self.inputs[index] = func
end

function CGSetPropertyValue:getOutput(index)
    return self.outputs[index]
end

function CGSetPropertyValue:execute()
    if self.object == nil or self.property == nil or self.propertyFunc == nil then
        return
    end
    Amaz.LOGE("AE_LUA_TAG", "property:"..self.valueType)
    local inputValue = self.inputs[1]();
    if inputValue == nil then
        if self.valueType == 'Mesh' or self.valueType == 'Material' or self.valueType == 'Texture2D' then
            inputValue = self.resource
        end
    end
    local objects = {}
    objects[1] = self.object
    self.propertyFunc:setProperty(objects, self.property, inputValue, self.valueType)
    if self.nexts[0] then
        self.nexts[0]()
    end
    return true
end

return CGSetPropertyValue
