local CGMouthPout = CGMouthPout or {}
CGMouthPout.__index = CGMouthPout

function CGMouthPout.new()
    local self = setmetatable({}, CGMouthPout)
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGMouthPout:setNext(index, func)
    self.nexts[index] = func
end

function CGMouthPout:setInput(index, func)
    self.inputs[index] = func
end

function CGMouthPout:update()
    if self.nexts[0] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local has_action = face:hasAction(Amaz.FaceAction.MOUTH_POUT)
    if has_action then
        if self.nexts[0] then
            self.nexts[0]()
        end
    end
end

return CGMouthPout

