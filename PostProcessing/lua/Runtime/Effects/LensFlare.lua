LensFlare = ScriptableObject(PostProcessSettings)

function LensFlare : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pLensFlareEnable"] = false

    self.settings["pFlarePos"] = Amaz.Vector2f(0.7, 0.3)

    self.renderer = LensFlareRenderer.new()
    self.renderer:setSettings(self.settings)
end

function LensFlare : update(props)
    if not props:has("pLensFlareEnable") then
        return
    end

    if self.enabled ~= props:get("pLensFlareEnable") then
        self.enabled = props:get("pLensFlareEnable")
        -- Allows to be on/off when clicked on the UI from AE 
        self.renderer:onDirty(true)
    end

    self.settings["pLensFlareEnable"] = self.enabled

    if self.enabled then

        if props:has("pFlarePos") then
            self.settings["pFlarePos"] = props:get("pFlarePos")
        end

    end
end

function LensFlare : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end