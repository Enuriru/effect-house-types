local CGQiGong = CGQiGong or {}
CGQiGong.__index = CGQiGong

function CGQiGong.new()
    local self = setmetatable({}, CGQiGong)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGQiGong:setNext(index, func)
    self.nexts[index] = func
end

function CGQiGong:setInput(index, func)
    self.inputs[index] = func
end

function CGQiGong:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.QIGONG
    if self.handAction ~= "QIGONG" and has_action then
        self.handAction = "QIGONG"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "QIGONG" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGQiGong
