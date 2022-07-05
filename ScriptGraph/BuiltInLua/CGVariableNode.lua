local CGVariableNode = CGVariableNode or {}
CGVariableNode.__index = CGVariableNode

function CGVariableNode.new()
  local self = setmetatable({}, CGVariableNode)
  self.inputs = {}
  self.nexts = {}
  self.variables = nil
  self.variableName = nil
  self.accessType = nil
  return self
end

function CGVariableNode:setInput(index, func)
  self.inputs[index] = func
end

function CGVariableNode:setNext(index, func)
  self.nexts[index] = func
end

function CGVariableNode:getOutput(index)
  return self.variables[self.variableName]
end

function CGVariableNode:execute()
  if self.accessType == 'SETTER' then
    local inputValue = self.inputs[1]()
    if inputValue == nil then
      if self.valueType == 'Texture2D' then
        inputValue = this.resource
      end
    end
    self.variables[self.variableName] = inputValue
    if self.nexts[0] ~= nil then
      self.nexts[0]()
    end
  end
end

return CGVariableNode