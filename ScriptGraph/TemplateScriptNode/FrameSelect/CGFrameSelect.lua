local CGFrameSelect = CGFrameSelect or {}
CGFrameSelect.__index = CGFrameSelect

function CGFrameSelect.new()
    local self = setmetatable({}, CGFrameSelect)
    self.nexts = {}
    self.inputs = {}
    self.outputs = {}
    return self
end

function CGFrameSelect:setInput(index, func)
    self.inputs[index] = func
end

function CGFrameSelect:getOutput(index)
    local idx = self.inputs[1]()
    local frames = self.inputs[0]()
    local rt = nil
    local rt_exists = false
    if idx > #frames then
        rt = nil
        rt_exists = false
    else 
        rt = frames[idx]
        rt_exists = true
    end

    if index == 0 then
        return rt
    elseif index == 1 then
        return rt_exists
    end
end


return CGFrameSelect