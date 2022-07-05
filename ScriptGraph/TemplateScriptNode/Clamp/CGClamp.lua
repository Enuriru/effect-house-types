local CGClamp = CGClamp or {}
CGClamp.__index = CGClamp

function CGClamp.new()
    local self = setmetatable({}, CGClamp)
    self.inputs = {}
    return self
end

function CGClamp:setInput(index, func)
    self.inputs[index] = func
end

function CGClamp:getOutput(index)
    local v = self.inputs[0]()
    local minv = self.inputs[1]()
    local maxv = self.inputs[2]()
    if (v < minv) then
        return minv
    elseif (v > maxv) then
        return maxv
    else
        return v 
    end
end

return CGClamp
