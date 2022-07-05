--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2020/12/24
-- Time: 3:50
-- To change this template use File | Settings | File Templates.
--

local CGPointInBox = CGPointInBox or {}
CGPointInBox.__index = CGPointInBox

function CGPointInBox.new()
    local self = setmetatable({}, CGPointInBox)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGPointInBox:setNext(index, func)
    self.nexts[index] = func
end

function CGPointInBox:setInput(index, func)
    self.inputs[index] = func
end

function CGPointInBox:execute(index)
    local rect = self.inputs[1]()
    if rect == nil then
        -- Amaz.LOGE("ERROR: ", "CGPointInBox rectangle is nil !")
        return
    end
    local tl_x = rect.topleft.x
    local tl_y = rect.topleft.y
    local bl_x = rect.bottomleft.x
    local bl_y = rect.bottomleft.y
    local tr_x = rect.topright.x
    local tr_y = rect.topright.y
    local br_x = rect.bottomright.x
    local br_y = rect.bottomright.y
    if tl_x == nil or tl_y == nil or bl_x == nil or bl_y == nil or tr_x == nil or tr_y == nil or br_x == nil or br_y == nil then
        -- Amaz.LOGE("ERROR: ", "CGPointInBox get a wrong rectangle")
        return
    end

    local pt = self.inputs[2]()
    if pt == nil then
        -- Amaz.LOGE("ERROR: ", "CGPointInBox point is nil !")
        return
    end
    local pt_x = pt.x
    local pt_y = pt.y
    if pt_x == nil or pt_y == nil then
        -- Amaz.LOGE("ERROR: ", "CGPointInBox get a wrong point !")
        return
    end

    -- Amaz.LOGE("INFO: ", "point info : " .. pt_x .. " , " .. pt_y)

    -- detect if the point is inside the quadrilateral
    local a = (tr_x - tl_x) * (pt_y - tl_y) - (tr_y - tl_y) * (pt_x - tl_x)
    local b = (br_x - tr_x) * (pt_y - tr_y) - (br_y - tr_y) * (pt_x - tr_x)
    local c = (bl_x - br_x) * (pt_y - br_y) - (bl_y - br_y) * (pt_x - br_x)
    local d = (tl_x - bl_x) * (pt_y - bl_y) - (tl_y - bl_y) * (pt_x - bl_x)
    -- Amaz.LOGE("INFO: ", "CGPointInBox : abcd: " .. a .. "  " .. b .. "  " .. c .. "  " .. d)
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

return CGPointInBox