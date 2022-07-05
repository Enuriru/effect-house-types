--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/10
-- Time: 3:50
-- To change this template use File | Settings | File Templates.
--

local CGBoundingRectCollisionDetection = CGBoundingRectCollisionDetection or {}
CGBoundingRectCollisionDetection.__index = CGBoundingRectCollisionDetection

function CGBoundingRectCollisionDetection.new()
    local self = setmetatable({}, CGBoundingRectCollisionDetection)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGBoundingRectCollisionDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGBoundingRectCollisionDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGBoundingRectCollisionDetection:isContained(rect1, rect2)
    if rect1.x >= rect2.x and
            rect1.x + rect1.width <= rect2.x + rect2.width and
            rect1.y >= rect2.y and
            rect1.y + rect1.height <= rect2.y + rect2.height then
        return true
    elseif rect2.x >= rect1.x and
                rect2.x + rect2.width <= rect1.x + rect1.width and
                rect2.y >= rect1.y and
                rect2.y + rect2.height <= rect1.y + rect1.height then
        return true
    else
        return false
    end
end

function CGBoundingRectCollisionDetection:isIntersected(rect1, rect2)
    return not (rect1.x > rect2.x + rect2.width or rect2.x > rect1.x + rect1.width
                or rect1.y > rect2.y + rect2.height or rect2.y > rect1.y + rect1.height)
end

function CGBoundingRectCollisionDetection:execute(index)
    if self.inputs[1] == nil or self.inputs[2] == nil then
        return
    end
    local rect1 = self.inputs[1]()
    local rect2 = self.inputs[2]()
    if rect1 == nil or rect2 == nil then
        return
    end
    if rect1.x == 0 and rect1.y == 0 and rect1.width == 0 and rect1.height == 0 then
        if self.nexts[2] then
            self.nexts[2]()
        end
        return
    end
    if rect2.x == 0 and rect2.y == 0 and rect2.width == 0 and rect2.height == 0 then
        if self.nexts[2] then
            self.nexts[2]()
        end
        return
    end
    if rect1.width < 0 or rect1.height < 0 then
        if self.nexts[2] then
            self.nexts[2]()
        end
        return
    end
    if rect2.width < 0 or rect2.height < 0 then
        if self.nexts[2] then
            self.nexts[2]()
        end
        return
    end
    -- local ret = self:isContained(rect1, rect2)
    -- Amaz.LOGE("INFO: ", "CGBoundingRectCollisionDetection : detection result: " .. tostring(ret))
    if self:isContained(rect1, rect2) then
        if self.nexts[1] then
            self.nexts[1]()
        end
    end
    if self:isIntersected(rect1, rect2) then
        if self.nexts[0] then
            self.nexts[0]()
        end
    else
        if self.nexts[2] then
            self.nexts[2]()
        end
    end
end

return CGBoundingRectCollisionDetection