local CGRock2 = CGRock2 or {}
CGRock2.__index = CGRock2

function CGRock2.new()
    local self = setmetatable({}, CGRock2)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGRock2:setNext(index, func)
    self.nexts[index] = func
end

function CGRock2:setInput(index, func)
    self.inputs[index] = func
end

function CGRock2:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.ROCK2
    if self.handAction ~= "ROCK2" and has_action then
        self.handAction = "ROCK2"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "ROCK2" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGRock2
