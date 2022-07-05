local CGEqualsExactly = CGEqualsExactly or {}
CGEqualsExactly.__index = CGEqualsExactly

function CGEqualsExactly.new()
    local self = setmetatable({}, CGEqualsExactly)
    self.inputs = {}
    return self
end

function CGEqualsExactly:setInput(index, func)
    self.inputs[index] = func
end

function CGEqualsExactly:getOutput(index)
    return self.inputs[0]() == self.inputs[1]()
end

return CGEqualsExactly
