
local CGRuntime = CGRuntime or {}
CGRuntime.__index = CGRuntime

function CGRuntime.new()
    local self = setmetatable({}, CGRuntime)
    self.runtimeCount = 0;
    return self
end

function CGRuntime:getOutput(index)
    return self.runtimeCount
end

function CGRuntime:update(sys, deltaTime) 
    self.runtimeCount = self.runtimeCount + deltaTime
end

return CGRuntime