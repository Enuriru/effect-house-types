BokehBlur = ScriptableObject(PostProcessSettings)

function BokehBlur : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pBokehBlurEnable"] = false
    self.settings["pBokehBlurSize"] = 1
    self.settings["pBokehBlurIteration"] = 5
    self.settings["pBokehShape"]="Hexagon"
    self.settings["pFastCircle"]=false
    self.settings["pDownSample"]=2
    self.renderer = BokehBlurRenderer.new()
    self.renderer:setSettings(self.settings)
end

function BokehBlur : update(props)
    if not props:has("pBokehBlurEnable") then
        return
    end
    if self.enabled ~= props:get("pBokehBlurEnable") then
        self.enabled = props:get("pBokehBlurEnable")
        self.renderer:onDirty(true)
    end
    
    self.settings["pBokehBlurEnable"] = self.enabled
    if self.enabled then
        if  self.settings["pBokehBlurSize"] ~= props:get("pBokehBlurSize") then
            self.settings["pBokehBlurSize"] = props:get("pBokehBlurSize") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pBokehBlurIteration"] ~= props:get("pBokehBlurIteration") then
            self.settings["pBokehBlurIteration"] = props:get("pBokehBlurIteration") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pBokehShape"] ~= props:get("pBokehShape") then
            self.settings["pBokehShape"] = props:get("pBokehShape") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pFastCircle"] ~= props:get("pFastCircle") then
            self.settings["pFastCircle"] = props:get("pFastCircle") 
            self.renderer:onDirty(true)
        end
        if  self.settings["pDownSample"] ~= props:get("pDownSample") then
            self.settings["pDownSample"] = props:get("pDownSample") 
            self.renderer:onDirty(true)
        end
    end
end

function BokehBlur : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end