--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/12
-- Time: 5:30
-- To change this template use File | Settings | File Templates.
--

local CGTexturePulseSequence = CGTexturePulseSequence or {}
CGTexturePulseSequence.__index = CGTexturePulseSequence

function CGTexturePulseSequence.new()
    local self = setmetatable({}, CGTexturePulseSequence)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.textureArray = {}
    self.current = 0
    return self
end

function CGTexturePulseSequence:setNext(index, func)
    self.nexts[index] = func
end

function CGTexturePulseSequence:setInput(index, func)
    self.inputs[index] = func
end

function CGTexturePulseSequence:getOutput(index)
    return self.outputs[index]
end

function CGTexturePulseSequence:execute(index)
    if index == 0 then
        Amaz.LOGE("INFO:", "current index is: " .. self.current)
        self.outputs[1] = self.textureArray[self.current]
        self.current = self.current % self.count + 1
        if self.nexts[0] ~= nil then
            self.nexts[0]()
        end
    else
        -- index is sys
        self.count = 0
        for i=1, 5, 1 do
            if self.inputs[i]() ~= nil then
                self.count = self.count + 1
                self.textureArray[self.count] = self.inputs[i]()
            end
        end
        local isRandom = self.inputs[6]()
        if isRandom == true then
            self.current = math.random(1, self.count)
        else
            self.current = 1
        end
    end
end

return CGTexturePulseSequence