local CGOnUpdateFrame = CGOnUpdateFrame or {}
CGOnUpdateFrame.__index = CGOnUpdateFrame

function CGOnUpdateFrame.new()
    local self = setmetatable({}, CGOnUpdateFrame)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}
    self.countdown = -1
    self.count = 0
    return self
end

function CGOnUpdateFrame:setNext(index, func)
    self.nexts[index] = func
end

function CGOnUpdateFrame:getOutput(index)
    return self.outputs[index]
end

function CGOnUpdateFrame:setInput(index, func)
    self.inputs[index] = func
end

function CGOnUpdateFrame:update(sys, deltaTime)
    local times = self.inputs[0]()
    if times < 9999 and self.count >= times then
        return
    end

    if self.countdown == -1 then
        if self.inputs[2]() then
            self.countdown = 0
        else
           self.countdown = self.inputs[1]()
        end
    end

    if self.countdown == 0 then
        if self.nexts[0] then
            self.nexts[0]()
        end
        self.countdown = self.inputs[1]()
        if times < 9999 then
            self.count = self.count + 1
        end
    else
        self.countdown = self.countdown - 1
    end
end

return CGOnUpdateFrame
