Bloom = ScriptableObject(PostProcessSettings)

function Bloom : ctor()
    self.commands = Amaz.CommandBuffer()
    self.renderer = BloomRenderer.new()
    
    self.settings["pBloomEnable"] = false
    self.settings["pBloomHdr"] = false
    self.settings["pBloomColor"] = Amaz.Vector4f(1.0, 1.0, 1.0, 1.0)
    self.settings["pBloomDiffuse"] = 10.0
    self.settings["pBloomThreshold"] = 0.00
    self.settings["pBloomIntensity"] = 6.5
    self.settings["pBloomSoftknee"] = 0.0
    self.settings["pBloomClamp"] = 65565
    self.settings["pBloomAnamorphicRatio"] = 0.0
    self.settings["pBloomStarEnable"] = false
    self.settings["pBloomStarLod"] = 0
    self.settings["pBloomStarRatio"] = 20.0
    self.settings["pBloomStarIntensity"] = 0.5
    self.settings["pBloomFastMode"] = true
    self.settings["pBloomUseMask"] = false
    self.renderer:setSettings(self.settings)
end

function Bloom : update(props)
    -- update material properties
    if not props:has("pBloomEnable") then
        return
    end

    if self.enabled ~= props:get("pBloomEnable") then
        self.enabled = props:get("pBloomEnable")
        self.renderer:onDirty(true)
    end

    self.settings["pBloomEnable"] = self.enabled

    if self.enabled then
        --[[if self.src == nil or self.src.image ~= src.image then
            self.src = src
            self.dirty = true
        end

        if self.dst == nil or self.dst.image ~= dst.imag then
            self.dst = dst
            self.dirty = true
        end]]--
        if props:has("pBloomHdr") then
            if self.settings["pBloomHdr"] ~= props:get("pBloomHdr") then
                self.settings["pBloomHdr"] = props:get("pBloomHdr")
                self.renderer:onDirty(true)
                print("can test Bloom Hdr support changed... ")
            end
        end

        if props:has("pBloomUseMask") then
            self.settings["pBloomUseMask"] = props:get("pBloomUseMask")
        end

        if props:has("pBloomColor") then
            self.settings["pBloomColor"] = props:get("pBloomColor")
        end

        if props:has("pBloomIntensity") then
            self.settings["pBloomIntensity"] = props:get("pBloomIntensity")
        end
    
        if props:has("pBloomThreshold") then
            self.settings["pBloomThreshold"] = props:get("pBloomThreshold")
        end
    
        if props:has("pBloomSoftknee") then
            self.settings["pBloomSoftknee"] = props:get("pBloomSoftknee")
        end
    
        if props:has("pBloomClamp") then
            self.settings["pBloomClamp"] = props:get("pBloomClamp")
        end
    
        if props:has("pBloomAnamorphicRatio") then
            local anamorphicRatio = props:get("pBloomAnamorphicRatio")
            if not FloatEqual(anamorphicRatio, self.settings["pBloomAnamorphicRatio"]) then
                self.settings["pBloomAnamorphicRatio"] = anamorphicRatio
                self.renderer:onDirty(true)
            end
        end

        if props:has("pBloomStarEnable") then
            local starEnable = props:get("pBloomStarEnable")
            if starEnable ~= self.settings["pBloomStarEnable"] then
                self.settings["pBloomStarEnable"] = starEnable
                self.renderer:onDirty(true)
            end
        end

        if props:has("pBloomStarLod") then
            local starLod = props:get("pBloomStarLod")
            if not FloatEqual(starLod, self.settings["pBloomStarLod"]) then
                self.settings["pBloomStarLod"] = starLod
                self.renderer:onDirty(true)
            end
        end

        if props:has("pBloomStarRatio") then
            local starRatio = props:get("pBloomStarRatio")
            if not FloatEqual(starRatio, self.settings["pBloomStarRatio"]) then
                self.settings["pBloomStarRatio"] = starRatio
                self.renderer:onDirty(true)
            end
        end

         if props:has("pBloomStarIntensity") then
            local starIntensity = props:get("pBloomStarIntensity")
            if not FloatEqual(starIntensity, self.settings["pBloomStarIntensity"]) then
                self.settings["pBloomStarIntensity"] = starIntensity
                self.renderer:onDirty(true)
            end
        end

        if props:has("pBloomDiffuse") then
            local diffuse = props:get("pBloomDiffuse")
            if not FloatEqual(diffuse, self.settings["pBloomDiffuse"]) then
                self.settings["pBloomDiffuse"] = diffuse
                self.renderer:onDirty(true)
            end
        end
    
        if props:has("pBloomFastMode") then
            local fastMode = props:get("pBloomFastMode")
            if fastMode ~= self.settings["pBloomFastMode"] then
                self.settings["pBloomFastMode"] = fastMode
                self.renderer:onDirty(true)
            end
        end       
    end    
end

function Bloom : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end




