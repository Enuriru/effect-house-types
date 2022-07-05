local CGMatrixGetColumn = CGMatrixGetColumn or {}
CGMatrixGetColumn.__index = CGMatrixGetColumn

function CGMatrixGetColumn.new()
    local self = setmetatable({}, CGMatrixGetColumn)
    self.outputs = {}
    self.inputs = {}
    return self
end

function CGMatrixGetColumn:setInput(index, func)
    self.inputs[index] = func
end

function CGMatrixGetColumn:getOutput(index)
    local matrix = self.inputs[0]()
    local i = self.inputs[1]()
    return matrix:getColumn(i)
end

return CGMatrixGetColumn
