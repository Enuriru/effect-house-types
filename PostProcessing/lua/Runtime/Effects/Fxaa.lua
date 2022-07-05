Fxaa = ScriptableObject(PostProcessSettings)

function Fxaa : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pFxaaFastMode"] = 1
    self.settings["pFxaaKeepAlpha"] = 1
    self.settings["pFxaaEnable"] = false
    self.renderer = FxaaRenderer.new()
    self.renderer:setSettings(self.settings)
end

function Fxaa : update(props)
    if not props:has("pFxaaEnable") then
        return
    end

    if self.enabled ~= props:get("pFxaaEnable") then
        self.enabled = props:get("pFxaaEnable")
        self.renderer:onDirty(true)
    end
    self.settings["pFxaaEnable"] = self.enabled

    if self.enabled then
        self.settings["pFxaaEnable"] = props:get("pFxaaEnable")
    end
end

function Fxaa : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end