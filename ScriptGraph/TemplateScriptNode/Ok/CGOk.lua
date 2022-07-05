local CGOk = CGOk or {}
CGOk.__index = CGOk

function CGOk.new()
    local self = setmetatable({}, CGOk)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGOk:setNext(index, func)
    self.nexts[index] = func
end

function CGOk:setInput(index, func)
    self.inputs[index] = func
end

function CGOk:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.OK
    if self.handAction ~= "OK" and has_action then
        self.handAction = "OK"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "OK" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGOk
