local CGHeadShake = CGHeadShake or {}
CGHeadShake.__index = CGHeadShake

function CGHeadShake.new()
    local self = setmetatable({}, CGHeadShake)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    return self
end

function CGHeadShake:setNext(index, func)
    self.nexts[index] = func
end

function CGHeadShake:setInput(index, func)
    self.inputs[index] = func
end

function CGHeadShake:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local is_HEAD_YAW = face:hasAction(Amaz.FaceAction.HEAD_YAW)
    if self.faceAction ~= "HEAD_YAW" and is_HEAD_YAW then
        self.faceAction = "HEAD_YAW"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.faceAction == "HEAD_YAW" and not is_HEAD_YAW then
        self.faceAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end

return CGHeadShake