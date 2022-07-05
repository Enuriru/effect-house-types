ChromaticAberration = ScriptableObject(PostProcessSettings)

function ChromaticAberration : ctor()
    self.commands = Amaz.CommandBuffer();

    self.settings["enabled"] = true;
    self.settings["fastMode"] = false;
    self.settings["intensity"] = 0.7;
    self.settings["spectralLut"]=nil;
    self.renderer = ChromaticAberrationRenderer.new();
    self.renderer:setSettings(self.settings);
end

function ChromaticAberration : update(props)
    if not props:has("pChromaticAberrationEnable") then
        return;
    end

    if self.enabled ~= props:get("pChromaticAberrationEnable") then
        self.enabled = props:get("pChromaticAberrationEnable");
        self.renderer:onDirty(true);
    end

    self.settings["enabled"] = self.enabled

    if props:has("pFastChromaticAberration") then
        self.settings["fastMode"] = props:get("pFastChromaticAberration");
    end
    
    if props:has("pChromaticAberrationIntensity") then
        self.settings["intensity"] = props:get("pChromaticAberrationIntensity");
    end
    if props:has("pSpectralLut") then
        if self.settings["spectralLut"] ~= props:get("pSpectralLut") then
        self.settings["spectralLut"] = props:get("pSpectralLut")
        self.renderer:onDirty(true)
        end
    end
end

function ChromaticAberration : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end