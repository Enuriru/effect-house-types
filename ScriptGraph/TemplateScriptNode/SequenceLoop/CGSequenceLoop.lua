--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/14
-- Time: 5:03
-- To change this template use File | Settings | File Templates.
--

local CGSequenceLoop = CGSequenceLoop or {}
CGSequenceLoop.__index = CGSequenceLoop

function CGSequenceLoop.new()
    local self = setmetatable({}, CGSequenceLoop)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.sequence = {}
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

function CGSequenceLoop:setNext(index, func)
    self.nexts[index] = func
end

function CGSequenceLoop:setInput(index, func)
    self.inputs[index] = func
end

function CGSequenceLoop:update(sys, dt)
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
        self.sequence[self.current]()
        self.current = self.current % self.count + 1
        self.lastTriggeredTime = self.timeUsed
        if self.current == 1 then
            self.loop = self.loop + 1
        end
        if self.__contextStack ~= nil and #self.__contextStack > 0 then
            if self.__contextStack[#self.__contextStack][1] == "return" then
                self.enable = false
                return
            end
        end
    end
end

function CGSequenceLoop:execute(index)
    if index == 1 then
        self.enable = false
        return
    end
    local isRandom = self.inputs[2]()
    self.loops = self.inputs[3]()
    self.interval = self.inputs[4]()
    if index == 0 then
        self.enable = true
        self.timeUsed = 0
        self.lastTriggeredTime = 0
        self.count = 0
        self.loop = 0
        for i = 0, 4, 1 do
            if self.nexts[i] ~= nil then
                self.count = self.count + 1
                self.sequence[self.count] = self.nexts[i]
            end
        end
        if isRandom == true then
            self.current = math.random(1, self.count)
        else
            self.current = 1
        end
        self.sequence[self.current]()
        self.current = self.current % self.count + 1
    end
end

return CGSequenceLoop