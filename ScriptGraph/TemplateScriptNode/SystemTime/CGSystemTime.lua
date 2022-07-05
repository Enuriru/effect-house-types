
local CGSystemTime = CGSystemTime or {}
CGSystemTime.__index = CGSystemTime

function CGSystemTime.new()
    local self = setmetatable({}, CGSystemTime)
    self.outputs = {}
    return self
end

function CGSystemTime:getOutput(index)
    return self.outputs[index]
end

function CGSystemTime:update()
    self.outputs[0] = tonumber(os.date("%Y"))
    self.outputs[1] = tonumber(os.date("%m"))
    self.outputs[2] = tonumber(os.date("%d"))
    self.outputs[3] = tonumber(os.date("%H"))
    self.outputs[4] = tonumber(os.date("%M"))
    self.outputs[5] = tonumber(os.date("%S"))
end

return CGSystemTime
