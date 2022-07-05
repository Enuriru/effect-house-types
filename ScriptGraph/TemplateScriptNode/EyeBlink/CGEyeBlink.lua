local CGEyeBlink = CGEyeBlink or {}
CGEyeBlink.__index = CGEyeBlink

function CGEyeBlink.new()
    local self = setmetatable({}, CGEyeBlink)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    self.eyeMap = {
        ["Left"] = "EYE_BLINK_LEFT",
        ["Right"] = "EYE_BLINK_RIGHT",
        ["Both"] = 'EYE_BLINK',
    };
    return self
end

function CGEyeBlink:setNext(index, func)
    self.nexts[index] = func
end

function CGEyeBlink:setInput(index, func)
    self.inputs[index] = func
end

function CGEyeBlink:update()
    if self.nexts[0] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local eyeAction = self.eyeMap[self.inputs[1]()]
    local has_action = false

    if eyeAction == "EYE_BLINK" then
        has_action = face:hasAction(Amaz.FaceAction.EYE_BLINK)
    elseif eyeAction == "EYE_BLINK_LEFT" then
        has_action = face:hasAction(Amaz.FaceAction.EYE_BLINK_LEFT)
    elseif eyeAction == "EYE_BLINK_RIGHT" then
        has_action = face:hasAction(Amaz.FaceAction.EYE_BLINK_RIGHT)
    end

    if self.faceAction ~= eyeAction and has_action then
        self.faceAction = eyeAction
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.faceAction == eyeAction and not has_action then
        self.faceAction = ""
    end
end

return CGEyeBlink

