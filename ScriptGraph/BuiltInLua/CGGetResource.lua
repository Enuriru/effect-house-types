local CGGetResource = CGGetResource or {}
CGGetResource.__index = CGGetResource

function CGGetResource.new()
    local self = setmetatable({}, CGGetResource)
    self.inputs = {}
    self.resourcePath = ''
    self.resource = nil
    return self
end

function CGGetResource:setInput(index, func)
    
end

function CGGetResource:getOutput(index)
    return self.resource
end

return CGGetResource
