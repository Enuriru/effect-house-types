local CGSprite2DRotation = CGSprite2DRotation or {}
CGSprite2DRotation.__index = CGSprite2DRotation

function CGSprite2DRotation.new()
    local self = setmetatable({}, CGSprite2DRotation)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}

    self.start = false
    self.updating = false

    self.curTime = 0
    self.loopIndex = 0
    self.combNum = {}

    self.screenHeight = 1280
    self.screenWidth = 720

    self.center = nil
    self.position = nil
    self.rotation = nil
    self.dir = Amaz.Vector3f(0, 0, 1)
    return self
end

function CGSprite2DRotation:setNext(index, func)
    self.nexts[index] = func
end

function CGSprite2DRotation:setInput(index, func)
    self.inputs[index] = func
end

function CGSprite2DRotation:getOutput(index)
    return self.outputs[index]
end

------------------------- bezier -------------------------------
function CGSprite2DRotation:combination(n, i)
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

function CGSprite2DRotation:bezier(nums, t)
    local p = 1 - t
    local pp = 1
    local tt = 1
    local item = nums
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

function CGSprite2DRotation:getCurNumber(numStart, numEnd, t)
    local curveType = self.inputs[7]()
    local duration = self.inputs[8]()
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
----------------------- bezier ---------------------------------------

function CGSprite2DRotation:execute(index)    
    if index == 0 then
        self.updating = true
        self.start = true
        self.loopIndex = 0
        self.curTime = 0
        self.center = nil
        self:resetPosition()
        self:getPosition()
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif index == 1 then
        self.updating = false
    elseif index == 2 then
        self.updating = true
    else
        self.start = false
        self.updating = false
        self:resetPosition()

        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end

function CGSprite2DRotation:getPosition()
    if not self.inputs[4] or not self.inputs[4]() then
        return
    end
    local transform2d = self.inputs[4]()
    self.position = transform2d["position"]
    self.rotation = transform2d["rotation"]
end

function CGSprite2DRotation:resetPosition()
    if not self.inputs[4] or not self.inputs[4]() then
        return
    end
    local transform2d = self.inputs[4]()
    if self.position then
        transform2d.position = self.position
        transform2d.rotation = self.rotation
    end
end

function CGSprite2DRotation:normalized2Pixel(point)
    local transMatrix = Amaz.Matrix3x3f(
        1, 0, -0.5,
        0, -1, 0.5,
        0, 0, 1)
    local point_pixel = Amaz.Vector3f(point.x, point.y, 1)
    point_pixel = transMatrix:multiplyVector3(point_pixel)
    point_pixel.x = point_pixel.x * self.screenWidth
    point_pixel.y = point_pixel.y * self.screenHeight
    return Amaz.Vector2f(point_pixel.x, point_pixel.y)
end

function CGSprite2DRotation:pixel2Normalized(pixel)
    local transMatrix = Amaz.Matrix3x3f(
        1, 0, 0.5,
        0, -1, 0.5,
        0, 0, 1)
    local point_norm = Amaz.Vector3f(pixel.x / self.screenWidth, pixel.y / self.screenHeight, 1)
    point_norm = transMatrix:multiplyVector3(point_norm)
    return Amaz.Vector2f(point_norm.x, point_norm.y)
end

function CGSprite2DRotation:rotate2d(position, center, angle)
    local pos_x = position.x - center.x
    local pos_y = position.y - center.y
    local cos_angle = math.cos(angle)
    local sin_angle = math.sin(angle)
    local x = pos_x * cos_angle - pos_y * sin_angle
    local y = pos_x * sin_angle + pos_y * cos_angle
    return Amaz.Vector2f(x + center.x, y + center.y)
end

function CGSprite2DRotation:update(sys, deltaTime)
    if not self.updating then
        return
    end

    local duration = self.inputs[8]()
    self.curTime = math.min(duration, self.curTime)
    local rotAngle = self:getCurNumber(0, self.inputs[6](), self.curTime)
    if self.nexts[0] then
        self.nexts[0]()
    end
    
    if self.inputs[4] and self.inputs[4]() then
        local transform2d = self.inputs[4]()   
        local center = self:normalized2Pixel(self.inputs[5]())
        transform2d.position = self:rotate2d(self.position, center, rotAngle / 180 * 3.14159)
        if not self.inputs[10]() then
            transform2d.rotation = rotAngle
        end
        self.outputs[3] = self:pixel2Normalized(transform2d["position"])
    end 
    
    self.outputs[4] = rotAngle
    if self.curTime >= duration then
        self.loopIndex = self.loopIndex + 1
        self.curTime = 0
    else
        self.curTime = self.curTime + deltaTime
    end

    local times = self.inputs[9]()
    if self.loopIndex >= times then
        self.start = false
        self.updating = false
        if self.nexts[2] then
            self.nexts[2]()
        end
    end   
end

return CGSprite2DRotation

