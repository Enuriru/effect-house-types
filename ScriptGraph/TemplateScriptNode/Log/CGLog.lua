local CGLog = CGLog or {}
CGLog.__index = CGLog

function CGLog.new()
    local self = setmetatable({}, CGLog)
    self.nexts = {}
    self.inputs = {}
    return self
end

function CGLog:setInput(index, func)
    self.inputs[index] = func
end

function CGLog:setNext(index, func)
    self.nexts[index] = func
end

function CGLog:execute(index)
    if self.inputs[1] then
        local log = self.inputs[1]()
        if log ~= nil then
            Amaz.LOGE("CREATOR_GRAPH_TAG", log)
        end
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGLog
