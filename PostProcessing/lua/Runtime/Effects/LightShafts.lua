LightShafts = ScriptableObject(PostProcessSettings)

function LightShafts : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pLightShatfsEnable"] = false
    self.settings["pOcclusionMaskDarkness"] = 0.00
    self.settings["pOcclusionDepthRange"] = 0.00
    self.settings["pLSBloomScale"] = 0.00
    self.settings["pLSBloomThreshold"] = 1.00
    self.settings["pLSBloomMaxBrightness"] = 1.00
    self.settings["pLSBloomTint"] = Amaz.Vector4f(0.0, 0.0)
    self.settings["pDirectionalLight"] = nil
    self.renderer = LightShaftsRenderer.new()
    self.renderer:setSettings(self.settings)
end

function LightShafts : update(props)
    if not props:has("pLightShatfsEnable") then
        return
    end

    if self.enabled ~= props:get("pLightShatfsEnable") then
        self.enabled = props:get("pLightShatfsEnable")
        self.renderer:onDirty(true)
    end

    self.settings["pLightShatfsEnable"] = self.enabled

    if self.enabled then

        if self.settings["pLightShatfsOcclusionEnable"] ~= props:get("pLightShatfsOcclusionEnable")then
            self.settings["pLightShatfsOcclusionEnable"] = props:get("pLightShatfsOcclusionEnable")
            self.renderer:onDirty(true)
        end
        if self.settings["pLightShatfsBloomEnable"] ~= props:get("pLightShatfsBloomEnable")then
            self.settings["pLightShatfsBloomEnable"] = props:get("pLightShatfsBloomEnable")
            self.renderer:onDirty(true)
        end

        
        if props:has("pOcclusionMaskDarkness") then
            self.settings["pOcclusionMaskDarkness"] = props:get("pOcclusionMaskDarkness")
        end
        if props:has("pOcclusionDepthRange") then
            self.settings["pOcclusionDepthRange"] = props:get("pOcclusionDepthRange")
        end
        if props:has("pLSBloomScale") then
            self.settings["pLSBloomScale"] = props:get("pLSBloomScale")
        end
        if props:has("pLSBloomThreshold") then
            self.settings["pLSBloomThreshold"] = props:get("pLSBloomThreshold")
        end  
        if props:has("pLSBloomMaxBrightness") then
            self.settings["pLSBloomMaxBrightness"] = props:get("pLSBloomMaxBrightness")
        end
        if props:has("pLSBloomTint") then
            self.settings["pLSBloomTint"] = props:get("pLSBloomTint")
        end
        if props:has("pDirectionalLight") then
            self.settings["pDirectionalLight"] = props:get("pDirectionalLight")
        end
    end
end

function LightShafts : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end