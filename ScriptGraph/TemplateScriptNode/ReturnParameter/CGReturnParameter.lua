local CGReturnParameter = CGReturnParameter or {}
CGReturnParameter.__index = CGReturnParameter

function CGReturnParameter.new()
    local self = setmetatable({}, CGReturnParameter)
    self.Value = Amaz.Vec3Vector()
    self.Index = 0
    return self
end

function CGReturnParameter:execute(value, index)
    if value == nil then
        return self.Value:get(self.Index)
    end
    self.Value = value
    self.Index = index

    if self.Value:size() <= self.Index then
        return Amaz.Vector3f(0, 0, 0)
    end
    return self.Value:get(self.Index)
end

return CGReturnParameter
