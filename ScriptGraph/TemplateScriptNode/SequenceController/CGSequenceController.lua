--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2020/12/22
-- Time: 15:13
-- To change this template use File | Settings | File Templates.
--

local CGSequenceController = CGSequenceController or {}
CGSequenceController.__index = CGSequenceController

function CGSequenceController.new()
    local self = setmetatable({}, CGSequenceController)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.component = nil
    self.loopCount = 1
    self.startFrame = 0
    self.endFrame = 0
    self.frameCount = 1
    self.playFrameCount = 1
    self.stayLastFrame = true
    self.state = nil
    return self
end

function CGSequenceController:setNext(index, func)
    self.nexts[index] = func
end

function CGSequenceController:setInput(index, func)
    self.inputs[index] = func
end

function CGSequenceController:getOutput(index)
    return self.outputs[index]
end

function CGSequenceController:update(sys, dt)
    if self.component ~= nil then
        if self.state == "play" or self.state == "pause" then
            self.outputs[3] = self.component.frameIndex
        elseif self.state == "stop" or self.state == "reset" then
            self.outputs[3] = 0
        end
    end
end

function CGSequenceController:execute(index)
    if self.inputs[4] == nil then
        return
    end
    self.component = self.inputs[4]()
    if self.component == nil then
        return
    end

    self.frameCount = self.component.animSeq:getFrameCount()
    -- frame range : 0 to frameCount-1
    self.startFrame = self.inputs[5]()
    if self.startFrame >= self.frameCount then
        self.startFrame = self.frameCount - 1
    end
    self.endFrame = self.inputs[6]()
    if self.endFrame >= self.frameCount or self.endFrame == 9999 then
        self.endFrame = self.frameCount - 1
    end
    self.playFrameCount = self.endFrame - self.startFrame
    self.loopCount = self.inputs[7]()
    if self.loopCount == 9999 then
        self.loopCount = -1
    end
    self.stayLastFrame = self.inputs[8]()

    if index == 0 then
        self.component:playFromTo(self.startFrame, self.endFrame, Amaz.PlayMode.loop, self.loopCount, self.stayLastFrame)
        self.component:play()
        self.state = "play"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif index == 1 then
        self.component:stop()
        self.state = "stop"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif index == 2 then
        self.component:pause()
        self.state = "pause"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif index == 3 then
        self.component:resetAnim()
        self.state = "reset"
        if self.nexts[0] then
            self.nexts[0]()
        end
    else
        index:addScriptListener(self.component,  Amaz.AnimSeqEventType.ANIMSEQ_START, "onCallBack", index)
        index:addScriptListener(self.component, Amaz.AnimSeqEventType.ANIMSEQ_END, "onCallBack", index)
    end
end

function CGSequenceController:callback(sys, userData, eventType)
    local animSeqComp = userData.animSeqCom
    if animSeqComp == nil then
        return
    end
    local guid = animSeqComp.entity.guid
    local index = userData.keyIndex
    if self.component.entity.guid == guid then
        if eventType == 1001 then
            if self.nexts[1] then
                self.nexts[1]()
            end
        elseif eventType == 1002 then
            if self.nexts[2] then
                self.nexts[2]()
            end
        end
    end
end

return CGSequenceController