local CGThree = CGThree or {}
CGThree.__index = CGThree

function CGThree.new()
    local self = setmetatable({}, CGThree)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGThree:setNext(index, func)
    self.nexts[index] = func
end

function CGThree:setInput(index, func)
    self.inputs[index] = func
end

function CGThree:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.THREE
    if self.handAction ~= "THREE" and has_action then
        self.handAction = "THREE"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "THREE" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGThree
