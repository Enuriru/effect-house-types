local CGVectorSelect = CGVectorSelect or {}
CGVectorSelect.__index = CGVectorSelect

function CGVectorSelect.new()
    local self = setmetatable({}, CGVectorSelect)
    self.outputs = {}
    self.inputs = {}
    return self
end

function CGVectorSelect:setInput(index, func)
    self.inputs[index] = func
end

function CGVectorSelect:getOutput(index)
    local vec = self.inputs[0]()
    local i = self.inputs[1]()
    if index == 0 then
        if vec ~= nil and i >= 0 and i < vec:size() then
            return vec:get(i)
        end
        return nil
    else
        return vec:size()
    end
end

return CGVectorSelect
