DepthOfField = ScriptableObject(PostProcessSettings)

function DepthOfField : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pDOFEnable"] = false
    self.settings["pFocusDistance"] = 10
    self.settings["pAperture"] = 5.6
    self.settings["pFocalLength"] = 50
    self.settings["pMaxBlurSize"] = "Medium"
    self.renderer = DepthOfFieldRenderer.new()
    self.renderer:setSettings(self.settings)
end

function DepthOfField : update(props)
    if not props:has("pDOFEnable") then
        return
    end

    if self.enabled ~= props:get("pDOFEnable") then
        self.enabled = props:get("pDOFEnable")
        self.renderer:onDirty(true)
    end

    self.settings["pDOFEnable"] = self.enabled

    if self.enabled then

        if  self.settings["pFocusDistance"] ~= props:get("pFocusDistance") then
            self.settings["pFocusDistance"] = props:get("pFocusDistance") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pAperture"] ~= props:get("pAperture") then
            self.settings["pAperture"] = props:get("pAperture") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pFocalLength"] ~= props:get("pFocalLength") then
            self.settings["pFocalLength"] = props:get("pFocalLength") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pMaxBlurSize"] ~= props:get("pMaxBlurSize") then
            self.settings["pMaxBlurSize"] = props:get("pMaxBlurSize") 
            self.renderer:onDirty(true)
        end
    end
end

function DepthOfField : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end