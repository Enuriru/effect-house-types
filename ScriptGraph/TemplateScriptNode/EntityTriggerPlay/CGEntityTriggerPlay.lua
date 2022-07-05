local CGEntityTriggerPlay = CGEntityTriggerPlay or {}
CGEntityTriggerPlay.__index = CGEntityTriggerPlay

function CGEntityTriggerPlay.new()
    local self = setmetatable({}, CGEntityTriggerPlay)
    self.inputs = {}
    self.nexts = {}

    self.index = 0
    self.entities = nil
    return self
end

function CGEntityTriggerPlay:setInput(index, func)
    self.inputs[index] = func
end

function CGEntityTriggerPlay:setNext(index, func)
    self.nexts[index] = func
end

function CGEntityTriggerPlay:setEntityVisible(index)
    self.entities[index]["visible"] = true
    for i = 1, #self.entities do
        if i ~= index then
            self.entities[i]["visible"] = false
        end
    end
end

function CGEntityTriggerPlay:getEntities()
    self.entities = {}
    for i = 1, 5 do
        if self.inputs[i] then
            table.insert(self.entities, self.inputs[i]())
        end
    end
end

function CGEntityTriggerPlay:execute(index)
    -- init 
    if not self.entities then
        self:getEntities()
        if self.inputs[6]() then
            self.index = math.random(0, #self.entities - 1)
        end
    end

    if self.nexts[0] then
        self.nexts[0]()
    end

    local n = #self.entities
    if n == 0 then
        return 
    end

    self:setEntityVisible(self.index + 1)
    self.index = (self.index + 1) % n
end

return CGEntityTriggerPlay
