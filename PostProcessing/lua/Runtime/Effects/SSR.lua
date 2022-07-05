SSR = ScriptableObject(PostProcessSettings)

function SSR : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pSSREnable"] = false
    self.settings["pSSRDownsample"] = 1 -- 1,8
    self.settings["pSSRBlurAmount"] = 0
    self.settings["pSSRHdr"] = false
    self.settings["pSSRMaxRayDistance"] = 10.0
    self.settings["pSSRPixelStrideZCutoff"] = 100.0
    self.settings["pSSRIterations"] = 30
    self.settings["pSSRPixelZSizeOffset"] = 0.1
    self.renderer = SSRRenderer.new()
    self.renderer:setSettings(self.settings)
end

function SSR : update(props)
    if not props:has("pSSREnable") then
        return
    end

    if self.enabled ~= props:get("pSSREnable") then
        self.enabled = props:get("pSSREnable")
        self.renderer:onDirty(true)
    end

    self.settings["pSSREnable"] = self.enabled

    if not self.enabled then
        return
    end

    if props:has("pSSRIterations") then
        self.settings["pSSRIterations"] = props:get("pSSRIterations")
    end

    if props:has("pSSRMaxRayDistance") then
        self.settings["pSSRMaxRayDistance"] = props:get("pSSRMaxRayDistance")
    end

    if props:has("pSSRPixelStrideZCutoff") then
        self.settings["pSSRPixelStrideZCutoff"] = props:get("pSSRPixelStrideZCutoff")
    end

    if props:has("pSSRPixelStride") then
        self.settings["pSSRPixelStride"] = props:get("pSSRPixelStride")
    end
end

function SSR : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end