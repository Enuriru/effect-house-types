local CGBlingHighLight = CGBlingHighLight or {}
CGBlingHighLight.__index = CGBlingHighLight

function CGBlingHighLight.new()
    local self = setmetatable({}, CGBlingHighLight)
    self.nexts = {}
    self.outputs = {}
    return self
end

function CGBlingHighLight:setNext(index, func)
    self.nexts[index] = func
end

function CGBlingHighLight:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    if result == nil then
        return nil
    end
    local bling = result:getBlingInfo()
    if bling == nil then
        return nil
    end
    self.outputs[1] = bling.points
    if self.nexts[0] then
        self.nexts[0]()
    end
end

function CGBlingHighLight:setInput(index, func)

end

function CGBlingHighLight:getOutput(index)
    return self.outputs[index]
end

return CGBlingHighLight
