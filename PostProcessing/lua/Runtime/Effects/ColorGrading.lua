ColorGrading = ScriptableObject(PostProcessSettings)
local ToneMappingFlag = false
function ColorGrading : ctor()
    self.commands = Amaz.CommandBuffer()
    self.renderer = ColorGradingRenderer.new()
    self.settings["pCGEnable"] = false
    self.settings["pCGHdr"] = false

    self.settings["pCGToneMap_None"] = false
    self.settings["pCGToneMap_Neutral"] = false
    self.settings["pCGToneMap_ACES"] = false
    self.settings["pCGToneMap_Custom"] = false

    self.settings["pCGToneStrength"] = 0.0
    self.settings["pCGToneLength"] = 0.5
    self.settings["pCGShoulderStrength"] = 0.0
    self.settings["pCGShoulderLength"] = 0.5
    self.settings["pCGShoulderAngle"] = 0.0
    self.settings["pCGToneGamma"] = 1.0


    self.settings["pCGTemperature"] = 0
    self.settings["pCGTint"] = 0
    self.settings["pCGPostExposure"] = 0
    self.settings["pCGColorFilter"] = Amaz.Vector4f(1, 1, 1, 1)
    self.settings["pCGIntensity"] = 0
    self.settings["pCGHueShift"] = 0
    self.settings["pCGSaturation"] = 0
    self.settings["pCGBrightness"] = 0
    self.settings["pCGContrast"] = 0
    self.settings["pCGRedOutRedIn"] = 100
    self.settings["pCGRedOutGreenIn"] = 0
    self.settings["pCGRedOutBlueIn"] = 0
    self.settings["pCGGreenOutRedIn"] = 0
    self.settings["pCGGreenOutGreenIn"] = 100
    self.settings["pCGGreenOutBlueIn"] = 0
    self.settings["pCGBlueOutRedIn"] = 0
    self.settings["pCGBlueOutGreenIn"] = 0
    self.settings["pCGBlueOutBlueIn"] = 100
    self.settings["pCGLift"] = Amaz.Vector4f(0, 0, 0, 0)
    self.settings["pCGGamma"] = Amaz.Vector4f(0, 0, 0, 0)
    self.settings["pCGGrain"] = Amaz.Vector4f(0, 0, 0, 0)
    self.settings["pCGMasterCurve"] = nil 
    self.settings["pCGRedCurve"] = nil
    self.settings["pCGHueVHue"] = nil
    self.settings["pCGHueVSat"] = nil
    self.settings["pCGSatVSat"] = nil
    self.settings["pCGLumVSat"] = nil
    self.renderer:setSettings(self.settings)
end

function ColorGrading : update(props)
    
    -- update material properties
    if not props:has("pCGEnable") then
        return
    end

    if self.enabled ~= props:get("pCGEnable") then
        self.enabled = props:get("pCGEnable")
        self.renderer:onDirty(true)
    end

    self.settings["pCGEnable"] = self.enabled

    if self.enabled then
        if props:has("pCGHdr") then
            if self.settings["pCGHdr"] ~= props:get("pCGHdr") then
                self.settings["pCGHdr"] = props:get("pCGHdr")
                if self.settings["pCGHdr"] then
                    self.settings["pCGBrightness"] = 0
                else
                    self.settings["pCGPostExposure"] = 0
                end
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGToneMap_None") and props:has("pCGToneMap_Neutral") and props:has("pCGToneMap_ACES") and props:has("pCGToneMap_Custom") then
            if self.settings["pCGToneMap_None"] ~= props:get("pCGToneMap_None") then
                self.settings["pCGToneMap_None"] = props:get("pCGToneMap_None")
                if self.settings["pCGToneMap_None"] then
                    -- props:set("pCGToneMap_None",false)
                    props:set("pCGToneMap_Neutral",false)
                    props:set("pCGToneMap_ACES",false)
                    props:set("pCGToneMap_Custom",false)
                    -- self.settings["pCGToneMap_None"] = false
                    self.settings["pCGToneMap_Neutral"] = false
                    self.settings["pCGToneMap_ACES"] =false
                    self.settings["pCGToneMap_Custom"] =false
                    self.renderer:onDirty(true)
                end
            end
            if self.settings["pCGToneMap_Neutral"] ~= props:get("pCGToneMap_Neutral") then
                self.settings["pCGToneMap_Neutral"] = props:get("pCGToneMap_Neutral")
                if self.settings["pCGToneMap_Neutral"] then
                    props:set("pCGToneMap_None",false)
                    -- props:set("pCGToneMap_Neutral",false)
                    props:set("pCGToneMap_ACES",false)
                    props:set("pCGToneMap_Custom",false)
                    self.settings["pCGToneMap_None"] = false
                    -- self.settings["pCGToneMap_Neutral"] = false
                    self.settings["pCGToneMap_ACES"] =false
                    self.settings["pCGToneMap_Custom"] =false
                    self.renderer:onDirty(true)

                end
            end
            if self.settings["pCGToneMap_ACES"] ~= props:get("pCGToneMap_ACES") then
                self.settings["pCGToneMap_ACES"] = props:get("pCGToneMap_ACES")
                if self.settings["pCGToneMap_ACES"] then
                    props:set("pCGToneMap_None",false)
                    props:set("pCGToneMap_Neutral",false)
                    -- props:set("pCGToneMap_ACES",false)
                    props:set("pCGToneMap_Custom",false)
                    self.settings["pCGToneMap_None"] = false
                    self.settings["pCGToneMap_Neutral"] = false
                    -- self.settings["pCGToneMap_ACES"] =false
                    self.settings["pCGToneMap_Custom"] =false
                    self.renderer:onDirty(true)

                end
            end
            if self.settings["pCGToneMap_Custom"] ~= props:get("pCGToneMap_Custom") then
                self.settings["pCGToneMap_Custom"] = props:get("pCGToneMap_Custom")
                if self.settings["pCGToneMap_Custom"] then
                    props:set("pCGToneMap_None",false)
                    props:set("pCGToneMap_Neutral",false)
                    props:set("pCGToneMap_ACES",false)
                    -- props:set("pCGToneMap_Custom",false)
                    self.settings["pCGToneMap_None"] = false
                    self.settings["pCGToneMap_Neutral"] = false
                    self.settings["pCGToneMap_ACES"] =false
                    -- self.settings["pCGToneMap_Custom"] =false
                    self.renderer:onDirty(true)

                end
            end

            if props:has("pCGToneStrength") then
                if self.settings["pCGToneStrength"] ~= props:get("pCGToneStrength") then
                    self.settings["pCGToneStrength"] = props:get("pCGToneStrength")
                    self.renderer:onDirty(true)
                end
            end


            if props:has("pCGToneLength") then
                if self.settings["pCGToneLength"] ~= props:get("pCGToneLength") then
                    self.settings["pCGToneLength"] = props:get("pCGToneLength")
                    self.renderer:onDirty(true)
                end
            end



            if props:has("pCGShoulderStrength") then
                if self.settings["pCGShoulderStrength"] ~= props:get("pCGShoulderStrength") then
                    self.settings["pCGShoulderStrength"] = props:get("pCGShoulderStrength")
                    self.renderer:onDirty(true)
                end
            end


            if props:has("pCGShoulderLength") then
                if self.settings["pCGShoulderLength"] ~= props:get("pCGShoulderLength") then
                    self.settings["pCGShoulderLength"] = props:get("pCGShoulderLength")
                    self.renderer:onDirty(true)
                end
            end



            if props:has("pCGShoulderAngle") then
                if self.settings["pCGShoulderAngle"] ~= props:get("pCGShoulderAngle") then
                    self.settings["pCGShoulderAngle"] = props:get("pCGShoulderAngle")
                    self.renderer:onDirty(true)
                end
            end



            if props:has("pCGToneGamma") then
                if self.settings["pCGToneGamma"] ~= props:get("pCGToneGamma") then
                    self.settings["pCGToneGamma"] = props:get("pCGToneGamma")
                    self.renderer:onDirty(true)
                end
            end

            if not self.settings["pCGToneMap_None"] and not self.settings["pCGToneMap_Neutral"] and not self.settings["pCGToneMap_ACES"] and not self.settings["pCGToneMap_Custom"] then
                self.settings["pCGToneMap_None"] = true
                props:set("pCGToneMap_None",true)
                self.renderer:onDirty(true)

            end


        end
        
        if props:has("pCGTemperature") then
            if self.settings["pCGTemperature"] ~= props:get("pCGTemperature") then
                self.settings["pCGTemperature"] = props:get("pCGTemperature")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGTint") then
            if self.settings["pCGTint"] ~= props:get("pCGTint") then
                self.settings["pCGTint"] = props:get("pCGTint")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGPostExposure") and self.settings["pCGHdr"] then
            if self.settings["pCGPostExposure"] ~= props:get("pCGPostExposure") then
                self.settings["pCGPostExposure"] = props:get("pCGPostExposure")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGIntensity") then
            if self.settings["pCGIntensity"] ~= props:get("pCGIntensity") then
                self.settings["pCGIntensity"] = props:get("pCGIntensity")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGColorFilter") then
            if self.settings["pCGColorFilter"] ~= props:get("pCGColorFilter") then
                self.settings["pCGColorFilter"] = props:get("pCGColorFilter")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGHueShift") then
            if self.settings["pCGHueShift"] ~= props:get("pCGHueShift") then
                self.settings["pCGHueShift"] = props:get("pCGHueShift")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGSaturation") then
            if self.settings["pCGSaturation"] ~= props:get("pCGSaturation") then
                self.settings["pCGSaturation"] = props:get("pCGSaturation")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGBrightness") and not self.settings["pCGHdr"] then
            if self.settings["pCGBrightness"] ~= props:get("pCGBrightness") then
                self.settings["pCGBrightness"] = props:get("pCGBrightness")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGContrast") then
            if self.settings["pCGContrast"] ~= props:get("pCGContrast") then
                self.settings["pCGContrast"] = props:get("pCGContrast")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGRedOutRedIn") then
            if self.settings["pCGRedOutRedIn"] ~= props:get("pCGRedOutRedIn") then
                self.settings["pCGRedOutRedIn"] = props:get("pCGRedOutRedIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGRedOutGreenIn") then
            if self.settings["pCGRedOutGreenIn"] ~= props:get("pCGRedOutGreenIn") then
                self.settings["pCGRedOutGreenIn"] = props:get("pCGRedOutGreenIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGRedOutBlueIn") then
            if self.settings["pCGRedOutBlueIn"] ~= props:get("pCGRedOutBlueIn") then
                self.settings["pCGRedOutBlueIn"] = props:get("pCGRedOutBlueIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGGreenOutRedIn") then
            if self.settings["pCGGreenOutRedIn"] ~= props:get("pCGGreenOutRedIn") then
                self.settings["pCGGreenOutRedIn"] = props:get("pCGGreenOutRedIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGGreenOutGreenIn") then
            if self.settings["pCGGreenOutGreenIn"] ~= props:get("pCGGreenOutGreenIn") then
                self.settings["pCGGreenOutGreenIn"] = props:get("pCGGreenOutGreenIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGGreenOutBlueIn") then
            if self.settings["pCGGreenOutBlueIn"] ~= props:get("pCGGreenOutBlueIn") then
                self.settings["pCGGreenOutBlueIn"] = props:get("pCGGreenOutBlueIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGBlueOutRedIn") then
            if self.settings["pCGBlueOutRedIn"] ~= props:get("pCGBlueOutRedIn") then
                self.settings["pCGBlueOutRedIn"] = props:get("pCGBlueOutRedIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGBlueOutGreenIn") then
            if self.settings["pCGBlueOutGreenIn"] ~= props:get("pCGBlueOutGreenIn") then
                self.settings["pCGBlueOutGreenIn"] = props:get("pCGBlueOutGreenIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGBlueOutBlueIn") then
            if self.settings["pCGBlueOutBlueIn"] ~= props:get("pCGBlueOutBlueIn") then
                self.settings["pCGBlueOutBlueIn"] = props:get("pCGBlueOutBlueIn")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGLift") then
            if self.settings["pCGLift"] ~= props:get("pCGLift") then
                self.settings["pCGLift"] = props:get("pCGLift")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGGamma") then
            if self.settings["pCGGamma"] ~= props:get("pCGGamma") then
                self.settings["pCGGamma"] = props:get("pCGGamma")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGGrain") then
            if self.settings["pCGGrain"] ~= props:get("pCGGrain") then
                self.settings["pCGGrain"] = props:get("pCGGrain")
                self.renderer:onDirty(true)
            end
        end

        if props:has("pCGMasterCurve") then
            local curve = props:get("pCGMasterCurve")
            if self.settings["pCGMasterCurve"] ~= curve then
                self.settings["pCGMasterCurve"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGRedCurve") then
            local curve = props:get("pCGRedCurve")
            if self.settings["pCGRedCurve"] ~= curve then
                self.settings["pCGRedCurve"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGGreenCurve") then
            local curve = props:get("pCGGreenCurve")
            if self.settings["pCGGreenCurve"] ~= curve then
                self.settings["pCGGreenCurve"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGBlueCurve") then
            local curve = props:get("pCGBlueCurve")
            if self.settings["pCGBlueCurve"] ~= curve then
                self.settings["pCGBlueCurve"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGHueVHue") then
            local curve = props:get("pCGHueVHue")
            if self.settings["pCGHueVHue"] ~= curve then
                self.settings["pCGHueVHue"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGHueVSat") then
            local curve = props:get("pCGHueVSat")
            if self.settings["pCGHueVSat"] ~= curve then
                self.settings["pCGHueVSat"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGSatVSat") then
            local curve = props:get("pCGSatVSat")
            if self.settings["pCGSatVSat"] ~= curve then
                self.settings["pCGSatVSat"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end

        if props:has("pCGLumVSat") then
            local curve = props:get("pCGLumVSat")
            if self.settings["pCGLumVSat"] ~= curve then
                self.settings["pCGLumVSat"] = curve
            end
            if curve.dirty then
                self.renderer:onDirty(true)
                curve.dirty = false
            end
        end
    end
end

function ColorGrading : render(scene, renderContext)
    renderContext:setCommandBuffer(self.commands)
    self.renderer:render(scene, renderContext)
end