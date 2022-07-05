ColorGradingRenderer = ScriptableObject(PostProcessEffectRenderer)

-- pass ids
local CGPass = 0
local CGPostPass = 1
local lut2DBakerPass = 0
local lut2DBakerHDRPass = 1

-- uniforms
local u_hdr = "u_hdr"
local u_lut2D = "u_lut2D"
local u_lutParams = "u_lut_params"
local u_colorBalance = "u_color_balance"
local u_hueSatCon = "u_hue_sat_con"
local u_brightness = "u_brightness"
local u_postExposure = "u_post_exposure"
local u_colorFilter = "u_color_filter"
local u_channelMixerRed = "u_channel_mixer_red"
local u_channelMixerGreen = "u_channel_mixer_green"
local u_channelMixerBlue = "u_channel_mixer_blue"
local u_lift = "u_lift"
local u_invGamma = "u_inv_gamma"
local u_gain = "u_gain"
local u_curves = "u_curves"

local u_CustomToneCurve = "u_CustomToneCurve"
local u_ToeSegmentA = "u_ToeSegmentA"
local u_ToeSegmentB = "u_ToeSegmentB"
local u_MidSegmentA = "u_MidSegmentA"
local u_MidSegmentB = "u_MidSegmentB"
local u_ShoSegmentA = "u_ShoSegmentA"
local u_ShoSegmentB = "u_ShoSegmentB"


--constants
local k_lut2DSize = 32
local k_curvePrecision = 128

function ColorGradingRenderer : ctor()
    self.lutDirty = 2
    self.internalLutTex = nil
    self.internalLutFlipTex = nil
    self.gradingCurves = nil
    self.saveCommamnds = Amaz.CommandBuffer()
    self.m_HableCurve = HableCurve.new()
end 

function ColorGradingRenderer : render(scene, renderContext)

    local settings = self.settings

    self.m_HableCurve:Init(settings["pCGToneStrength"],settings["pCGToneLength"],settings["pCGShoulderStrength"],settings["pCGShoulderLength"],settings["pCGShoulderAngle"],settings["pCGToneGamma"])

    local enable = settings["pCGEnable"]


    local commands = renderContext:getCommandBuffer()
    local saveCommands = self.saveCommamnds
    if enable then
        if self.dirty then
            local hdrEnable = settings["pCGHdr"]
            commands:clearAll()
            if hdrEnable then
                self:renderHDRPipeline2D(scene, renderContext)
            else
                self:renderLDRPipeline2D(scene, renderContext)
            end
            self.lutDirty = 2
            self.dirty = false
        end
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
            -- local src = renderContext:getSource()
            -- local dst = renderContext:getDestination()
            -- local cam = renderContext:getCamera()
            -- local cgMat = renderContext:getResources():getShaders("ColorGrading"):getMaterial()
            -- local width = renderContext:getScreenWidth()
            -- local height = renderContext:getScreenHeight()
            -- if src.image == dst.image then
            --     local pingpong = CreateRenderTexture("", width, height)
            --     commands:blitWithMaterial(src, pingpong, cgMat, CGPass)
            --     commands:blit(pingpong, dst)
            -- else
            --     commands:blitWithMaterial(src, dst, cgMat, CGPass)
            -- end
        end
    end

    scene:commitCommandBuffer(commands)
    -- write lutTex to sticker
    if enable and Amaz.Platform.name() ~= "Android" and Amaz.Platform.name() ~= "iOS" then
        if self.internalLutTex and self.lutDirty == 2 then
            saveCommands:clearAll()
            local flipMat = renderContext:getResources():getShaders("Flip"):getMaterial()
            saveCommands:blitWithMaterial(self.internalLutTex, self.internalLutFlipTex, flipMat, 0)
        end
        scene:commitCommandBuffer(saveCommands)
        if self.internalLutTex and self.lutDirty > 0 then 
            self.lutDirty = self.lutDirty -1 
            self.internalLutFlipTex:saveToFile(scene.assetMgr.rootDir.."lua/PostProcessing/Textures/ppInternalLut2D.png")
        end
    end
end

function ColorGradingRenderer : checkInternalStripLut()

    --Use 8bit texture, accuracy is not enough--> lin 
    if self.internalLutTex == nil then
        self.internalLutTex = CreateRenderTexture("interalLut2DTex", k_lut2DSize * k_lut2DSize, k_lut2DSize, Amaz.PixelFormat.RGBA8Unorm)
    end
    if self.internalLutFlipTex == nil then 
        self.internalLutFlipTex = CreateRenderTexture("interalLut2DFlipTex", k_lut2DSize * k_lut2DSize, k_lut2DSize, Amaz.PixelFormat.RGBA8Unorm)
    end
end

function ColorGradingRenderer : GetCurveTexture(hdr)
    if self.gradingCurves == nil then
        self.gradingCurves = CreateTexture2D("gradingCurves", k_curvePrecision, 2, Amaz.InternalFormat.RGBA8, Amaz.DataType.U8norm)
    end


    local settings = self.settings
    local masterCurve = settings["pCGMasterCurve"]
    local redCurve = settings["pCGRedCurve"]
    local greenCurve = settings["pCGGreenCurve"]
    local blueCurve = settings["pCGBlueCurve"]
    local hueVhueCurve = settings["pCGHueVHue"]
    local hueVSatCurve = settings["pCGHueVSat"]
    local satVSatCurve = settings["pCGSatVSat"]
    local lumVSatCurve = settings["pCGLumVSat"]

    local pixels = Amaz.Vector();

    if not hueVhueCurve or not hueVSatCurve or not satVSatCurve or not lumVSatCurve then
        local i = 1
        while(i <= k_curvePrecision)
        do
            local pixel = Amaz.Vector4f(0.5, 0.5, 0.5 ,0.5)
            pixels:pushBack(pixel)
            i = i+1
        end
        if not hdr then
            local i = 1
            while(i <= k_curvePrecision)
            do
                local w = 1.0 - i/k_curvePrecision
                local x = 1.0 - i/k_curvePrecision
                local y = 1.0 - i/k_curvePrecision
                local z = 1.0 - i/k_curvePrecision
                local pixel = Amaz.Vector4f(x, y, z, w)

                pixels:pushBack(pixel)
                i = i+1
            end
        end
        self.gradingCurves:setPixels(pixels)
        return self.gradingCurves
    end

    local i = 1
    while(i <= k_curvePrecision)
    do
        local x = 1.0 - hueVhueCurve:getValue(i/k_curvePrecision)
        local y = 1.0 - hueVSatCurve:getValue(i/k_curvePrecision)
        local z = 1.0 - satVSatCurve:getValue(i/k_curvePrecision)
        local w = 1.0 - lumVSatCurve:getValue(i/k_curvePrecision)
        -- Amaz.LOGE("ColorGradingRenderer", "Grading i x y z "..i/k_curvePrecision.." "..x.." "..y.." "..z)
        local pixel = Amaz.Vector4f(x, y, z , w)
        pixels:pushBack(pixel)
        i = i+1
    end

    if not hdr then
        local i = 1
        while(i <= k_curvePrecision)
        do
            local w = 1.0 - masterCurve:getValue(i/k_curvePrecision)
            local x = 1.0 - redCurve:getValue(i/k_curvePrecision)
            local y = 1.0 - greenCurve:getValue(i/k_curvePrecision)
            local z = 1.0 - blueCurve:getValue(i/k_curvePrecision)
            local pixel = Amaz.Vector4f(x, y, z, w)
            pixels:pushBack(pixel)
            i = i+1
        end
    end

    
    -- Amaz.LOGE("ColorGradingRenderer", "Grading Curves set!")
    self.gradingCurves:setPixels(pixels)
    return self.gradingCurves
end

function ColorGradingRenderer : bakeLDRLut2D(scene, renderContext)
    self:checkInternalStripLut()
    local src = renderContext:getSource()
    local dst = renderContext:getDestination()
    local cam = renderContext:getCamera()
    local bakerMat = renderContext:getResources():getShaders("Lut2DBaker"):getMaterial()
    local commands = renderContext:getCommandBuffer()
    local settings = self.settings


    if settings["pCGToneMap_Neutral"] == true then
        bakerMat:disableMacro("TONEMAPPING_ACES")
        bakerMat:enableMacro("TONEMAPPING_NEUTRAL", 0)
        bakerMat:disableMacro("TONEMAPPING_CUSTOM")
    elseif settings["pCGToneMap_ACES"] == true then
        bakerMat:enableMacro("TONEMAPPING_ACES",0)
        bakerMat:disableMacro("TONEMAPPING_NEUTRAL")
        bakerMat:disableMacro("TONEMAPPING_CUSTOM")
    elseif settings["pCGToneMap_Custom"] == true then
        bakerMat:disableMacro("TONEMAPPING_ACES")
        bakerMat:disableMacro("TONEMAPPING_NEUTRAL")
        bakerMat:enableMacro("TONEMAPPING_CUSTOM",0)
    else
    end

    bakerMat:setVec4(u_lutParams, Amaz.Vector4f(k_lut2DSize, 0.5/(k_lut2DSize* k_lut2DSize), 0.5/k_lut2DSize, k_lut2DSize/(k_lut2DSize - 1.0)))
    local colorBalance = ColorUtilities.ComputeColorBalance(settings["pCGTemperature"], settings["pCGTint"])
    bakerMat:setVec3(u_colorBalance, colorBalance)

    local colorFilter = settings["pCGColorFilter"]
    local colorIntensity = (settings["pCGIntensity"])/10.0
    bakerMat:setVec4(u_colorFilter, Amaz.Vector4f(colorFilter.x + colorIntensity, colorFilter.y + colorIntensity, colorFilter.z + colorIntensity, colorFilter.w))


    local brightness = settings["pCGBrightness"]
    bakerMat:setFloat(u_brightness, (brightness+ 100.0)/100.0)

    local hue = settings["pCGHueShift"]/360.0
    local sat = settings["pCGSaturation"] /100.0 + 1.0
    local con = settings["pCGContrast"] /100.0 + 1.0
    bakerMat:setVec3(u_hueSatCon, Amaz.Vector3f(hue, sat, con))

    local channelMixerR = Amaz.Vector3f((settings["pCGRedOutRedIn"])/100.0, settings["pCGRedOutGreenIn"]/100.0, settings["pCGRedOutBlueIn"]/100.0)
    local channelMixerG = Amaz.Vector3f(settings["pCGGreenOutRedIn"]/100.0, settings["pCGGreenOutGreenIn"]/100.0, settings["pCGGreenOutBlueIn"]/100.0)
    local channelMixerB = Amaz.Vector3f(settings["pCGBlueOutRedIn"]/100.0, settings["pCGBlueOutGreenIn"]/100.0, settings["pCGBlueOutBlueIn"]/100.0)
    bakerMat:setVec3(u_channelMixerRed, channelMixerR)
    bakerMat:setVec3(u_channelMixerGreen, channelMixerG)
    bakerMat:setVec3(u_channelMixerBlue, channelMixerB)

    local lift = ColorUtilities.ColorToLift(settings["pCGLift"])
    local gain = ColorUtilities.ColorToGain(settings["pCGGrain"])
    local invgamma = ColorUtilities.ColorToInverseGamma(settings["pCGGamma"])
    bakerMat:setVec3(u_lift, lift)
    bakerMat:setVec3(u_gain, gain)
    bakerMat:setVec3(u_invGamma, invgamma)
    
    local curves = self:GetCurveTexture(false)
    if curves then
        -- Amaz.LOGE("ColorGradingRenderer", "use grading curves")
        bakerMat:setTex(u_curves, curves)
    end

    commands:blitWithMaterial(src, self.internalLutTex, bakerMat, lut2DBakerPass)
    --Write to local
end

function ColorGradingRenderer : bakeHDRLut2D(scene, renderContext)
    self:checkInternalStripLut()
    local src = renderContext:getSource()
    local dst = renderContext:getDestination()
    local cam = renderContext:getCamera()
    local bakerMat = renderContext:getResources():getShaders("Lut2DBaker"):getMaterial()
    local commands = renderContext:getCommandBuffer()
    local settings = self.settings


    if settings["pCGToneMap_Neutral"] == true then
        bakerMat:disableMacro("TONEMAPPING_ACES")
        bakerMat:enableMacro("TONEMAPPING_NEUTRAL", 0)
        bakerMat:disableMacro("TONEMAPPING_CUSTOM")
    elseif settings["pCGToneMap_ACES"] == true then
        bakerMat:enableMacro("TONEMAPPING_ACES",0)
        bakerMat:disableMacro("TONEMAPPING_NEUTRAL")
        bakerMat:disableMacro("TONEMAPPING_CUSTOM")
    elseif settings["pCGToneMap_Custom"] == true then
        bakerMat:disableMacro("TONEMAPPING_ACES")
        bakerMat:disableMacro("TONEMAPPING_NEUTRAL")
        bakerMat:enableMacro("TONEMAPPING_CUSTOM",0)
        bakerMat:setVec4(u_CustomToneCurve,self.m_HableCurve:getCurve())
        bakerMat:setVec4(u_ToeSegmentA,self.m_HableCurve:getToeSegmentA())
        bakerMat:setVec4(u_ToeSegmentB,self.m_HableCurve:getToeSegmentB())
        bakerMat:setVec4(u_MidSegmentA,self.m_HableCurve:getMidSegmentA())
        bakerMat:setVec4(u_MidSegmentB,self.m_HableCurve:getMidSegmentB())
        bakerMat:setVec4(u_ShoSegmentA,self.m_HableCurve:getShoSegmentA())
        bakerMat:setVec4(u_ShoSegmentB,self.m_HableCurve:getShoSegmentB())
    else
    end

    bakerMat:setVec4(u_lutParams, Amaz.Vector4f(k_lut2DSize, 0.5/(k_lut2DSize* k_lut2DSize), 0.5/k_lut2DSize, k_lut2DSize/(k_lut2DSize - 1.0)))
    local colorBalance = ColorUtilities.ComputeColorBalance(settings["pCGTemperature"], settings["pCGTint"])
    bakerMat:setVec3(u_colorBalance, colorBalance)

    local colorFilter = settings["pCGColorFilter"]
    -- local colorIntensity = (settings["pCGIntensity"])/10.0
    --bakerMat:setVec4(u_colorFilter, Amaz.Vector4f(colorFilter.x + colorIntensity, colorFilter.y + colorIntensity, colorFilter.z + colorIntensity, colorFilter.w))
    bakerMat:setVec4(u_colorFilter, Amaz.Vector4f(colorFilter.x , colorFilter.y, colorFilter.z , colorFilter.w))

    local hue = settings["pCGHueShift"]/360.0
    local sat = settings["pCGSaturation"] /100.0 + 1.0
    local con = settings["pCGContrast"] /100.0 + 1.0
    bakerMat:setVec3(u_hueSatCon, Amaz.Vector3f(hue, sat, con))

    local channelMixerR = Amaz.Vector3f((settings["pCGRedOutRedIn"])/100.0, settings["pCGRedOutGreenIn"]/100.0, settings["pCGRedOutBlueIn"]/100.0)
    local channelMixerG = Amaz.Vector3f(settings["pCGGreenOutRedIn"]/100.0, settings["pCGGreenOutGreenIn"]/100.0, settings["pCGGreenOutBlueIn"]/100.0)
    local channelMixerB = Amaz.Vector3f(settings["pCGBlueOutRedIn"]/100.0, settings["pCGBlueOutGreenIn"]/100.0, settings["pCGBlueOutBlueIn"]/100.0)
    bakerMat:setVec3(u_channelMixerRed, channelMixerR)
    bakerMat:setVec3(u_channelMixerGreen, channelMixerG)
    bakerMat:setVec3(u_channelMixerBlue, channelMixerB)

    local lift = ColorUtilities.ColorToLift(settings["pCGLift"]*0.2 )
    local gain = ColorUtilities.ColorToGain(settings["pCGGrain"]*0.8)
    local invgamma = ColorUtilities.ColorToInverseGamma(settings["pCGGamma"] *0.8)
    bakerMat:setVec3(u_lift, lift)
    bakerMat:setVec3(u_gain, gain)
    bakerMat:setVec3(u_invGamma, invgamma)

    local curves = self:GetCurveTexture(true)
    if curves then
        bakerMat:setTex(u_curves, curves)
    end
    commands:blitWithMaterial(src, self.internalLutTex, bakerMat, lut2DBakerHDRPass)






    
    --commands:blit(self.internalLutTex, dst)

end

function ColorGradingRenderer : renderLDRPipeline2D(scene, renderContext)
    if Amaz.Platform.name() ~= "Android" and Amaz.Platform.name() ~= "iOS" then
        self:bakeLDRLut2D(scene, renderContext)
    end
    local src = renderContext:getSource()
    local dst = renderContext:getDestination()
    local cam = renderContext:getCamera()
    local cgMat = renderContext:getResources():getShaders("ColorGrading"):getMaterial()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()
    local commands = renderContext:getCommandBuffer()
    local lutTex = renderContext:getResources():getTextureByName("customLut2D")
    if lutTex == nil then
        if Amaz.Platform.name() ~= "Android" and Amaz.Platform.name() ~= "iOS" then
            lutTex = self.internalLutTex
        else
            lutTex = renderContext:getResources():getTextureByName("internalLut2D")
        end
        -- Amaz.LOGD("ColorGrading", "no user custom lut, use baked!")
    end
    
    if lutTex == nil then
        -- Amaz.LOGE("ColorGrading", "Error no internal lut Tex was bakend")
        return
    end
    cgMat:setFloat(u_hdr, 0.0)
    cgMat:setTex(u_lut2D, lutTex)
    cgMat:setVec3(u_lutParams, Amaz.Vector3f(1.0/(k_lut2DSize * k_lut2DSize), 1.0/k_lut2DSize, k_lut2DSize - 1.0))

    if src.image == dst.image then
        local pingpong = CreateRenderTexture("", width, height)
        commands:blitWithMaterial(src, pingpong, cgMat, CGPostPass)
        commands:blit(pingpong, dst)
    else
        commands:blitWithMaterial(src, dst, cgMat, CGPostPass)
    end
    renderContext:setSource(dst)
end

function ColorGradingRenderer : renderHDRPipeline2D(scene, renderContext)
    if Amaz.Platform.name() ~= "Android" and Amaz.Platform.name() ~= "iOS" then
        self:bakeHDRLut2D(scene, renderContext)
    end
    local settings = self.settings
    local src = renderContext:getSource()
    local dst = renderContext:getDestination()
    local cam = renderContext:getCamera()
    local cgMat = renderContext:getResources():getShaders("ColorGrading"):getMaterial()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()
    local commands = renderContext:getCommandBuffer()
    local lutTex = renderContext:getResources():getTextureByName("customLut2D")
    if lutTex == nil then
        if Amaz.Platform.name() ~= "Android" and Amaz.Platform.name() ~= "iOS" then
            lutTex = self.internalLutTex
        else
            lutTex = renderContext:getResources():getTextureByName("internalLut2D")
        end
        -- Amaz.LOGD("ColorGrading", "no user custom lut, use baked!")
    end
    
    if lutTex == nil then
        -- Amaz.LOGE("ColorGrading", "Error no internal lut Tex was bakend")
        return
    end
    cgMat:setFloat(u_hdr, 1.0)
    cgMat:setTex(u_lut2D, lutTex)
    cgMat:setVec3(u_lutParams, Amaz.Vector3f(1.0/(k_lut2DSize * k_lut2DSize), 1.0/k_lut2DSize, k_lut2DSize - 1.0))
    cgMat:setFloat(u_postExposure, Exp2(settings["pCGPostExposure"]))

    if src.image == dst.image then
        local pingpong = CreateRenderTexture("", width, height)
        commands:blitWithMaterial(src, pingpong, cgMat, CGPostPass)
        commands:blit(pingpong, dst)
    else
        commands:blitWithMaterial(src, dst, cgMat, CGPostPass)
    end
    renderContext:setSource(dst)
end
