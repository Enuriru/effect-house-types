--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/14
-- Time: 6:12
-- To change this template use File | Settings | File Templates.
--

local CGSequenceRandom = CGSequenceRandom or {}
CGSequenceRandom.__index = CGSequenceRandom

function CGSequenceRandom.new()
    local self = setmetatable({}, CGSequenceRandom)
    self.nexts = {}
    self.inputs = {}
    self.sequence = {}
    self.current = 0
    return self
end

function CGSequenceRandom:setNext(index, func)
    self.nexts[index] = func
end

function CGSequenceRandom:setInput(index, func)
    self.inputs[index] = func
end

function CGSequenceRandom:execute(index)
    local count = 0
    if self.nexts[0] ~= nil then
        count = count + 1
        self.sequence[count] = self.nexts[0]
    end
    if self.nexts[1] ~= nil then
        count = count + 1
        self.sequence[count] = self.nexts[1]
    end
    if self.nexts[2] ~= nil then
        count = count + 1
        self.sequence[count] = self.nexts[2]
    end
    if self.nexts[3] ~= nil then
        count = count + 1
        self.sequence[count] = self.nexts[3]
    end
    if self.nexts[4] ~= nil then
        count = count + 1
        self.sequence[count] = self.nexts[4]
    end
    self.current = math.random(1, count)
    Amaz.LOGE("INFO:", "current index is: " .. self.current)
    self.sequence[self.current]()
end

return CGSequenceRandom