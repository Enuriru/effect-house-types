local CGForLoop = CGForLoop or {}
CGForLoop.__index = CGForLoop

function CGForLoop.new()
    local self = setmetatable({}, CGForLoop)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGForLoop:setNext(index, node)
    self.nexts[index] = node
end

function CGForLoop:setInput(index, func)
    self.inputs[index] = func
end

function CGForLoop:getOutput(index)
    return self.currentIndex
end

function CGForLoop:execute()
    local start = self.inputs[1]()
    local last = self.inputs[2]()
    local step = self.inputs[3]()
    if (last - start) * step <= 0 then
        return
    end
    self.currentIndex = start
    while (step > 0 and self.currentIndex < last) or (step < 0 and self.currentIndex > last) do
        if self.nexts[0] then
            self.nexts[0]()
        end
        if self.__contextStack ~= nil and #self.__contextStack > 0 then
            if self.__contextStack[#self.__contextStack][1] == "return" then
                return
            end
            -- some other thing like break;
        end
        self.currentIndex = self.currentIndex + step
    end
    if self.nexts[1] then
        self.nexts[1]()
    end
end

return CGForLoop
