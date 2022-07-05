local CGDragGesture = CGDragGesture or {}
CGDragGesture.__index = CGDragGesture

function CGDragGesture.new()
    local self = setmetatable({}, CGDragGesture)
    self.outputs = {}
    self.nexts = {}
    self.startPoint = Amaz.Vector2f(0.0, 0.0)
    return self
end

function CGDragGesture:setNext(index, func)
    self.nexts[index] = func
end

function CGDragGesture:getOutput(index)
    return self.outputs[index]
end

function CGDragGesture:execute(sys)
    Amaz.Input.addScriptListener(sys, Amaz.InputListener.ON_GESTURE_DRAG, "onCallBack")
end

function CGDragGesture:onEvent(sys, event)
    if event.type == Amaz.EventType.TOUCH then
        local touch = event.args:get(0)
        if touch.type == Amaz.TouchType.TOUCH_BEGAN then
            self.startPoint = Amaz.Vector2f(touch.x, touch.y)
        end
    end
end

function CGDragGesture:onDestroy(sys)
    Amaz.Input.removeScriptListener(sys, Amaz.InputListener.ON_GESTURE_DRAG, "onCallBack")
end

function CGDragGesture:callback(userData, sender, eventType)
    if eventType ~= Amaz.InputListener.ON_GESTURE_DRAG then
        return
    end
    if sender ~= nil then
        self.outputs[1] = Amaz.Vector2f(sender.x - self.startPoint.x, sender.y - self.startPoint.y)
        self.outputs[2] = Amaz.Vector2f(sender.x, sender.y)
        if self.nexts[0] then
            self.nexts[0]()
        end
    end
end

return CGDragGesture
