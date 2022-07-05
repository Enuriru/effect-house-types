--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/6/2
-- Time: 1:59
-- To change this template use File | Settings | File Templates.
--

local CGCollisionBoxDetection = {} or CGCollisionBoxDetection
CGCollisionBoxDetection.__index = CGCollisionBoxDetection

function CGCollisionBoxDetection.new()
    local self = setmetatable({}, CGCollisionBoxDetection)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.box1 = nil
    self.box2 = nil
    self.rigidBody1 = nil
    self.rigidBody2 = nil
    self.collision = false
    return self
end

function CGCollisionBoxDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGCollisionBoxDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGCollisionBoxDetection:execute(index)
    if self.inputs[1] == nil or self.inputs[2] == nil then
        return
    end
    self.box1 = self.inputs[1]();
    self.box2 = self.inputs[2]();
    self.rigidBody1 = self.box1.entity:getComponent("RigidBody3D")
    self.rigidBody2 = self.box2.entity:getComponent("RigidBody3D")
    if self.rigidBody1 == nil or self.rigidBody2 == nil then
        Amaz.LOGE("INFO: " , " CGCollisionBoxDetection rigidBody is nil")
        return
    end
    if index == 0 then
        if self.collision == true then
            if self.nexts[0] then
                self.nexts[0]()
            end
        elseif self.collision == false then
            if self.nexts[1] then
                self.nexts[1]()
            end
        end
    else
        index:addScriptListener(self.rigidBody1, Amaz.Collision3DEventType.ENTER, "onCallBack", index)
        index:addScriptListener(self.rigidBody1, Amaz.Collision3DEventType.STAY, "onCallBack", index)
        index:addScriptListener(self.rigidBody1, Amaz.Collision3DEventType.EXIT, "onCallBack", index)
    end
end

function CGCollisionBoxDetection:callback(sys, userData, eventType)
    if eventType ~= Amaz.Collision3DEventType.ENTER and eventType ~= Amaz.Collision3DEventType.STAY and eventType ~= Amaz.Collision3DEventType.EXIT then
        return
    end
    local other = userData.otherRigidbody
    if other == nil then
        return
    end
    if other == self.rigidBody2 then
        if eventType == Amaz.Collision3DEventType.ENTER then
            self.collision = true
        elseif eventType == Amaz.Collision3DEventType.EXIT then
            self.collision = false
        end
    end
end

return CGCollisionBoxDetection