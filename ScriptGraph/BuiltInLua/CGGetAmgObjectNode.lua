local CGAmgObjectNode = CGAmgObjectNode or {}
CGAmgObjectNode.__index = CGAmgObjectNode

function CGAmgObjectNode.new()
    local self = setmetatable({}, CGAmgObjectNode)
    self.object = nil
    return self
end

function CGAmgObjectNode:getOutput(index)
    return self.object
end

return CGAmgObjectNode
