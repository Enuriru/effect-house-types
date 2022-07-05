--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/16
-- Time: 3:26
-- To change this template use File | Settings | File Templates.
--

local CGSpinAround3D = {} or CGSpinAround3D
CGSpinAround3D.__index = CGSpinAround3D

function CGSpinAround3D.new()
    local self = setmetatable({}, CGSpinAround3D)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.enable = false
    self.combNum = {}
    self.rotateTime = nil
    self.rotateAngle = nil
    self.loops = nil
    self.loop = 0
    self.originPt = nil
    self.normRotateAxis = nil
    self.initPos = nil
    self.curve = nil
    self.transfrom = nil
    self.curTime = 0
    self.infinity = false
    self.curAngle = 0
    self.lastAngle = 0
    self.state = "Stop"
    self.autoSelfRotate = true
    return self
end

function CGSpinAround3D:setNext(index, func)
    self.nexts[index] = func
end

function CGSpinAround3D:setInput(index, func)
    self.inputs[index] = func
end

function CGSpinAround3D:getOutput(index)
    return self.outputs[index]
end

function CGSpinAround3D:execute(index)
    if index == 3 then
        self.enable = false
        self.state = "Stop"
        if self.initPos ~= nil then
            self.transfrom:setWorldPosition(self.initPos)
        end
    elseif index == 1 then
        self.enable = false
        self.state = "Pause"
    elseif index == 2 then
        self.enable = true
        self.state = "Resume"
    elseif index == 0 then
        self.enable = true
        if self.inputs[4] == nil then
            Amaz.LOGE("INFO: ", "CGSpinAround3D get empty transfrom")
            return
        end
        if self.initPos ~= nil then
            self.transfrom:setWorldPosition(self.initPos)
        end
        self.transfrom = self.inputs[4]()
        self.originPt = self.inputs[5]()
        self.normRotateAxis = self.inputs[6]():normalizeSafe(Amaz.Vector3f(0, 0 ,1))
        self.rotateAngle = math.pi * self.inputs[7]() / 180
        self.curve = self.inputs[8]()
        self.rotateTime = self.inputs[9]()
        self.loops = self.inputs[10]()
        self.loop = 0
        self.autoSelfRotate = not self.inputs[11]()
        self.state = "Play"
        if self.loops == 9999 then
            self.infinity = true
        end
        if self.loops == 0 then
            self.enable = false
        end
        self.curTime = 0
    else
        --index is sys
        self.transfrom = self.inputs[4]()
        self.initPos = self.transfrom:getWorldPosition()
    end
end

function CGSpinAround3D:update(sys, dt)
    if not self.enable then
        return
    end
    if self.originPt == nil or self.normRotateAxis == nil or self.transfrom == nil or self.rotateTime == nil then
        return
    end
    self.curAngle = self:getCurValue(0, self.rotateAngle, self.curTime)
    local adt = self.curAngle - self.lastAngle
    self.originPt = self.inputs[5]()
    self.normRotateAxis = self.inputs[6]():normalizeSafe(Amaz.Vector3f(0, 0 ,1))
    local rotMat = self:getRotMatFromAxis(adt)
    local totalRotMat = self:getRotMatFromAxis(self.curAngle)
    if rotMat == nil or totalRotMat == nil then
        Amaz.LOGE("INFO", "rotationMat is nil")
        return
    end
    self.lastAngle = self.curAngle
    local startPos = self.transfrom.localPosition
    local endPos = rotMat:multiplyPoint3(startPos)
    if self.curTime == 0 then
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
    if self.curTime > self.rotateTime then
        self.curTime = 0
        self.loop = self.loop + 1
        if self.loop >= self.loops and self.infinity ~= true then
            if self.nexts[2] then
                self.nexts[2]()
            end
            self.enable = false
        end
    end
    if self.curTime <= self.rotateTime then
        self.transfrom.localPosition = endPos
        if self.autoSelfRotate == true then
            self.transfrom.localOrientation = self:getQuaternionfFromMatrix(totalRotMat)
        end
        self.curTime = self.curTime + dt
        if self.nexts[0]  then
            self.nexts[0]()
        end
    end
    self.outputs[3] = self.transfrom.localPosition
    self.outputs[4] = self:getEulerfFromMatrix(totalRotMat)
end

function CGSpinAround3D:getRotMatFromAxis(angle)
    if self.originPt == nil or self.normRotateAxis == nil then
        return nil
    end
    local nx = self.normRotateAxis.x
    local ny = self.normRotateAxis.y
    local nz = self.normRotateAxis.z
    local x0 = self.originPt.x
    local y0 = self.originPt.y
    local z0 = self.originPt.z
    local M = nx * x0 + ny * y0 + nz * z0
    local K = 1 - math.cos(angle)
    local Mat = Amaz.Matrix4x4f();
    Mat:set(0, 0, nx*nx*K + math.cos(angle))
    Mat:set(0, 1, nx*ny*K - nz*math.sin(angle))
    Mat:set(0, 2, nx*nz*K + ny*math.sin(angle))
    Mat:set(0, 3, (x0 - nx*M)*K + (nz*y0 - ny*z0)*math.sin(angle))
    Mat:set(1, 0, nx*ny*K + nz*math.sin(angle))
    Mat:set(1, 1, ny*ny*K + math.cos(angle))
    Mat:set(1, 2, ny*nz*K - nx*math.sin(angle))
    Mat:set(1, 3, (y0 - ny*M)*K + (nx*z0 - nz*x0)*math.sin(angle))
    Mat:set(2, 0, nx*nz*K - ny*math.sin(angle))
    Mat:set(2, 1, ny*nz*K + nx*math.sin(angle))
    Mat:set(2, 2, nz*nz*K + math.cos(angle))
    Mat:set(2, 3, (z0 - nz*M)*K + (ny*x0 - nx*y0)*math.sin(angle))
    Mat:set(3, 0, 0)
    Mat:set(3, 1, 0)
    Mat:set(3, 2, 0)
    Mat:set(3, 3, 1)
    return Mat
end

function CGSpinAround3D:getEulerfFromMatrix(mat)
    local outT = Amaz.Vector3f()
    local outS = Amaz.Vector3f()
    local outR = Amaz.Quaternionf()
    mat:getDecompose(outT, outS, outR)
    if outR.x ~= outR.x or outR.y ~= outR.y or outR.z ~= outR.z or outR.w ~= outR.w then
        Amaz.LOGE("INFO", "outR is Nan")
        return nil
    end
    local euler = outR:quaternionToEuler()
    --local InvQuat = Amaz.Quaternionf.eulerToQuaternion(euler)
    local ret = Amaz.Vector3f(math.deg(euler.x), math.deg(euler.y), math.deg(euler.z))
    return ret
end

function CGSpinAround3D:getQuaternionfFromMatrix(mat)
    local outT = Amaz.Vector3f()
    local outS = Amaz.Vector3f()
    local outR = Amaz.Quaternionf()
    mat:getDecompose(outT, outS, outR)
    if outR.x ~= outR.x or outR.y ~= outR.y or outR.z ~= outR.z or outR.w ~= outR.w then
        Amaz.LOGE("INFO", "outR is Nan")
        return nil
    end
    local euler = outR:quaternionToEuler()
    local quat = Amaz.Quaternionf.eulerToQuaternion(euler)
    return quat
end

function CGSpinAround3D:combination(n, i)
    if i < 0 or n == 0 then
        return 0
    end
    if self.combNum[n] and self.combNum[n][i] then
        return self.combNum[n][i]
    end
    if not self.combNum[n] then
        self.combNum[n] = {}
    end
    if i == 0 or n == i then
        self.combNum[n][i] = 1
    else
        self.combNum[n][i] = self:combination(n - 1, i) + self:combination(n - 1, i - 1)
    end
    return self.combNum[n][i]
end

function CGSpinAround3D:bezier(nums, t)
    local p = 1 - t
    local item = nums
    local pp = 1
    local tt = 1
    for i = 1, #nums do
        item[i] = item[i] * tt
        item[#nums - i + 1] = item[#nums - i + 1] * pp
        item[i] = item[i] * self:combination(#nums - 1, i - 1)
        pp = pp * p
        tt = tt * t
    end
    local res = 0
    for i = 1, #nums do
        res = res + item[i]
    end
    return res
end

function CGSpinAround3D:getCurValue(numStart, numEnd, t)
    if self.rotateTime == 0 then
        t = 0
    else
        t = t / self.rotateTime
    end
    if self.curve == "Linear" then
        return self:bezier({numStart, numEnd}, t)
    elseif self.curve == "Ease In" then
        return self:bezier({numStart, numEnd, numEnd}, t)
    elseif self.curve == "Ease Out" then
        return self:bezier({numStart, numStart, numEnd}, t)
    elseif self.curve == "Ease In-Out" then
        return self:bezier({numStart, numStart, numEnd, numEnd}, t)
    end
end

return CGSpinAround3D