local CGBlingBling = CGBlingBling or {}
CGBlingBling.__index = CGBlingBling

function CGBlingBling.new()
    local self = setmetatable({}, CGBlingBling)
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGBlingBling:setNext(index, func)
    self.nexts[index] = func
end

function CGBlingBling:getOutput(index)
    return self.outputs[index]
end

function CGBlingBling:execute()
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

return CGBlingBling
