Distort = ScriptableObject(PostProcessSettings)

function Distort : ctor()
    self.commands = Amaz.CommandBuffer()
    self.settings["pDistortEnable"] = false

    self.settings["pDistortBarrelPower"] = 0.00
    self.settings["pDistortRotation"] = 0.00
    self.settings["pDistortZoom"] = 0.00
    self.settings["pDistortMaskTiles"] = 1.00
    self.settings["pDistortAmplitude"] = Amaz.Vector2f(0.0, 0.0)
    self.settings["pDistortFrequency"] = Amaz.Vector2f(0.0, 0.0)
    self.settings["pDistortSpeed"] = Amaz.Vector2f(0.0, 0.0)
    self.settings["pDistortOffset"] = Amaz.Vector2f(0.0, 0.0)   

    self.renderer = DistortRenderer.new()
    self.renderer:setSettings(self.settings)
end

function Distort : update(props)
    if not props:has("pDistortEnable") then
        return
    end

    if self.enabled ~= props:get("pDistortEnable") then
        self.enabled = props:get("pDistortEnable")
        -- Allows to be on/off when clicked on the UI from AE 
        self.renderer:onDirty(true)
    end

    self.settings["pDistortEnable"] = self.enabled

    if self.enabled then

        if props:has("pDistortBarrelPower") then
            self.settings["pDistortBarrelPower"] = props:get("pDistortBarrelPower")
        end
        if props:has("pDistortRotation") then
            self.settings["pDistortRotation"] = props:get("pDistortRotation")
        end
        if props:has("pDistortZoom") then
            self.settings["pDistortZoom"] = props:get("pDistortZoom")
        end
        if props:has("pDistortMaskTiles") then
            self.settings["pDistortMaskTiles"] = props:get("pDistortMaskTiles")
        end  
        if props:has("pDistortAmplitude") then
            self.settings["pDistortAmplitude"] = props:get("pDistortAmplitude")
        end
        if props:has("pDistortFrequency") then
            self.settings["pDistortFrequency"] = props:get("pDistortFrequency")
        end
        if props:has("pDistortSpeed") then
            self.settings["pDistortSpeed"] = props:get("pDistortSpeed")
        end
        if props:has("pDistortOffset") then
            self.settings["pDistortOffset"] = props:get("pDistortOffset")
        end       

    end
end

function Distort : render(sys,renderContext)
    if renderContext ~=nil then
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(sys,renderContext)
    end
end