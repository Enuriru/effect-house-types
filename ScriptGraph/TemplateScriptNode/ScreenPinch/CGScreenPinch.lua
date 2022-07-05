local CGScreenPinch = CGScreenPinch or {}
CGScreenPinch.__index = CGScreenPinch

function CGScreenPinch.new()
    local self = setmetatable({}, CGScreenPinch)
    self.outputs = {}
    self.nexts = {}
    self.scale = 1.0
    return self
end

function CGScreenPinch:setNext(index, func)
    self.nexts[index] = func
end

function CGScreenPinch:getOutput(index)
    return self.scale
end

function CGScreenPinch:onEvent(sys, event)
    if event.type == Amaz.EventType.TOUCH_MANIPULATE then
        if event.args:get(0) == 6 then
            local delta_scale = event.args:get(1)
            if delta_scale ~= nil then
                self.scale = self.scale + (delta_scale - 1.0)
                if self.scale < 0 then
                    self.scale = 0
                end
                if self.nexts[0] then
                    self.nexts[0]()
                end
            end
        end
    end
end

return CGScreenPinch
