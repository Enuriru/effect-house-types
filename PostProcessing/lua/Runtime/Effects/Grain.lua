Grain = ScriptableObject(PostProcessSettings)

function Grain : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pGrainEnable"] = false

    self.settings["pGrainStrength"] = 0.00
    self.settings["pGrainColor"] = 0.00
    self.settings["pGrainSpeed"] = 0.00

    self.renderer = GrainRenderer.new()
    self.renderer:setSettings(self.settings)
end

function Grain : update(props)
    if not props:has("pGrainEnable") then
        return
    end

    if self.enabled ~= props:get("pGrainEnable") then
        self.enabled = props:get("pGrainEnable")
        -- Allows to be on/off when clicked on the UI from AE 
        self.renderer:onDirty(true)
    end

    self.settings["pGrainEnable"] = self.enabled

    if self.enabled then

        if props:has("pGrainStrength") then
            self.settings["pGrainStrength"] = props:get("pGrainStrength")
        end

        if props:has("pGrainColor") then
            self.settings["pGrainColor"] = props:get("pGrainColor")
        end

        if props:has("pGrainSpeed") then
            self.settings["pGrainSpeed"] = props:get("pGrainSpeed")
        end

    end
end

function Grain : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end