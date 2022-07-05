local CGScreenLongTap = CGScreenLongTap or {}
CGScreenLongTap.__index = CGScreenLongTap

function CGScreenLongTap.new()
    local self = setmetatable({}, CGScreenLongTap)
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGScreenLongTap:setNext(index, func)
    self.nexts[index] = func
end

function CGScreenLongTap:getOutput(index)
    return self.outputs[index]
end

function CGScreenLongTap:execute(sys)
    Amaz.Input.addScriptListener(sys, Amaz.InputListener.ON_GESTURE_LONG_TAP, "onCallBack")
end

function CGScreenLongTap:onDestroy(sys)
    Amaz.Input.removeScriptListener(sys, Amaz.InputListener.ON_GESTURE_LONG_TAP, "onCallBack")
end

function CGScreenLongTap:callback(userData, sender, eventType)
    if eventType ~= Amaz.InputListener.ON_GESTURE_LONG_TAP then
        return
    end
    if sender ~= nil then
        self.outputs[1] = sender.duration
        self.outputs[2] = Amaz.Vector2f(sender.x, sender.y)
        if self.nexts[0] then
            self.nexts[0]()
        end
    end
end

return CGScreenLongTap
