--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/14
-- Time: 10:57
-- To change this template use File | Settings | File Templates.
--
local CGTextureRandomSequence = CGTextureRandomSequence or {}
CGTextureRandomSequence.__index = CGTextureRandomSequence

function CGTextureRandomSequence.new()
    local self = setmetatable({}, CGTextureRandomSequence)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.textureArray = {}
    self.current = 0
    return self
end

function CGTextureRandomSequence:setNext(index, func)
    self.nexts[index] = func
end

function CGTextureRandomSequence:setInput(index, func)
    self.inputs[index] = func
end

function CGTextureRandomSequence:getOutput(index)
    return self.outputs[index]
end

function CGTextureRandomSequence:execute(index)
    local count = 0
    for i=1, 5, 1 do
        if self.inputs[i]() ~= nil then
            count = count + 1
            self.textureArray[count] = self.inputs[i]()
        end
    end
    self.current = math.random(1, count)
    Amaz.LOGE("INFO:", "current index is: " .. self.current)
    self.outputs[1] = self.textureArray[self.current]
    if self.nexts[0] ~= nil then
        self.nexts[0]()
    end
end

return CGTextureRandomSequence