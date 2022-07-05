local CGRecordVideoEnd = CGRecordVideoEnd or {}
CGRecordVideoEnd.__index = CGRecordVideoEnd

function CGRecordVideoEnd.new()
    local self = setmetatable({}, CGRecordVideoEnd)
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGRecordVideoEnd:setNext(index, func)
    self.nexts[index] = func
end

function CGRecordVideoEnd:getOutput(index)
    return self.outputs[index]
end

function CGRecordVideoEnd:onEvent(sys, event)
    if event.type == Amaz.AppEventType.COMPAT_BEF then
        local event_result = event.args:get(0)
        if event_result == Amaz.BEFEventType.BET_RECORD_VIDEO then
            local event_result = event.args:get(1)
            if event_result == 2 then
                if self.nexts[0] then
                    self.nexts[0]()
                end
            end
        end
    end
end

return CGRecordVideoEnd
