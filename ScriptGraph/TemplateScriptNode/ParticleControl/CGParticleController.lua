--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/05/27
-- Time: 11:57
-- To change this template use File | Settings | File Templates.
--

local CGParticleController = CGParticleController or {}
CGParticleController.__index = CGParticleController

function CGParticleController.new()
    local self = setmetatable({}, CGParticleController)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.component = nil
    return self
end

function CGParticleController:setNext(index, func)
    self.nexts[index] = func
end

function CGParticleController:setInput(index, func)
    self.inputs[index] = func
end

function CGParticleController:getOutput(index)
    return self.outputs[index]
end

function CGParticleController:execute(index)
    if self.inputs[4] == nil then
        return
    end
    self.component = self.inputs[4]()
    if index == 0 then
        self.component:start()
        if self.nexts[1] then
            self.nexts[1]();
        end
    elseif index == 1 then
        self.component:stop()
        if self.nexts[2] then
            self.nexts[2]()
        end
    elseif index == 2 then
        self.component:pause()
    elseif index == 3 then
        self.component:resume()
    end
    if self.nexts[0] then
        self.nexts[0]()
    end
end

return CGParticleController