local CGEntityLoopPlay = CGEntityLoopPlay or {}
CGEntityLoopPlay.__index = CGEntityLoopPlay

function CGEntityLoopPlay.new()
    local self = setmetatable({}, CGEntityLoopPlay)
    self.inputs = {}
    self.nexts = {}

    self.entities = nil

    self.updating = false
    self.start = false
    
    self.curTime = 0
    self.index = 0
    self.loopIndex = 0
    self.loopCount = 0

    return self
end

function CGEntityLoopPlay:setInput(index, func)
    self.inputs[index] = func
end

function CGEntityLoopPlay:setNext(index, func)
    self.nexts[index] = func
end

function CGEntityLoopPlay:setEntityVisible(index)
    self.entities[index]["visible"] = true
    for i = 1, #self.entities do
        if i ~= index then
            self.entities[i]["visible"] = false
        end
    end
end

function CGEntityLoopPlay:getEntities()
    self.entities = {}
    for i = 2, 6 do
        if self.inputs[i] then
            table.insert(self.entities, self.inputs[i]())
        end
    end
end

function CGEntityLoopPlay:init()
    self:getEntities()
    self.index = 0
    self.curTime = 0
    self.loopIndex = 0
    self.loopCount = 0
    if self.inputs[7]() then
        self.index = math.random(0, #self.entities - 1)
    end
end

function CGEntityLoopPlay:execute(index)
    if index == 0 then     
        if not self.start then
            self:init()
            self.start = true
            
            if self.nexts[0] then
                self.nexts[0]()
            end
        end
        self.updating = true
    elseif index == 1 then
        self.updating = false
    end
end

function CGEntityLoopPlay:update(sys, deltaTime)
    if not self.updating or #self.entities == 0 then
        return
    end 

    if self.curTime == 0 then      
        self:setEntityVisible(self.index + 1)

        if self.nexts[1] then
            self.nexts[1]()
        end

        local n = #self.entities
        self.index = (self.index + 1) % n
        self.loopIndex = self.loopIndex + 1
        if self.loopIndex >= n then
            self.loopCount = self.loopCount + 1
            self.loopIndex = 0
        end

        local loopTimes = self.inputs[8]()
        if self.loopCount >= loopTimes then
            self.start = false
            self.updating = false
        end
    end

    self.curTime = self.curTime + deltaTime
    local duration = self.inputs[9]()
    if self.curTime >= duration then
        self.curTime = 0
    end
end

return CGEntityLoopPlay
