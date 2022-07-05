local CGEyebrowRaise = CGEyebrowRaise or {}
CGEyebrowRaise.__index = CGEyebrowRaise

function CGEyebrowRaise.new()
    local self = setmetatable({}, CGEyebrowRaise)
    self.inputs = {}
    self.nexts = {}
    return self
end

function CGEyebrowRaise:setNext(index, func)
    self.nexts[index] = func
end

function CGEyebrowRaise:setInput(index, func)
    self.inputs[index] = func
end

function CGEyebrowRaise:update()
    if self.nexts[0] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local face = result:getFaceBaseInfo(self.inputs[0]())
    if face == nil then
        return
    end

    local is_BROW_JUMP = face:hasAction(Amaz.FaceAction.BROW_JUMP)
    if is_BROW_JUMP then
        if self.nexts[0] then
            self.nexts[0]()
        end
    end
end

return CGEyebrowRaise

