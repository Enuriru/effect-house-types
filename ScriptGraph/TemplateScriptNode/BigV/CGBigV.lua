local CGBigV = CGBigV or {}
CGBigV.__index = CGBigV

function CGBigV.new()
    local self = setmetatable({}, CGBigV)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGBigV:setNext(index, func)
    self.nexts[index] = func
end

function CGBigV:setInput(index, func)
    self.inputs[index] = func
end

function CGBigV:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.BIG_V
    if self.handAction ~= "BIG_V" and has_action then
        self.handAction = "BIG_V"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "BIG_V" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGBigV
