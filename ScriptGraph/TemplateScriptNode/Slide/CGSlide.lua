local CGSlide = CGSlide or {}
CGSlide.__index = CGSlide

function CGSlide.new()
    local self = setmetatable({}, CGSlide)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGSlide:setNext(index, func)
    self.nexts[index] = func
end

function CGSlide:setInput(index, func)
    self.inputs[index] = func
end

function CGSlide:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.SLIDE
    if self.handAction ~= "SLIDE" and has_action then
        self.handAction = "SLIDE"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "SLIDE" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGSlide
