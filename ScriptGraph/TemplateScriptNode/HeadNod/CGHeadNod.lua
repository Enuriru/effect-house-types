local CGHeadNod = CGHeadNod or {}
CGHeadNod.__index = CGHeadNod

function CGHeadNod.new()
    local self = setmetatable({}, CGHeadNod)
    self.inputs = {}
    self.nexts = {}
    self.faceAction = ""
    return self
end

function CGHeadNod:setNext(index, func)
    self.nexts[index] = func
end

function CGHeadNod:setInput(index, func)
    self.inputs[index] = func
end

function CGHeadNod:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local is_HEAD_PITCH = face:hasAction(Amaz.FaceAction.HEAD_PITCH)
    if self.faceAction ~= "HEAD_PITCH" and is_HEAD_PITCH then
        self.faceAction = "HEAD_PITCH"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.faceAction == "HEAD_PITCH" and not is_HEAD_PITCH then
        self.faceAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end

return CGHeadNod

