local CGEntityRandomPlay = CGEntityRandomPlay or {}
CGEntityRandomPlay.__index = CGEntityRandomPlay

function CGEntityRandomPlay.new()
    local self = setmetatable({}, CGEntityRandomPlay)
    self.inputs = {}
    self.nexts = {}

    self.entities = nil
    return self
end

function CGEntityRandomPlay:setInput(index, func)
    self.inputs[index] = func
end

function CGEntityRandomPlay:setNext(index, func)
    self.nexts[index] = func
end

function CGEntityRandomPlay:setEntityVisible(index)
    self.entities[index]["visible"] = true
    for i = 1, #self.entities do
        if i ~= index then
            self.entities[i]["visible"] = false
        end
    end
end

function CGEntityRandomPlay:getEntities()
    self.entities = {}
    for i = 1, 5 do
        if self.inputs[i] then
            table.insert(self.entities, self.inputs[i]())
        end
    end
end

function CGEntityRandomPlay:execute(index)
    if not self.entities then
        self:getEntities()
    end

    if self.nexts[0] then
        self.nexts[0]()
    end

    local n = #self.entities
    if n == 0 then
        return 
    end

    self:setEntityVisible(math.random(1, n))
end

return CGEntityRandomPlay
