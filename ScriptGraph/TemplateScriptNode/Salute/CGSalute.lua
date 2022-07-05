local CGSalute = CGSalute or {}
CGSalute.__index = CGSalute

function CGSalute.new()
    local self = setmetatable({}, CGSalute)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGSalute:setNext(index, func)
    self.nexts[index] = func
end

function CGSalute:setInput(index, func)
    self.inputs[index] = func
end

function CGSalute:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.SALUTE
    if self.handAction ~= "SALUTE" and has_action then
        self.handAction = "SALUTE"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "SALUTE" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGSalute
