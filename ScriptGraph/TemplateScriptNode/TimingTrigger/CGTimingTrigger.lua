--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/15
-- Time: 2:08
-- To change this template use File | Settings | File Templates.
--

local CGTimingTrigger = CGTimingTrigger or {}
CGTimingTrigger.__index = CGTimingTrigger

function CGTimingTrigger.new()
    local self = setmetatable({}, CGTimingTrigger)
    self.inputs = {}
    self.nexts = {}
    self.enable = false
    self.infinity = false
    self.interval = nil
    self.loops = nil
    self.curLoop = 0
    self.triggerFirstFrame = nil
    self.timeUsed = 0
    self.lastTriggeredTime = 0
    return self
end

function CGTimingTrigger:setInput(index, func)
    self.inputs[index] = func
end

function CGTimingTrigger:setNext(index, func)
    self.nexts[index] = func
end

function CGTimingTrigger:update(sys, dt)
    if self.enable ~= true then
        return
    end
    if self.loops <= 0 then
        return
    end
    self.timeUsed = self.timeUsed + dt
    if self.timeUsed - self.lastTriggeredTime >= self.interval then
        if self.nexts[0] then
            self.nexts[0]()
        end
        self.curLoop = self.curLoop + 1
        self.lastTriggeredTime = self.timeUsed
        if self.curLoop >= self.loops and self.infinity ~= true then
            self.enable = false
        end
    end
end

function CGTimingTrigger:execute(sys)
    self.timeUsed = 0
    self.lastTriggeredTime = 0
    self.curLoop = 0
    self.loops = self.inputs[0]()
    self.interval = self.inputs[1]()
    self.triggerFirstFrame = self.inputs[2]()
    if self.loops == 9999 then
        self.infinity = true
    end
    if self.loops ~= nil and self.interval ~= nil then
        self.enable = true
    end
    if self.inputs[2] ~= nil then
        if self.inputs[2]() == true then
            self.loops = self.loops - 1
            if self.nexts[0] then
                self.nexts[0]()
            end
        end
    end
end

return CGTimingTrigger