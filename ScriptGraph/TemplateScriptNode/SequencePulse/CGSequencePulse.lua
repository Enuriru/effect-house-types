--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/14
-- Time: 4:19
-- To change this template use File | Settings | File Templates.
--

local CGSequencePulse = CGSequencePulse or {}
CGSequencePulse.__index = CGSequencePulse

function CGSequencePulse.new()
    local self = setmetatable({}, CGSequencePulse)
    self.nexts = {}
    self.inputs = {}
    self.sequence = {}
    self.current = 0
    return self
end

function CGSequencePulse:setNext(index, func)
    self.nexts[index] = func
end

function CGSequencePulse:setInput(index, func)
    self.inputs[index] = func
end

function CGSequencePulse:execute(index)
    if index == 0 then
        Amaz.LOGE("INFO:", "current index is: " .. self.current)
        self.sequence[self.current]()
        self.current = self.current % self.count + 1
    else
        -- index is sys
        local isRandom = self.inputs[1]()
        self.count = 0
        if self.nexts[0] then
            self.count = self.count + 1
            self.sequence[self.count] = self.nexts[0]
        end
        if self.nexts[1] then
            self.count = self.count + 1
            self.sequence[self.count] = self.nexts[1]
        end
        if self.nexts[2] then
            self.count = self.count + 1
            self.sequence[self.count] = self.nexts[2]
        end
        if self.nexts[3] then
            self.count = self.count + 1
            self.sequence[self.count] = self.nexts[3]
        end
        if self.nexts[4] then
            self.count = self.count + 1
            self.sequence[self.count] = self.nexts[4]
        end
        if isRandom == true then
            self.current = math.random(1, self.count)
        else
            self.current = 1
        end
    end

end

return CGSequencePulse


