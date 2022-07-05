MotionBlur = ScriptableObject(PostProcessSettings)

function MotionBlur : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pMotionBlurEnable"] = false
    self.settings["pBlurStrength"] = 0.7

    self.renderer = MotionBlurRenderer.new()
    self.renderer:setSettings(self.settings)
end

function MotionBlur : update(props)
    if not props:has("pMotionBlurEnable") then
        return
    end

    if self.enabled ~= props:get("pMotionBlurEnable") then
        self.enabled = props:get("pMotionBlurEnable")
        -- Allows to be on/off when clicked on the UI from AE 
        self.renderer:onDirty(true)
    end

    self.settings["pMotionBlurEnable"] = self.enabled

    if self.enabled then
        if props:has("pBlurStrength") then
            self.settings["pBlurStrength"] = props:get("pBlurStrength")
        end
    end
end

function MotionBlur : render(sys,renderContext)
    if renderContext ~= nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end