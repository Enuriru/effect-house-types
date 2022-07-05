Fog = ScriptableObject(PostProcessSettings)

function Fog : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pFogEnable"] = false
    self.settings["pFogParams"] = Amaz.Vector2f(1.0, 20.0)
    self.settings["pFogColor"] = Amaz.Vector4f(1.0, 1.0, 1.0, 1.0)
    self.renderer = FogRenderer.new()
    self.renderer:setSettings(self.settings)
end

function Fog : update(props)
    if not props:has("pFogEnable") then
        return
    end

    if self.enabled ~= props:get("pFogEnable") then
        self.enabled = props:get("pFogEnable")
        self.renderer:onDirty(true)
    end

    self.settings["pFogEnable"] = self.enabled

    if self.enabled then
        if props:has("pFogParams") then
            self.settings["pFogParams"] = props:get("pFogParams")
        end
        if props:has("pFogColor") then
            self.settings["pFogColor"] = props:get("pFogColor")
        end
    end
end

function Fog : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end