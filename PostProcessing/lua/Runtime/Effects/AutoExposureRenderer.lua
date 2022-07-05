AutoExposureRenderer = ScriptableObject(PostProcessEffectRenderer)

function AutoExposureRenderer : ctor()
    self.histogramSSBO = nil
    self.scaleOffsetRes = Amaz.Vector4f()
    self.cleanHistogramComputeEntity = nil
    self.histogramComputeEntity = nil
    self.exposureSSBO = nil
    self.exposureMultiplierComputeEntity = nil
    self.rangeMin = -9
    self.rangeMax = 9
end


local DownSamplePass = 1
local DownSampleNum = 4
local pingpongIndex = 0 

local function Exp2(x)
    return math.exp(x * 0.69314718055994530941723212145818)
end

function AutoExposureRenderer : render(scene, renderContext)
    local enable = self.settings["enabled"];
    local commands = renderContext:getCommandBuffer();

    local width = renderContext:getScreenWidth();
    local height = renderContext:getScreenHeight();

    local src = renderContext:getSource();
    local dst = renderContext:getDestination();

    if enable then
        if self.settings["AdaptationType"] ~= "Simple" then
            if Amaz.Platform.name() == "Android" then
                    if self.histogramSSBO == nil then
                        self.histogramSSBO = Amaz.StorageBuffer() 
                        self.histogramSSBO:resize(renderContext:getResources():getShaders("AutoExposure").HistogramBinLength * 4)  -- bytes
                    end
                    if self.cleanHistogramComputeEntity == nil then
                        self.cleanHistogramComputeEntity = CreateComputeEntity("gles31", renderContext:getResources():getShaders("AutoExposure").CleanHistogramShader) 
                        self.cleanHistogramComputeEntity:setBuffer("gHistogramBins", self.histogramSSBO) 
                    end
                    if self.histogramComputeEntity == nil then
                        self.histogramComputeEntity = CreateComputeEntity("gles31", renderContext:getResources():getShaders("AutoExposure").HistogramShader)       
                        self.histogramComputeEntity:setBuffer("gHistogramBins", self.histogramSSBO) 
                    end
                    if self.exposureSSBO == nil then
                        self.exposureSSBO = Amaz.StorageBuffer() 
                        self.exposureSSBO:resize(3 * 4) 
                    end
                    if self.exposureMultiplierComputeEntity == nil then
                        self.exposureMultiplierComputeEntity = CreateComputeEntity("gles31", renderContext:getResources():getShaders("AutoExposure").ExposureMultiplierShader) 
                        self.exposureMultiplierComputeEntity:setBuffer("gHistogramBins", self.histogramSSBO) 
                        self.exposureMultiplierComputeEntity:setBuffer("gPingPongResult", self.exposureSSBO) 
                    end
                    if self.material == nil then
                        self.material = renderContext:getResources():getShaders("AutoExposure"):getMaterial();
                    end
                    self.material:setBuffer("gPingPongResult", self.exposureSSBO) 
                    self.scaleOffsetRes = renderContext:getResources():getShaders("AutoExposure"):getLuminanceScaleOffsetRes(self.rangeMin,  self.rangeMax, width, height) 
                    self.histogramComputeEntity:setVector4("_ScaleOffsetRes", self.scaleOffsetRes)   
                    self.histogramComputeEntity:setTexture("_MainTex", src) 
                    self.exposureMultiplierComputeEntity:setVector4("uScaleOffsetRes", self.scaleOffsetRes) 
                    self.exposureMultiplierComputeEntity:setVector4("uParams1",Amaz.Vector4f( self.settings["filteringMin"] * 0.01, self.settings["filteringMax"] * 0.01, Exp2(self.settings["minimum"]), Exp2(self.settings["maximum"])))  -- lower-percent, high-percent, minl, maxl
                    if self.settings["AdaptationType"] == "Progressive" then
                        self.exposureMultiplierComputeEntity:setFloat("uProgressive", 1.0) 
                    else
                        self.exposureMultiplierComputeEntity:setFloat("uProgressive", 0.0) 
                    end
                    self.exposureMultiplierComputeEntity:setVector4("uParams2", Amaz.Vector4f(self.settings["SpeedDown"], self.settings["SpeedUp"],  self.settings["ExposureCompensation"], renderContext:getDeltaTime()))  -- speeddown, speedup, key, deltaTime 

                    if self.dirty then
                        --TODO deltatime
                        commands:clearAll() 
                        commands:dispatchCompute(self.cleanHistogramComputeEntity, renderContext:getResources():getShaders("AutoExposure").HistogramBinLength / renderContext:getResources():getShaders("AutoExposure").CleanHistogramShader_DimX, 1, 1) 
                        commands:dispatchCompute(self.histogramComputeEntity, width / 2 / renderContext:getResources():getShaders("AutoExposure").HistogramShader_DimX, height / 2 / renderContext:getResources():getShaders("AutoExposure").HistogramShader_DimY, 1) 
                        commands:dispatchCompute(self.exposureMultiplierComputeEntity, 1, 1, 1) 
                        if src.image == dst.image then
                            local pingpong = CreateRenderTexture("", width, height)
                            commands:blitWithMaterial(src, pingpong, self.material, 0)
                            commands:blit(pingpong, dst)
                        else
                            commands:blitWithMaterial(src, dst, self.material, 0)
                        end
                        self.dirty = false 
                    end

            else
                if self.histogramSSBO == nil then
                    self.histogramSSBO = Amaz.StorageBuffer() 
                    self.histogramSSBO:resize(renderContext:getResources():getShaders("AutoExposure").HistogramBinLength * 4)  -- bytes
                end
                if self.cleanHistogramComputeEntity == nil then
                    self.cleanHistogramComputeEntity = CreateComputeEntity("metal", renderContext:getResources():getShaders("AutoExposure").CleanHistogramShader_metal) 
                    self.cleanHistogramComputeEntity:setBuffer("gHistogramBins", self.histogramSSBO) 
                end
                if self.histogramComputeEntity == nil then
                    self.histogramComputeEntity = CreateComputeEntity("metal", renderContext:getResources():getShaders("AutoExposure").HistogramShader_metal)       
                    self.histogramComputeEntity:setBuffer("gHistogramBins", self.histogramSSBO) 
                end
                if self.exposureSSBO == nil then
                    self.exposureSSBO = Amaz.StorageBuffer() 
                    self.exposureSSBO:resize(3 * 4)  
                end
                if self.exposureMultiplierComputeEntity == nil then
                    self.exposureMultiplierComputeEntity = CreateComputeEntity("metal", renderContext:getResources():getShaders("AutoExposure").ExposureMultiplierShader_metal) 
                    self.exposureMultiplierComputeEntity:setBuffer("gHistogramBins", self.histogramSSBO) 
                    self.exposureMultiplierComputeEntity:setBuffer("gPingPongResult", self.exposureSSBO) 
                end
                if self.material == nil then
                    self.material = renderContext:getResources():getShaders("AutoExposure"):getMaterial();
                    self.material:setBuffer("gPingPongResult", self.exposureSSBO) 
                end

                self.scaleOffsetRes = renderContext:getResources():getShaders("AutoExposure"):getLuminanceScaleOffsetRes(self.rangeMin,  self.rangeMax, width, height) 
                self.histogramComputeEntity:setTexture("_MainTex", src) 
                self.histogramComputeEntity:setVector4("_ScaleOffsetRes", self.scaleOffsetRes)   
                local progressive = 0.0
                if self.settings["AdaptationType"] == "Progressive" then
                    progressive = 1.0
                else
                    progressive =0.0
                end
                local useParamBuffer = Amaz.UniformBuffer()
                local useParamData = Amaz.StructData()
                :addVector4f("uParams1",Amaz.Vector4f( self.settings["filteringMin"] * 0.01, self.settings["filteringMax"] * 0.01, Exp2(self.settings["minimum"]), Exp2(self.settings["maximum"])))
                :addVector4f("uParams2",Amaz.Vector4f(self.settings["SpeedDown"], self.settings["SpeedUp"],  self.settings["ExposureCompensation"], renderContext:getDeltaTime()))
                :addFloat("uProgressive", progressive)
                :addVector4f("uScaleOffsetRes", self.scaleOffsetRes)
                useParamBuffer:load(useParamData)
                self.exposureMultiplierComputeEntity:setBuffer("parameters", useParamBuffer)
                if self.dirty then
                    commands:clearAll() 
                    commands:dispatchCompute(self.cleanHistogramComputeEntity, renderContext:getResources():getShaders("AutoExposure").HistogramBinLength / renderContext:getResources():getShaders("AutoExposure").CleanHistogramShader_DimX, 1, 1) 
                    commands:dispatchCompute(self.histogramComputeEntity, width / 2 / renderContext:getResources():getShaders("AutoExposure").HistogramShader_DimX, height / 2 / renderContext:getResources():getShaders("AutoExposure").HistogramShader_DimY, 1) 
                    commands:dispatchCompute(self.exposureMultiplierComputeEntity, 1, 1, 1) 
                    if src.image == dst.image then
                        local pingpong = CreateRenderTexture("", width, height)
                        local sheet0 = Amaz.MaterialPropertyBlock()
                        sheet0:setTexture("_MainTex", src)
                        commands:blitWithMaterialAndProperties(src, pingpong, self.material, 0, sheet0)
                        commands:blit(pingpong, dst)
                    else
                        local sheet0 = Amaz.MaterialPropertyBlock()
                        sheet0:setTexture("_MainTex", src)
                        commands:blitWithMaterialAndProperties(src, dst, self.material, 0, sheet0)
                    end
                    self.dirty = false 
                end
            end
        else
            if self.material == nil then
                self.material = renderContext:getResources():getShaders("AutoExposure"):getMaterial();
            end
            if self.preExposureRT == nil then
                self.preExposureRT  = CreateRenderTexture("preExposureRT", 1, 1)
            end
            if self.curExposureRT == nil then
                self.curExposureRT  = CreateRenderTexture("curExposureRT", 1, 1)
            end
                commands:clearAll() 
                local RTWidth = width / 4
                local RTHeight = height /4
                local curRT = src 
                while(RTWidth> 1.0 and RTHeight >1.0 ) do
                    local donwRT = CreateRenderTexture("", RTWidth, RTHeight)
                    self.material:setVec2("texSize",Amaz.Vector2f(1.0/(RTWidth*4.0),1.0/(RTWidth*4.0)))
                    commands:blitWithMaterial(curRT, donwRT, self.material, DownSamplePass)
                    curRT = donwRT
                    RTWidth = RTWidth /4
                    RTHeight = RTHeight /4
                end
                local sheet = Amaz.MaterialPropertyBlock()
                sheet:setTexture("_MainTex", curRT)
                if pingpongIndex == 0 then
                    sheet:setTexture("_PreTex", self.preExposureRT)
                else
                    sheet:setTexture("_PreTex", self.curExposureRT)
                end
                sheet:setVec4("uParams1",Amaz.Vector4f( self.settings["filteringMin"] * 0.01, self.settings["filteringMax"] * 0.01, Exp2(self.settings["minimum"]), Exp2(self.settings["maximum"])))
                sheet:setVec4("uParams2",Amaz.Vector4f(self.settings["SpeedDown"], self.settings["SpeedUp"],  self.settings["ExposureCompensation"], renderContext:getDeltaTime()))
                if pingpongIndex == 0 then
                    commands:blitWithMaterialAndProperties(curRT, self.curExposureRT, self.material, 2, sheet)
                else
                    commands:blitWithMaterialAndProperties(curRT, self.preExposureRT, self.material, 2, sheet)
                end

                local sheet1 = Amaz.MaterialPropertyBlock()
                sheet1:setTexture("_MainTex", src)
                if pingpongIndex == 0 then
                    sheet1:setTexture("_ExposureTex", self.curExposureRT)
                    pingpongIndex = 1
                else
                    sheet1:setTexture("_ExposureTex", self.preExposureRT)
                    pingpongIndex = 0
                end
                sheet1:setVec4("uParams1",Amaz.Vector4f( self.settings["filteringMin"] * 0.01, self.settings["filteringMax"] * 0.01, Exp2(self.settings["minimum"]), Exp2(self.settings["maximum"])))
                sheet1:setVec4("uParams2",Amaz.Vector4f(self.settings["SpeedDown"], self.settings["SpeedUp"],  self.settings["ExposureCompensation"], renderContext:getDeltaTime()))
                commands:blitWithMaterialAndProperties(src, dst, self.material, 3, sheet1)
        end
    else
        if self.dirty then
            commands:clearAll() 
            self.dirty = false 
        end
    end
    
    scene:commitCommandBuffer(commands)
end