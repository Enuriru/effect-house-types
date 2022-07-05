local CGMultiply = CGMultiply or {}
CGMultiply.__index = CGMultiply

function CGMultiply.new()
    local self = setmetatable({}, CGMultiply)
    self.inputs = {}
    return self
end

function CGMultiply:setInput(index, func)
    self.inputs[index] = func
end

function CGMultiply:getOutput(index)
    local curType = self.valueType
    if curType == nil then
        -- Amaz.LOGE("ERROR: ", "CGMultiply do not have node type")
        return nil
    end
    local op1 = self.inputs[0]()
    local op2 = self.inputs[1]()
    if op1 == nil or op2 == nil then
        return nil
    end
    if curType == "Int" or curType == "Double" then
        return op1 * op2
    elseif curType == "Vector2f" then
        return Amaz.Vector2f(op1.x * op2.x, op1.y * op2.y)
    elseif curType == "Vector3f" then
        return Amaz.Vector3f(op1.x * op2.x, op1.y * op2.y, op1.z * op2.z)
    elseif curType == "Vector4f" then
        return Amaz.Vector4f(op1.x * op2.x, op1.y * op2.y, op1.z * op2.z, op1.w * op2.w)
    elseif curType == "Color" then
        return op1 * op2
    end
end

return CGMultiply