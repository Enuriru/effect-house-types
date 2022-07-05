--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2020/12/25
-- Time: 12:26
-- To change this template use File | Settings | File Templates.
--

local CGTimeSchedule = CGTimeSchedule or {}
CGTimeSchedule.__index = CGTimeSchedule

function CGTimeSchedule.new()
    local self = setmetatable({}, CGTimeSchedule)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.beginTime = 0
    self.enable = false
    self.duration = nil
    return self
end

function CGTimeSchedule:setNext(index, func)
    self.nexts[index] = func
end

function CGTimeSchedule:setInput(index, func)
    self.inputs[index] = func
end

function CGTimeSchedule:execute()
    -- Amaz.LOGE("INFO: ", "Begin Time Schedule !")
    self.enable = true
    self.beginTime = 0
    if self.nexts[0] then
        self.nexts[0]()
    end
    if self.inputs[1]() then
        self.duration = self.inputs[1]()
    end
end

function CGTimeSchedule:getOutput(index)
    if self.duration == nil or self.beginTime == 0 then
        return 0
    end
    if self.beginTime >= self.duration then
        return 1
    end
    -- Amaz.LOGE("INFO: ", "time schedule current progress is : " .. self.beginTime / self.duration)
    return self.beginTime / self.duration
end

function CGTimeSchedule:update(sys, deltaTime)
    if not self.enable then
        return
    end

    self.beginTime = self.beginTime + deltaTime
    if self.beginTime < self.duration then
        if self.nexts[1] then
            -- Amaz.LOGE("INFO: ", "Time Schedule is running !")
            self.nexts[1]()
        end
    end
    if self.beginTime >= self.duration then
        if self.nexts[2] then
            self.nexts[2]()
            -- Amaz.LOGE("INFO: ", "Time Schedule Finished !")
        end
        self.enable = false
    end
end

return CGTimeSchedule