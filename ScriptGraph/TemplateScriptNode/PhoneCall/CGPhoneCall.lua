local CGPhoneCall = CGPhoneCall or {}
CGPhoneCall.__index = CGPhoneCall

function CGPhoneCall.new()
    local self = setmetatable({}, CGPhoneCall)
    self.inputs = {}
    self.nexts = {}
    self.handAction = ""
    return self
end

function CGPhoneCall:setNext(index, func)
    self.nexts[index] = func
end

function CGPhoneCall:setInput(index, func)
    self.inputs[index] = func
end

function CGPhoneCall:update()
    if self.nexts[0] == nil and self.nexts[1] == nil then
        return
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local hand = result:getHandInfo(self.inputs[0]())
    if hand == nil then
        return
    end

    local has_action = hand.action == Amaz.HandAction.PHONECALL
    if self.handAction ~= "PHONECALL" and has_action then
        self.handAction = "PHONECALL"
        if self.nexts[0] then
            self.nexts[0]()
        end
    elseif self.handAction == "PHONECALL" and not has_action then
        self.handAction = ""
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
end
return CGPhoneCall
