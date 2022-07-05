local CGRecordVideo = CGRecordVideo or {}
CGRecordVideo.__index = CGRecordVideo

function CGRecordVideo.new()
    local self = setmetatable({}, CGRecordVideo)
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGRecordVideo:setNext(index, func)
    self.nexts[index] = func
end

function CGRecordVideo:getOutput(index)
    return self.outputs[index]
end

function CGRecordVideo:onEvent(sys, event)
    if event.type == Amaz.AppEventType.COMPAT_BEF then
        local event_result = event.args:get(0)
        if event_result == Amaz.BEFEventType.BET_RECORD_VIDEO then
            local event_result = event.args:get(1)
            if event_result == 1 then
                if self.nexts[0] then
                    self.nexts[0]()
                end
            end
        end
    end
end

return CGRecordVideo
