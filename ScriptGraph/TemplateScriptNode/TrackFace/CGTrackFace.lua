local CGTrackFace = CGTrackFace or {}
CGTrackFace.__index = CGTrackFace

local faceTrackCommonParam = {
    faceRect = { left = 0, right = 0},
    displayHeight = 1280,
    displayWidth = 720,
    trackingArea = {0.15, 0.15, 0.85, 0.85},
}
local oriConfig = {
    scaleSpeedUp = {0.050000, },
    scaleSpeedDown = {0.050000, },
    scaleMinLimit = {0.600000, },
    scaleMax = {1.000000, },
}

local facePointIndex = {1, 31, 43}
local scaleMinLimit = {0.600000, }
local tempParam = {
        faceLeft = {x = 0, y = 0 },
        faceCenter = {x = 0, y = 0},
        faceRight = { x = 0, y = 0},
        scaleMin = 0.6,
        faceWidth = 0,
        status = 0,
        frameRectOrig = {0.0, 0.0, 1.0, 1.0},
        frameRect = {0.0, 0.0, 1.0, 1.0},
        scaleMax = 1.0,
        translate = { x = 0.0, y = 0.0},
        state = 0,
        faceCenter = { x = 0, y = 0},
        scale = 1.0, 
        scaleSpeedUp = 0.050000,
        scaleSpeedDown = 0.050000,
    }

local function checkState(trackParam)
    if faceTrackCommonParam.faceRect.left == 0 and faceTrackCommonParam.faceRect.right == 0 then
        trackParam.state = 0
    elseif
    trackParam.faceCenter.x < faceTrackCommonParam.trackingArea[1] or
    trackParam.faceCenter.x > faceTrackCommonParam.trackingArea[3] or
    trackParam.faceCenter.y < faceTrackCommonParam.trackingArea[2] or
    trackParam.faceCenter.y > faceTrackCommonParam.trackingArea[4] then
        trackParam.state = 2
    else
        trackParam.state = 1
    end
end

local function calculateTransform(trackParam)
    if trackParam.state == 1 then
        trackParam.translate.x = trackParam.faceCenter.x - 0.5
        trackParam.translate.y = trackParam.faceCenter.y - 0.5
        if trackParam.scale > trackParam.scaleMin then
            if trackParam.scale > trackParam.scaleMin + trackParam.scaleSpeedDown then
                trackParam.scale = trackParam.scale - trackParam.scaleSpeedDown
            else
                trackParam.scale = trackParam.scaleMin
            end
        end
        if trackParam.scale < trackParam.scaleMin then
            if trackParam.scale < trackParam.scaleMin - trackParam.scaleSpeedUp then
                trackParam.scale = trackParam.scale + trackParam.scaleSpeedUp
            else
                trackParam.scale = trackParam.scaleMin
            end
        end
    elseif trackParam.state == 2 then
        if trackParam.scale < trackParam.scaleMax then
            if trackParam.scale < trackParam.scaleMax - trackParam.scaleSpeedUp then
                trackParam.scale = trackParam.scale + trackParam.scaleSpeedUp
            else
                trackParam.scale = trackParam.scaleMax
            end
        end
    end
    trackParam.frameRect = {
        (trackParam.frameRectOrig[1] - 0.5) * trackParam.scale + 0.5 + trackParam.translate.x,
        (trackParam.frameRectOrig[2] - 0.5) * trackParam.scale + 0.5 + trackParam.translate.y,
        (trackParam.frameRectOrig[3] - 0.5) * trackParam.scale + 0.5 + trackParam.translate.x,
        (trackParam.frameRectOrig[4] - 0.5) * trackParam.scale + 0.5 + trackParam.translate.y
    }
    if trackParam.frameRect[1] < 0 then
        local deltaX = 0 - trackParam.frameRect[1]
        trackParam.frameRect[1] = trackParam.frameRect[1] + deltaX
        trackParam.frameRect[3] = trackParam.frameRect[3] + deltaX
        trackParam.translate.x = trackParam.translate.x + deltaX
    end
    if trackParam.frameRect[2] < 0 then
        local deltaY = 0 - trackParam.frameRect[2]
        trackParam.frameRect[2] = trackParam.frameRect[2] + deltaY
        trackParam.frameRect[4] = trackParam.frameRect[4] + deltaY
        trackParam.translate.y = trackParam.translate.y + deltaY
    end
    if trackParam.frameRect[3] > 1.0 then
        local deltaX = 1 - trackParam.frameRect[3]
        trackParam.frameRect[3] = trackParam.frameRect[3] + deltaX
        trackParam.frameRect[1] = trackParam.frameRect[1] + deltaX
        trackParam.translate.x = trackParam.translate.x + deltaX
    end
    if trackParam.frameRect[4] > 1.0 then
        local deltaY = 1 - trackParam.frameRect[4]
        trackParam.frameRect[4] = trackParam.frameRect[4] + deltaY
        trackParam.frameRect[2] = trackParam.frameRect[2] + deltaY
        trackParam.translate.y = trackParam.translate.y + deltaY
    end
end

function CGTrackFace.new()
    local self = setmetatable({}, CGTrackFace)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGTrackFace:setNext(index, node)
    self.nexts[index] = node
end

function CGTrackFace:setInput(index, func)
    self.inputs[index] = func
end

function CGTrackFace:getOutput(index)
    return self.outputs[index]
end

function CGTrackFace:execute(index)
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        self.outputs[1] = false
        self.outputs[2] = Amaz.Vector4f(0.9, 0.9, 1.0, 1.0)
        return
    end

    local rect = face.rect
    local points_array = face.points_array
    faceTrackCommonParam.faceRect.left = rect.x
    faceTrackCommonParam.faceRect.right = rect.x + rect.width
    local faceLeft = points_array:get(facePointIndex[1])
    local faceRight = points_array:get(facePointIndex[2])
    tempParam.faceCenter = points_array:get(facePointIndex[3])
    tempParam.faceWidth = math.sqrt(
        math.pow(faceRight.x - faceLeft.x, 2) + 
        math.pow(faceRight.y - faceLeft.y, 2)
    )
    tempParam.scaleMin = math.min(tempParam.faceWidth / 0.7, 1.0)
    tempParam.scaleMin = math.max(tempParam.scaleMin, scaleMinLimit[1])

    checkState(tempParam)
    tempParam.scaleMax = oriConfig.scaleMax[1]
    tempParam.scaleMinLimit = oriConfig.scaleMinLimit[1]
    tempParam.scaleSpeedUp = oriConfig.scaleSpeedUp[1]
    tempParam.scaleSpeedDown = oriConfig.scaleSpeedDown[1]
    calculateTransform(tempParam)
    local rect = tempParam.frameRect
    self.outputs[1] = true
    self.outputs[2] = Amaz.Vector4f(rect[1], rect[2], rect[3], rect[4])
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGTrackFace

