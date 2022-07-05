--
-- Created by IntelliJ IDEA.
-- User: xuyuan
-- Date: 2021/3/11
-- Time: 6:25
-- To change this template use File | Settings | File Templates.
--

local CGGetSprite2DRegion = CGGetSprite2DRegion or {}
CGGetSprite2DRegion.__index = CGGetSprite2DRegion

function CGGetSprite2DRegion.new()
    local self = setmetatable({}, CGGetSprite2DRegion)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.screenHeight = Amaz.BuiltinObject:getInputTextureHeight()
    self.screenWidth = Amaz.BuiltinObject:getInputTextureWidth()
    self.transform2d = nil
    self.camera = nil
    return self
end

function CGGetSprite2DRegion:setNext(index, func)
    self.nexts[index] = func
end

function CGGetSprite2DRegion:setInput(index, func)
    self.inputs[index] = func
end

function CGGetSprite2DRegion:getOutput(index)
    return self.outputs[index]
end

function CGGetSprite2DRegion:execute(index)
    if self.inputs[1] == nil or self.inputs[2] == nil then
        return
    end
    self.transform2d = self.inputs[1]()
    self.camera = self.inputs[2]()
    if self.transform2d == nil or self.camera == nil then
        return
    end
    if not self.transform2d.entity.visible then
        self.outputs[1] = Amaz.Rect(0, 0, 0, 0)
        if self.nexts[0] then
        	self.nexts[0]()
    	end
        return
    end

    --get sprite world pos
    local worldPosArray = self.transform2d:getWorldRectPosArray()
    if worldPosArray:size() ~= 4 then
        return
    end
    local bottomleft = worldPosArray:get(0)
    local bottomright = worldPosArray:get(1)
    local topleft = worldPosArray:get(2)
    local topright = worldPosArray:get(3)

    --get camera matrix
    local cameraToWorld = self.camera:getCameraToWorldMatrix()
    local worldToCamera = cameraToWorld:invert_Full()

    -- convert world pos
    local convert_bl = worldToCamera:multiplyPoint3(bottomleft)
    local convert_br = worldToCamera:multiplyPoint3(bottomright)
    local convert_tl = worldToCamera:multiplyPoint3(topleft)
    local convert_tr = worldToCamera:multiplyPoint3(topright)

    -- world to pixel
    local bl_x_pixel = convert_bl.x * self.screenHeight / 2
    local bl_y_pixel = convert_bl.y * self.screenHeight / 2
    local br_x_pixel = convert_br.x * self.screenHeight / 2
    local br_y_pixel = convert_br.y * self.screenHeight / 2
    local tl_x_pixel = convert_tl.x * self.screenHeight / 2
    local tl_y_pixel = convert_tl.y * self.screenHeight / 2
    local tr_x_pixel = convert_tr.x * self.screenHeight / 2
    local tr_y_pixel = convert_tr.y * self.screenHeight / 2

--    Amaz.LOGE("INFO:", "convert pixel bl : " .. bl_x_pixel .. "  " .. bl_y_pixel)
--    Amaz.LOGE("INFO:", "convert pixel br : " .. br_x_pixel .. "  " .. br_y_pixel)
--    Amaz.LOGE("INFO:", "convert pixel tl : " .. tl_x_pixel .. "  " .. tl_y_pixel)
--    Amaz.LOGE("INFO:", "convert pixel tr : " .. tr_x_pixel .. "  " .. tr_y_pixel)

    -- pixel to normalized
    local transMatrix = Amaz.Matrix3x3f(
        1, 0, 0.5,
        0, -1, 0.5,
        0, 0, 1)
    local bl_pixel_vector3f = Amaz.Vector3f(bl_x_pixel / self.screenWidth, bl_y_pixel / self.screenHeight, 1)
    local br_pixel_vector3f = Amaz.Vector3f(br_x_pixel / self.screenWidth, br_y_pixel / self.screenHeight, 1)
    local tl_pixel_vector3f = Amaz.Vector3f(tl_x_pixel / self.screenWidth, tl_y_pixel / self.screenHeight, 1)
    local tr_pixel_vector3f = Amaz.Vector3f(tr_x_pixel / self.screenWidth, tr_y_pixel / self.screenHeight, 1)

    local bl_norm_vector3f = transMatrix:multiplyVector3(bl_pixel_vector3f)
    local br_norm_vector3f = transMatrix:multiplyVector3(br_pixel_vector3f)
    local tl_norm_vector3f = transMatrix:multiplyVector3(tl_pixel_vector3f)
    local tr_norm_vector3f = transMatrix:multiplyVector3(tr_pixel_vector3f)

--    Amaz.LOGE("INFO:", "norm pt bl : " .. bl_norm_vector3f.x .. "  " .. bl_norm_vector3f.y)
--    Amaz.LOGE("INFO:", "norm pt br : " .. br_norm_vector3f.x .. "  " .. br_norm_vector3f.y)
--    Amaz.LOGE("INFO:", "norm pt tl : " .. tl_norm_vector3f.x .. "  " .. tl_norm_vector3f.y)
--    Amaz.LOGE("INFO:", "norm pt tr : " .. tr_norm_vector3f.x .. "  " .. tr_norm_vector3f.y)

    -- calcute the bounding box

    local pt = {}
    pt[1] = Amaz.Vector2f(bl_norm_vector3f.x, bl_norm_vector3f.y)
    pt[2] = Amaz.Vector2f(br_norm_vector3f.x, br_norm_vector3f.y)
    pt[3] = Amaz.Vector2f(tl_norm_vector3f.x, tl_norm_vector3f.y)
    pt[4] = Amaz.Vector2f(tr_norm_vector3f.x, tr_norm_vector3f.y)

    local minx = pt[1].x
    local maxx = pt[1].x
    local miny = pt[1].y
    local maxy = pt[1].y

    for i = 2,4 do
        if pt[i].x < minx then
            minx = pt[i].x
        end
        if pt[i].x > maxx then
            maxx = pt[i].x
        end
        if pt[i].y < miny then
            miny = pt[i].y
        end
        if pt[i].y > maxy then
            maxy = pt[i].y
        end
    end

    local width = maxx - minx
    local height = maxy - miny
    local rectPt = Amaz.Vector2f(minx, miny)

    --Amaz.LOGE("INFO:", "rect info : " .. rectPt.x .. "  " .. rectPt.y .. "  " .. width .. "  " .. height)
    self.outputs[1] = Amaz.Rect(rectPt.x, rectPt.y, width, height)

    if self.nexts[0] ~= nil then
        self.nexts[0]()
    end
end

function CGGetSprite2DRegion:printMatrix4x4(matrix, name)
    Amaz.LOGE("Matrix4x4", "matrix name: " .. name .. "  [0][0]  " .. matrix:get(0,0) .. "  [0][1]  " .. matrix:get(0,1) .. "  [0][2]  " .. matrix:get(0,2) .. "  [0][3]  " .. matrix:get(0,3) ..
            "  [1][0]  " .. matrix:get(1,0) .. "  [1][1]  " .. matrix:get(1,1) .. "  [1][2]  " .. matrix:get(1,2) .. "  [1][3]  " .. matrix:get(1,3) ..
            "  [2][0]  " .. matrix:get(2,0) .. "  [2][1]  " .. matrix:get(2,1) .. "  [2][2]  " .. matrix:get(2,2) .. "  [0][3]  " .. matrix:get(2,3) ..
            "  [3][0]  " .. matrix:get(3,0) .. "  [3][1]  " .. matrix:get(3,1) .. "  [3][2]  " .. matrix:get(3,2) .. "  [0][3]  " .. matrix:get(3,3))
end

return CGGetSprite2DRegion