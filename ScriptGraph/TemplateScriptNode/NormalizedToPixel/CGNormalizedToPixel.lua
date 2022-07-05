local CGNormalizedToPixel = CGNormalizedToPixel or {}
CGNormalizedToPixel.__index = CGNormalizedToPixel

function CGNormalizedToPixel.new()
    local self = setmetatable({}, CGNormalizedToPixel)
    self.outputs = {}
    self.inputs = {}
    self.nexts = {}

    self.screenHeight = 1280
    self.screenWidth = 720

    return self
end

function CGNormalizedToPixel:setNext(index, func)
    self.nexts[index] = func
end

function CGNormalizedToPixel:setInput(index, func)
    self.inputs[index] = func
end

function CGNormalizedToPixel:getOutput(index)
    if not self.inputs[0] then
        return nil
    end
    return self:normalizedToPixelPoint(self.inputs[0]())
end

function CGNormalizedToPixel:normalizedToPixelPoint(point)
    if point == nil then
        return Amaz.Vector2f(0, 0)
    end
    local normalized_x = point.x
    local normalized_y = point.y
    -- normalized to pixel
    local transMatrix = Amaz.Matrix3x3f(
        1, 0, -0.5,
        0, -1, 0.5,
        0, 0, 1)
    local normalized_vector3f = Amaz.Vector3f(normalized_x, normalized_y, 1)
    local pixel_vector3f = transMatrix:multiplyVector3(normalized_vector3f)
    return Amaz.Vector2f(pixel_vector3f.x * self.screenWidth, pixel_vector3f.y * self.screenHeight)
end

return CGNormalizedToPixel

