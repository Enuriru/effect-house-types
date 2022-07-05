BloomRenderer = ScriptableObject(PostProcessEffectRenderer)

-- uniform names
local u_outputRT = "u_outputRT"
local u_weight = "u_weight"
local u_textureSize = "u_texture_size"
local u_direction = "u_direction"
-- local u_hdrEnable = "u_hdr"

local u_BloomRT = "u_bloom_rt"
local u_BloomColor = "u_bloom_color"
local u_BloomDiffuse = "u_bloom_diffuse"
local u_BloomIntensity = "u_intensity"
local u_StarIntensity = "u_starIntensity"
local u_ExtractBrightThresholdHDR = "u_threshold"
local u_ExtractBrightClampHDR = "u_clamp"
local u_SampleScale = "u_sample_scale"
local u_UserProps = "u_userprop"

-- pass ids
local ExtractBright = 0
local ExtractBrightFastMode = 1
local DownSample = 2
local DownSampleFastMode = 3
local UpSample = 4
local UpSampleFastMode = 5
local UpSampleFinal = 6
local UpSampleFinalFastMode = 7
local StarPass = 8
local StarPassFastMode = 9
local UpSampleFinalStar = 10
local UpSampleFinalStarFastMode = 11


function BloomRenderer : ctor()
    self.userProps = Amaz.Vector2f(0.0, 0.0)
end

 
 

function BloomRenderer : render(scene, renderContext)
    
    local settings = self.settings
    local enable = settings["pBloomEnable"]
    local commands = renderContext:getCommandBuffer()
    if enable then
        local width = renderContext:getScreenWidth()
        local height = renderContext:getScreenHeight()
        local src = renderContext:getSource()
        local dst = renderContext:getDestination()
        
        local bloomMat = renderContext:getResources():getShaders("Bloom"):getMaterial()
        local maskCamEnt = scene:findEntityBy("MaskCamera")
        
        if maskCamEnt ~= nil then 
            local maskRT = maskCamEnt:getComponent("Camera").renderTexture
        
            if settings["pBloomUseMask"] then
                print("can test Bloom use Mask...")
                -- bloomMat:setTex("_BloomMask", maskRT)
                self.userProps.x = 1.0
            else
                self.userProps.x = 0.0
            end
        end

        -- bloomMat:setVec2(u_UserProps, self.userProps)

        local quality = 1
        if not settings["pBloomFastMode"] then
            quality = 0
        end

        local lthresh = GammaToLinearSpace(settings["pBloomThreshold"])
        local knee = lthresh * settings["pBloomSoftknee"] + 0.00001
        local threshold = Amaz.Vector4f(lthresh, lthresh - knee, knee * 2.0, 0.25 / knee)

        local lclamp = GammaToLinearSpace(settings["pBloomClamp"])

        local bloomColor = GammaToLinearSpaceColor(settings["pBloomColor"])

        local intensity = settings["pBloomIntensity"]
        intensity = math.pow(2.4, intensity * 0.1) - 1.0

        -- Negative anamorphic ratio values distort vertically - positive is horizontal
        local ratio = settings["pBloomAnamorphicRatio"]
        local rw = 0
        local rh = 0
        if ratio < 0 then
            rw = -ratio
        end
        if ratio > 0 then
            rh = ratio
        end

        local tw = math.floor(width / (2.0 - rw))
        local th = math.floor(height / (2.0 - rh))
        local s = math.max(tw, th)
        local logs = math.log(s) / math.log(2) + math.min(10.0, settings["pBloomDiffuse"]) - 10.0
        local logs_i = math.floor(logs)
        local iterations = math.min(logs_i, 16)
        iterations = math.max(iterations, 1)
        local sampleScale = 0.5 + logs - logs_i
        local hdrEnable = settings["pBloomHdr"]
        local colorFormat = Amaz.PixelFormat.RGBA8Unorm

        -- set uniforms
        bloomMat:setFloat(u_SampleScale, sampleScale)
        bloomMat:setVec4(u_ExtractBrightThresholdHDR, threshold)
        bloomMat:setVec4(u_ExtractBrightClampHDR, Amaz.Vector4f(lclamp, 0.0, 0.0, 0.0))
        bloomMat:setVec4(u_BloomColor, Amaz.Vector4f(bloomColor.x, bloomColor.y, bloomColor.z, bloomColor.w))
        bloomMat:setVec2(u_textureSize, Amaz.Vector2f(width, height))
        bloomMat:setVec2(u_direction, Amaz.Vector2f(0.0, 0.0))
        bloomMat:setFloat(u_BloomIntensity, intensity)
        local star_intensity = settings["pBloomStarIntensity"]
        bloomMat:setFloat(u_StarIntensity, star_intensity)

        if hdrEnable and (src.realColorFormat == Amaz.PixelFormat.RGBA16Sfloat or src.realColorFormat == Amaz.PixelFormat.RGBA32Sfloat) then
            -- bloomMat:setFloat(u_hdrEnable, 1.0)
            colorFormat = src.colorFormat
        else
            -- bloomMat:setFloat(u_hdrEnable, 0.0)
        end

        -- update commands if necessary
        if self.dirty then
            commands:clearAll()
            
            local w = tw;
            local h = th;

            -- render scrTex to BrightRT
            local extractLightRT = CreateRenderTexture("extractLightRT", w, h, colorFormat)
            commands:blitWithMaterial(src, extractLightRT, bloomMat, ExtractBright + quality)



          
    
            -- downsample
            local samplerRT = extractLightRT
            local downSampleRTs = Amaz.Vector()
            downSampleRTs:pushBack(samplerRT)
            for i = 1, iterations - 1 do 
                local sheet = Amaz.MaterialPropertyBlock()
                local vec2s = Amaz.Vec2Vector()
                vec2s:pushBack(Amaz.Vector2f(w, h))
                sheet:setVec2Vector(u_textureSize, vec2s)
                w = math.floor(math.max(1, w * 0.5))
                h = math.floor(math.max(1, h * 0.5))
                local downSamplerRT = CreateRenderTexture("", w, h, colorFormat)
                commands:blitWithMaterialAndProperties(samplerRT, downSamplerRT, bloomMat, DownSample + quality, sheet)
                samplerRT = downSamplerRT
                downSampleRTs:pushBack(downSamplerRT)
            end



            -- star lens glare begin
            local star_enable = settings["pBloomStarEnable"]
            local star_horizontalRT2
            local star_verticalRT2
            if star_enable then
                local star_lod = settings["pBloomStarLod"]
                local star_samplerRT = downSampleRTs:get(math.min(iterations - 1, star_lod))
                
                local star_ratio = settings["pBloomStarRatio"]
                local star_secondPassDirectionRatio = 1.0
                
                local star_w = star_samplerRT.width
                local star_h = star_samplerRT.height
                local direction = Amaz.Vector2f(star_ratio , star_ratio * star_samplerRT.width / star_samplerRT.height)
                --horizontal direction
                local star_sheet_horizontal = Amaz.MaterialPropertyBlock()
                local vec2s_direction_horizontal = Amaz.Vec2Vector()
                vec2s_direction_horizontal:pushBack(Amaz.Vector2f(direction.x, 0.0))
                star_sheet_horizontal:setVec2Vector(u_direction, vec2s_direction_horizontal)


                local floats_startIntensity_horizontal = Amaz.FloatVector()
                floats_startIntensity_horizontal:pushBack(star_intensity)
                star_sheet_horizontal:setFloatVector(u_StarIntensity, floats_startIntensity_horizontal)

                local star_horizontalRT = CreateRenderTexture("", star_w, star_h, colorFormat)
                commands:blitWithMaterialAndProperties(star_samplerRT, star_horizontalRT, bloomMat, StarPass + quality, star_sheet_horizontal)

                local star_sheet_horizontal2 = Amaz.MaterialPropertyBlock()
                local vec2s_direction_horizontal2 = Amaz.Vec2Vector()
                vec2s_direction_horizontal2:pushBack(Amaz.Vector2f(direction.x * star_secondPassDirectionRatio, 0.0))
                star_sheet_horizontal2:setVec2Vector(u_direction, vec2s_direction_horizontal2)

                local floats_startIntensity_horizontal2 = Amaz.FloatVector()
                floats_startIntensity_horizontal2:pushBack(star_intensity)
                star_sheet_horizontal:setFloatVector(u_StarIntensity, floats_startIntensity_horizontal2)

                star_horizontalRT2 = CreateRenderTexture("", star_w, star_h, colorFormat)
                commands:blitWithMaterialAndProperties(star_horizontalRT, star_horizontalRT2, bloomMat, StarPass + quality, star_sheet_horizontal)
     
               
                --vertical direction
                local star_sheet_vertical = Amaz.MaterialPropertyBlock()
                local vec2s_direction_vertical = Amaz.Vec2Vector()
                vec2s_direction_vertical:pushBack(Amaz.Vector2f(0.0, direction.y))
                star_sheet_vertical:setVec2Vector(u_direction, vec2s_direction_vertical)


                local floats_startIntensity_vertical = Amaz.FloatVector()
                floats_startIntensity_vertical:pushBack(star_intensity)
                star_sheet_vertical:setFloatVector(u_StarIntensity, floats_startIntensity_vertical)

                local star_verticalRT = CreateRenderTexture("", star_w, star_h, colorFormat)
                commands:blitWithMaterialAndProperties(star_samplerRT, star_verticalRT, bloomMat, StarPass + quality, star_sheet_vertical)

                local star_sheet_vertical2 = Amaz.MaterialPropertyBlock()
                local vec2s_direction_vertical2 = Amaz.Vec2Vector()
                vec2s_direction_vertical2:pushBack(Amaz.Vector2f(0.0, direction.y * star_secondPassDirectionRatio))
                star_sheet_vertical2:setVec2Vector(u_direction, vec2s_direction_vertical2)

                local floats_startIntensity_vertical2 = Amaz.FloatVector()
                floats_startIntensity_vertical2:pushBack(star_intensity )
                star_sheet_vertical:setFloatVector(u_StarIntensity, floats_startIntensity_vertical2)

                star_verticalRT2 = CreateRenderTexture("", star_w, star_h, colorFormat)
                commands:blitWithMaterialAndProperties(star_verticalRT, star_verticalRT2, bloomMat, StarPass + quality, star_sheet_vertical)
            end
           

            -- star lens glare end



            -- upsample
            samplerRT = downSampleRTs:get(iterations - 1)
            for i = iterations - 2, 0, -1 do
                local sheet = Amaz.MaterialPropertyBlock()
                local vec2s = Amaz.Vec2Vector()
                vec2s:pushBack(Amaz.Vector2f(samplerRT.width, samplerRT.height))
                sheet:setVec2Vector(u_textureSize, vec2s)
                local downSampleRT = downSampleRTs:get(i)
                sheet:setTexture("_BloomTex", downSampleRT)
                local upSamplerRT = CreateRenderTexture("", downSampleRT.width, downSampleRT.height, colorFormat)
                commands:blitWithMaterialAndProperties(samplerRT, upSamplerRT, bloomMat, UpSample + quality, sheet)
                samplerRT = upSamplerRT
            end

 
            -- upsample final
            local sheet = Amaz.MaterialPropertyBlock()
            local vec2s = Amaz.Vec2Vector()
            vec2s:pushBack(Amaz.Vector2f(samplerRT.width, samplerRT.height))
            sheet:setVec2Vector(u_textureSize, vec2s)

            local upSampleFinalPass = UpSampleFinal
            --combine star
            if star_enable then
                upSampleFinalPass = UpSampleFinalStar
                bloomMat:setTex("_HorizontalTex", star_horizontalRT2)
                bloomMat:setTex("_VerticalTex", star_verticalRT2)
            end
    

            bloomMat:setTex("_PreviewTex", src)
            if src.image == dst.image then
                local pingpong = CreateRenderTexture("", width, height, colorFormat)
                --commands:blitWithMaterial(afterBloomRT, pingpong, bloomMat, BloomPass)

                commands:blitWithMaterialAndProperties(samplerRT, pingpong, bloomMat, upSampleFinalPass + quality, sheet)
                commands:blit(pingpong, dst)
            else
                commands:blitWithMaterial(samplerRT, dst, bloomMat, upSampleFinalPass)
            end
            
            
            --test
            --commands:blit(star_samplerRT, dst)
            
            renderContext:setSource(dst)
            self.dirty = false
        end
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
            -- to do, if src ~= dst, copy src to dst
        end
    end

    local cam = renderContext:getCamera()
    cam.entity.scene:commitCommandBuffer(commands)
end