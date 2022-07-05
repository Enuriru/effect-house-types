AutoExposure = ScriptableObject(PostProcessSettings)

function AutoExposure : ctor()
    self.commands = Amaz.CommandBuffer();

    self.settings["enabled"] = false
    self.settings["filteringMax"] = 95.0
    self.settings["filteringMin"] = 50.0
    self.settings["minimum"]=0.0
    self.settings["maximum"]=0.0
    self.settings["ExposureCompensation"]=1.0
    self.settings["AdaptationType"]="Progressive"
    self.settings["SpeedUp"]=1.0
    self.settings["SpeedDown"]=1.0
    self.renderer = AutoExposureRenderer.new();
    self.renderer:setSettings(self.settings);
end

function AutoExposure : update(props)

    if self.enabled ~= props:get("pAutoExposureEnable") then
        self.enabled = props:get("pAutoExposureEnable");
        self.renderer:onDirty(true);
    end

    self.settings["enabled"] = self.enabled

    if props:has("pFilteringMax") then
        self.settings["filteringMax"] = props:get("pFilteringMax");
    end
    
    
    if props:has("pFilteringMin") then
        self.settings["filteringMin"] = props:get("pFilteringMin");
    end

    if props:has("pMinimum") then
        self.settings["minimum"] = props:get("pMinimum");
    end

    if props:has("pMaximum") then
        self.settings["maximum"] = props:get("pMaximum");
    end

    if props:has("pExposureCompensation") then
        self.settings["ExposureCompensation"] = props:get("pExposureCompensation");
    end


    if props:has("pAdaptationType") then
        if  props:get("pAdaptationType") =="Progressive" or props:get("pAdaptationType") =="Fixed" or props:get("pAdaptationType") =="Simple" then
            self.settings["AdaptationType"] = props:get("pAdaptationType");
            else
                self.settings["AdaptationType"] = "Progressive"
            end
    end
    if props:has("pSpeedUp") then
        self.settings["SpeedUp"] = props:get("pSpeedUp");
    end
    if props:has("pSpeedDown") then
        self.settings["SpeedDown"] = props:get("pSpeedDown");
    end

end


function AutoExposure : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end