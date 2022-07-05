local CGPray = CGPray or {}
CGPray.__index = CGPray

function CGPray.new()
    local self = setmetatable({}, CGPray)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGPray:setNext(index, func)
    self.nexts[index] = func
end

function CGPray:setInput(index, func)
    self.inputs[index] = func
end

function CGPray:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.PRAY
    if self.handAction ~= "PRAY" and has_action then
        self.handAction = "PRAY"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "PRAY" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGPray
