--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/12
-- Time: 7:39
-- To change this template use File | Settings | File Templates.
--

local CGTextureLoopSequence = CGTextureLoopSequence or {}
CGTextureLoopSequence.__index = CGTextureLoopSequence

function CGTextureLoopSequence.new()
    local self = setmetatable({}, CGTextureLoopSequence)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.textureArray = {}
    self.current = 0
    self.enable = false
    self.timeUsed = 0
    self.lastTriggeredTime = 0
    self.loops = 0
    self.loop = 0
    self.interval = 0
    self.count = 0
    return self
end

function CGTextureLoopSequence:setNext(index, func)
    self.nexts[index] = func
end

function CGTextureLoopSequence:setInput(index, func)
    self.inputs[index] = func
end

function CGTextureLoopSequence:getOutput(index)
    return self.outputs[index]
end

function CGTextureLoopSequence:update(sys, dt)
    if self.enable == false then
        return
    end
    if self.loop >= self.loops then
        self.enable = false
        return
    end
    self.timeUsed = self.timeUsed + dt
    if self.timeUsed - self.lastTriggeredTime > self.interval then
        Amaz.LOGE("INFO:", "current index is: " .. self.current)
        self.outputs[2] = self.textureArray[self.current]
        self.current = self.current % self.count + 1
        self.lastTriggeredTime = self.timeUsed
        if self.current == 1 then
            self.loop = self.loop + 1
        end
        if self.nexts[1] ~= nil then
            self.nexts[1]()
        end
        if self.__contextStack ~= nil and #self.__contextStack > 0 then
            if self.__contextStack[#self.__contextStack][1] == "return" then
                self.enable = false
                return
            end
        end
    end
end

function CGTextureLoopSequence:execute(index)
    if index == 1 then
        self.enable = false
        if self.nexts[0] ~= nil then
            self.nexts[0]()
        end
        return
    end
    local isRandom = self.inputs[7]()
    self.loops = self.inputs[8]()
    self.interval = self.inputs[9]()
    if index == 0 then
        self.enable = true
        self.timeUsed = 0
        self.lastTriggeredTime = 0
        self.count = 0
        self.loop = 0
        for i=2, 6, 1 do
            if self.inputs[i]() ~= nil then
                self.count = self.count + 1
                self.textureArray[self.count] = self.inputs[i]()
            end
        end
        if isRandom == true then
            self.current = math.random(1, self.count)
        else
            self.current = 1
        end
        self.outputs[2] = self.textureArray[self.current]
        self.current = self.current % self.count + 1
        if self.current == 1 then
            self.loop = self.loop + 1
        end
        if self.nexts[1] ~= nil then
            self.nexts[1]()
        end
        if self.nexts[0] ~= nil then
            self.nexts[0]()
        end
    end
end

return CGTextureLoopSequence