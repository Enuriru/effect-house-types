local exports = exports or {}
local EyeColorController = EyeColorController or {}

EyeColorController.__index = EyeColorController

function EyeColorController.new(construct, ...)
    local self = setmetatable({}, EyeColorController)

    self.makeupUniform = "sucaiImageTexture"
    self.opacityUniform = "opacityTexture"
    self.maskUniform = "maskTexture"
    self.intensityUniform = "intensity"
    self.opacityUniform = "opacity"
    self.opacityEnableUniform = "useOpacity"
    self.colorUniform = "color"

    self.blendModeMacro = {
        "AMAZING_USE_BLENDMODE_NOMRAL",
        "AMAZING_USE_BLENDMODE_MUTIPLAY",
        "AMAZING_USE_BLENDMODE_OVERLAY",
        "AMAZING_USE_BLENDMODE_ADD",
        "AMAZING_USE_BLENDMODE_SCREEN",
        "AMAZING_USE_BLENDMODE_SOFTLIGHT",
        "AMAZING_USE_BLENDMODE_AVERAGE",
        "AMAZING_USE_BLENDMODE_COLORBURN",
        "AMAZING_USE_BLENDMODE_COLORDODGE",
        "AMAZING_USE_BLENDMODE_DARKEN",
        "AMAZING_USE_BLENDMODE_DIFFERENCE",
        "AMAZING_USE_BLENDMODE_EXCLUSION",
        "AMAZING_USE_BLENDMODE_LIGHTEN",
        "AMAZING_USE_BLENDMODE_LINEARDODGE"
    }
    return self
end

function EyeColorController:onStart(comp)
    Amaz.LOGD("Orion", "EyeColorController:onStart()")
    local makeupProps = comp.properties
    if makeupProps:empty() then
        local tex2d = Amaz.Texture2D()
        makeupProps:set("makeupTex", tex2d)
        makeupProps:set("opacityTex", tex2d)
        makeupProps:set("maskTex", tex2d)
        makeupProps:set("intensity", 0)
        local opacities = Amaz.UInt8Vector()
        opacities:pushBack(1)
        opacities:pushBack(1)
        opacities:pushBack(1)
        opacities:pushBack(1)
        opacities:pushBack(1)
        makeupProps:set("opacities", opacities)
        makeupProps:set("opacityEnable", 0)
        makeupProps:set("color", Amaz.Color(1, 1, 1, 1))
        makeupProps:set("blendMode", 1)
        makeupProps:set("blendModeDirty", false)
        comp.properties = makeupProps
    end
end

function EyeColorController:onUpdate(comp, deltaTime)
    Amaz.LOGD("Orion", "EyeColorController:onUpdate()")
    local makeupProps = comp.properties
    if makeupProps:empty() then
        return
    end

    local opacities = makeupProps:get("opacities")
    local makeupComp = comp.entity:getComponent("EffectFaceMakeupFaceU")
    local size = opacities:size()
    for i = 0, size - 1 do
        makeupComp:setFaceUniform(self.opacityUniform, i, opacities:get(i))
    end

    local renderer = comp.entity:getComponent("MeshRenderer")
    local rendererProps = renderer.props
    rendererProps:setTexture(self.makeupUniform, makeupProps:get("makeupTex"))
    rendererProps:setTexture(self.opacityUniform, makeupProps:get("opacityTex"))
    rendererProps:setTexture(self.maskUniform, makeupProps:get("maskTex"))
    rendererProps:setFloat(self.intensityUniform, makeupProps:get("intensity"))
    rendererProps:setFloat(self.opacityEnableUniform, makeupProps:get("opacityEnable"))
    rendererProps:setVec4(self.colorUniform, makeupProps:get("color"))

    if makeupProps:get("blendModeDirty") then
        local blendModeType = makeupProps:get("blendMode")
        local blendModeString = self.blendModeMacro[blendModeType]
        local materials = self.makeupRenderer.materials
        for i = 1, #materials do
            local material = materials:get(i - 1)
            material.enabledMacros:clear()
            material:enableMacro(blendModeString, 1)
        end
        makeupProps:set("blendModeDirty", false)
    end
end

exports.EyeColorController = EyeColorController
return exports
