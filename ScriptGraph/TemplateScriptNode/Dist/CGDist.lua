local CGDist = CGDist or {}
CGDist.__index = CGDist

function CGDist.new()
    local self = setmetatable({}, CGDist)
    self.inputs = {}
    return self
end

function CGDist:setInput(index, func)
    self.inputs[index] = func
end

function CGDist:getOutput(index)
    local value_type = self.valueType
    if value_type == nil then
        return nil
    end
    local value_1 = self.inputs[0]()
    local value_2 = self.inputs[1]()
    if value_1 == nil or value_2 == nil then
        return nil
    end
    if value_type == "Vector2f" then
        return math.sqrt((value_1.x - value_2.x) * (value_1.x - value_2.x) + (value_1.y - value_2.y) * (value_1.y - value_2.y))
    elseif value_type == "Vector3f" then
        return math.sqrt((value_1.x - value_2.x) * (value_1.x - value_2.x) + (value_1.y - value_2.y) * (value_1.y - value_2.y) + (value_1.z - value_2.z) * (value_1.z - value_2.z))
    end
end

return CGDist
