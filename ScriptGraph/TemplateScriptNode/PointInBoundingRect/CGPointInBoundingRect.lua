--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/10
-- Time: 12:21
-- To change this template use File | Settings | File Templates.
--

local CGPointInBoundingRect = CGPointInBoundingRect or {}
CGPointInBoundingRect.__index = CGPointInBoundingRect

function CGPointInBoundingRect.new()
    local self = setmetatable({}, CGPointInBoundingRect)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGPointInBoundingRect:setNext(index, func)
    self.nexts[index] = func
end

function CGPointInBoundingRect:setInput(index, func)
    self.inputs[index] = func
end

function CGPointInBoundingRect:execute(index)
    if self.inputs[1] == nil or self.inputs[2] == nil then
        return
    end
    local pt = self.inputs[1]()
    local rect = self.inputs[2]()
    if pt == nil or rect == nil then
        return
    end

    local pt_x = pt.x
    local pt_y = pt.y

--    if (pt_x > 1 or pt_x < 0 or pt_y > 1 or pt_y < 0) then
--        return
--    end

    local tl_x = rect.x
    local tl_y = rect.y
--    if (tl_x > 1 or tl_x < 0 or tl_y > 1 or tl_y < 0) then
--        return
--    end
    if (rect.width <= 0 or rect.height <= 0) then
        if self.nexts[1] then
            -- Amaz.LOGE("INFO: ", "CGPointInBox : click outside the box !!")
            self.nexts[1]()
        end
        return
    end
    local bl_x = rect.x
    local bl_y = rect.y + rect.height
    local tr_x = rect.x + rect.width
    local tr_y = rect.y
    local br_x = rect.x + rect.width
    local br_y = rect.y + rect.height

    -- detect if the point is inside the bounding rect
    local a = (tr_x - tl_x) * (pt_y - tl_y) - (tr_y - tl_y) * (pt_x - tl_x)
    local b = (br_x - tr_x) * (pt_y - tr_y) - (br_y - tr_y) * (pt_x - tr_x)
    local c = (bl_x - br_x) * (pt_y - br_y) - (bl_y - br_y) * (pt_x - br_x)
    local d = (tl_x - bl_x) * (pt_y - bl_y) - (tl_y - bl_y) * (pt_x - bl_x)
    -- Amaz.LOGE("INFO: ", "CGPointInBoundingRect : abcd: " .. a .. "  " .. b .. "  " .. c .. "  " .. d)

    if ((a > 0 and b > 0 and c > 0 and d > 0) or (a < 0 and b < 0 and c < 0 and d < 0)) then
        if self.nexts[0] then
            -- Amaz.LOGE("INFO: ", "CGPointInBox : click inside the box !!")
            self.nexts[0]()
        end
    else
        if self.nexts[1] then
            -- Amaz.LOGE("INFO: ", "CGPointInBox : click outside the box !!")
            self.nexts[1]()
        end
    end
end

return CGPointInBoundingRect