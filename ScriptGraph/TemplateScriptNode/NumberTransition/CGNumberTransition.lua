local CGNumberTransition = CGNumberTransition or {}
CGNumberTransition.__index = CGNumberTransition

function CGNumberTransition.new()
    local self = setmetatable({}, CGNumberTransition)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}

    self.start = false
    self.updating = false
    self.curTime = 0
    self.loopIndex = 0
    self.combNum = {}
    return self
end

function CGNumberTransition:setNext(index, func)
    self.nexts[index] = func
end

function CGNumberTransition:setInput(index, func)
    self.inputs[index] = func
    if index == 2 and func then
        self.outputs[2] = func()
    end
end

function CGNumberTransition:getOutput(index)
    return self.outputs[index]
end

function CGNumberTransition:execute(index)    
    if index == 0 then
        self.updating = true
        if not self.start then
            self.start = true
            self.loopIndex = 0
            self.curTime = 0
            if self.nexts[1] then
                self.nexts[1]()
            end
        end
    elseif index == 1 then
        self.updating = false
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end

function CGNumberTransition:combination(n, i)
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

function CGNumberTransition:bezier(nums, t)
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

function CGNumberTransition:getCurNumber(numStart, numEnd, t)
    local curveType = self.inputs[5]()
    local duration = self.inputs[4]()
    if duration == 0 then
        t = 0
    else
        t = t / duration
    end
    if curveType == "Linear" then  
        return self:bezier({numStart, numEnd}, t)
    elseif curveType == "Ease In" then
        return self:bezier({numStart, numEnd, numEnd}, t)
    elseif curveType == "Ease Out" then
        return self:bezier({numStart, numStart, numEnd}, t)
    elseif curveType == "Ease In-Out" then
        return self:bezier({numStart, numStart, numEnd, numEnd}, t)
    end
end

function CGNumberTransition:getCurValue(t)
    local valStart = self.inputs[2]()
    local valEnd = self.inputs[3]()
    if self.valueType == "Float" or self.valueType == "Double" then
        return self:getCurNumber(valStart, valEnd, t)
    elseif self.valueType == "Int" then
        return math.floor(self:getCurNumber(valStart, valEnd, t))
    elseif self.valueType == "Vector2f" then
        local x = self:getCurNumber(valStart.x, valEnd.x, t)
        local y = self:getCurNumber(valStart.y, valEnd.y, t)
        return Amaz.Vector2f(x, y)
    elseif self.valueType == "Vector3f" then
        local x = self:getCurNumber(valStart.x, valEnd.x, t)
        local y = self:getCurNumber(valStart.y, valEnd.y, t)
        local z = self:getCurNumber(valStart.z, valEnd.z, t)
        return Amaz.Vector3f(x, y, z)
    elseif self.valueType == "Vector4f" then
        local x = self:getCurNumber(valStart.x, valEnd.x, t)
        local y = self:getCurNumber(valStart.y, valEnd.y, t)
        local z = self:getCurNumber(valStart.z, valEnd.z, t)
        local w = self:getCurNumber(valStart.w, valEnd.w, t)
        return Amaz.Vector4f(x, y, z, w)
    elseif self.valueType == "Color" then
        local r = self:getCurNumber(valStart.r, valEnd.r, t)
        local g = self:getCurNumber(valStart.g, valEnd.g, t)
        local b = self:getCurNumber(valStart.b, valEnd.b, t)
        local a = self:getCurNumber(valStart.a, valEnd.a, t)
        return Amaz.Color(r, g, b, a)
    end
end

function CGNumberTransition:update(sys, deltaTime)
    if not self.updating then
        return
    end

    local duration = self.inputs[4]()
    self.outputs[3] = self:getCurValue(math.min(self.curTime, duration))
    if self.nexts[0] then
        self.nexts[0]()
    end

    if self.curTime >= duration then
        self.loopIndex = self.loopIndex + 1
        self.curTime = 0
    else
        self.curTime = self.curTime + deltaTime
    end

    local times = self.inputs[6]()
    if self.loopIndex >= times then
        self.start = false
        self.updating = false
        if self.nexts[2] then
            self.nexts[2]()
        end
    end   
end

return CGNumberTransition

