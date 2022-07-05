SSAO = ScriptableObject(PostProcessSettings)

function SSAO : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pSSAOEnable"] = false
    self.settings["pSSAORadius"] = 8.0
    self.settings["pSSAOIntensity"] = 1.0
    self.settings["pSSAOColor"] = Amaz.Vector4f(0, 0, 0, 0)
    -- self.settings["pSSAOBias"] = 0.1
    self.settings["pSSAOPowerExponent"] = 0.67
    self.settings["pSSAOThickness"] = 1.0
    self.settings["pSSAODownsampleEnabled"] = true
    self.settings["pSSAOFadeEnabled"] = false
    self.settings["pSSAOFadeStart"] = 100
    self.settings["pSSAOFadeLength"] = 50
    self.settings["pSSAOFadeIntensity"] = 1.0
    self.settings["pSSAOFadeTint"] = Amaz.Vector4f(0, 0, 0, 0)
    self.settings["pSSAOFadeRadius"] = 2.0
    self.settings["pSSAOFadePowExponent"] = 1.8
    self.settings["pSSAOFadeThickness"] = 1.0
    self.settings["pSSAOBlurEnable"] = true
    self.settings["pSSAOBlurPasses"] = 1
    self.settings["pSSAOBlurRadius"] = 4
    self.settings["pSSAOBlurSharpness"] = 100
    self.settings["pSSAOUseMRT"] = false
    self.settings["pSSAOUseLinearDepth"] = false
    self.settings["pFlipDepth"] = false
    
    self.renderer = SSAORenderer.new()
    self.renderer:setSettings(self.settings)
end

function SSAO : flipDepth(flip)
    self.settings["pFlipDepth"] = flip
end

function SSAO : update(props)
    if not props:has("pSSAOEnable") then
        return
    end

    if self.enabled ~= props:get("pSSAOEnable") then
        self.enabled = props:get("pSSAOEnable")
        self.renderer:onDirty(true)
    end

    self.settings["pSSAOEnable"] = self.enabled

    if not self.enabled then
        return
    end

    --update options
    if props:has("pSSAOIntensity") then
        self.settings["pSSAOIntensity"] = props:get("pSSAOIntensity")
    end

    if props:has("pSSAORadius") then
        self.settings["pSSAORadius"] = props:get("pSSAORadius")
    end

    -- if props:has("pSSAOBias") then
    --     self.settings["pSSAOBias"] = props:get("pSSAOBias")
    -- end

    if props:has("pSSAOThickness") then
        self.settings["pSSAOThickness"] = props:get("pSSAOThickness")
    end

    if props:has("pSSAOPowerExponent") then
        self.settings["pSSAOPowerExponent"] = props:get("pSSAOPowerExponent")
    end
    if props:has("pSSAOColor") then
        self.settings["pSSAOColor"] = props:get("pSSAOColor")
    end

    if props:has("pSSAOBlurEnable") then
        local blurEnabled = props:get("pSSAOBlurEnable")
        if self.settings["pSSAOBlurEnable"] ~= blurEnabled then
            self.settings["pSSAOBlurEnable"] = blurEnabled
            self.renderer:onDirty(true)
        end
    end

    if props:has("pSSAOBlurSharpness") then
        self.settings["pSSAOBlurSharpness"] = props:get("pSSAOBlurSharpness")
    end

    if props:has("pSSAOUseMRT") then
        self.settings["pSSAOUseMRT"] = props:get("pSSAOUseMRT")
    end

    if props:has("pSSAOUseLinearDepth") then
        self.settings["pSSAOUseLinearDepth"] = props:get("pSSAOUseLinearDepth")
    end

    if props:has("pSSAOBlurPasses") then
        local passes = props:get("pSSAOBlurPasses")
        if self.settings["pSSAOBlurPasses"] ~= passes then 
            self.settings["pSSAOBlurPasses"] = passes
        end
        self.renderer:onDirty(true)
    end

    if props:has("pSSAOBlurRadius") then
        self.settings["pSSAOBlurRadius"] = props:get("pSSAOBlurRadius")
    end
end

function SSAO : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end