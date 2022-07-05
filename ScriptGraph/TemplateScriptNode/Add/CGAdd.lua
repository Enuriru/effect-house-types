local CGAdd = CGAdd or {}
CGAdd.__index = CGAdd

function CGAdd.new()
    local self = setmetatable({}, CGAdd)
    self.inputs = {}
    return self
end

function CGAdd:setInput(index, func)
    self.inputs[index] = func
end

function CGAdd:getOutput(index)
    local v1 = self.inputs[0]()
    local v2 = self.inputs[1]()
    if v1 == nil or v2 == nil then
        return nil
    end
    return self.inputs[0]() + self.inputs[1]()
end

return CGAdd
