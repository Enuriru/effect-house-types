Vignette = ScriptableObject(PostProcessSettings)

function Vignette : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pVignetteEnable"] = false
    self.settings["pVignettePower"] = 0.00
    self.settings["pVignetteContrast"] = 1.00

    self.renderer = VignetteRenderer.new()
    self.renderer:setSettings(self.settings)
end

function Vignette : update(props)
    if not props:has("pVignetteEnable") then
        return
    end

    if self.enabled ~= props:get("pVignetteEnable") then
        self.enabled = props:get("pVignetteEnable")
        -- Allows to be on/off when clicked on the UI from AE 
        self.renderer:onDirty(true)
    end

    self.settings["pVignetteEnable"] = self.enabled

    if self.enabled then
        if props:has("pVignettePower") then
            self.settings["pVignettePower"] = props:get("pVignettePower")
        end
        if props:has("pVignetteContrast") then
            self.settings["pVignetteContrast"] = props:get("pVignetteContrast")
        end
    end
end

function Vignette : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end