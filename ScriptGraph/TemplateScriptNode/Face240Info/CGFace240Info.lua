local CGFace240Info = CGFace240Info or {}
CGFace240Info.__index = CGFace240Info

function CGFace240Info.new()
    local self = setmetatable({}, CGFace240Info)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGFace240Info:setNext(index, func)
    self.nexts[index] = func
end

function CGFace240Info:setInput(index, func)
    self.inputs[index] = func
end

function CGFace240Info:getOutput(index)
    return self.outputs[index]
end

function CGFace240Info:execute()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[1]())
    if face == nil then
        return
    end
    self.outputs[1] = face.rect
    self.outputs[2] = face.score
    self.outputs[3] = face.points_array
    self.outputs[4] = face.visibility_array
    self.outputs[5] = face.eye_dist
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGFace240Info
