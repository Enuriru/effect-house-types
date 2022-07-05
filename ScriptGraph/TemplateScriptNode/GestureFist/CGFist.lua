local CGFist = CGFist or {}
CGFist.__index = CGFist

function CGFist.new()
    local self = setmetatable({}, CGFist)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGFist:setNext(index, func)
    self.nexts[index] = func
end

function CGFist:setInput(index, func)
    self.inputs[index] = func
end

function CGFist:update()
    if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.FIST
    if self.handAction ~= "FIST" and has_action then
        self.handAction = "FIST"
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.nexts[1] then
            self.nexts[1]()
        end
    elseif self.handAction == "FIST" and has_action then
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "FIST" and not has_action then
        self.handAction = ""
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end

return CGFist
