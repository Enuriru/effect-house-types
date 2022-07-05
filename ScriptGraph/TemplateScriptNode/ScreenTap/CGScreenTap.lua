local CGScreenTap = CGScreenTap or {}
CGScreenTap.__index = CGScreenTap

function CGScreenTap.new()
    local self = setmetatable({}, CGScreenTap)
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGScreenTap:setNext(index, func)
    self.nexts[index] = func
end

function CGScreenTap:getOutput(index)
    return self.outputs[index]
end

function CGScreenTap:onEvent(sys, event)
    if event.type == Amaz.EventType.TOUCH then
        local touch = event.args:get(0)
        if (touch.type == Amaz.TouchType.TOUCH_BEGAN) then
            self.outputs[1] = Amaz.Vector2f(touch.x, touch.y)
            if self.nexts[0] then
                self.nexts[0]()
            end
        end
    end
end

return CGScreenTap
