BokehBlurRenderer = ScriptableObject(PostProcessEffectRenderer)


function BokehBlurRenderer : ctor()
    self.cosGol = math.cos(2.399)
    self.sinGol = math.sin(2.399)
end

function BokehBlurRenderer : render(sys,renderContext)

    local enable = self.settings["pBokehBlurEnable"]
    local settings = self.settings
    local blurSize = settings["pBokehBlurSize"]
    local blurIteration = settings["pBokehBlurIteration"]
    local bokehShape = settings["pBokehShape"]
    local fastCircle =  settings["pFastCircle"]
    local downSample =  settings["pDownSample"]
    local commands = renderContext:getCommandBuffer()
    local width = renderContext:getScreenWidth()
    local height = renderContext:getScreenHeight()
    local cam = renderContext:getCamera()

    if enable then  
        if self.dirty then
            commands:clearAll()
            local BokehBlurMat = renderContext:getResources():getShaders("BokehBlur"):getMaterial()
            local src = renderContext:getSource()
            local dst = renderContext:getDestination()
            local downWidth = width/downSample
            local downHeight = height/downSample
            BokehBlurMat:setVec4("_Params", Amaz.Vector4f(blurIteration,blurSize,math.cos(0.5),math.sin(0.5)))

            if bokehShape ~="Circle" then
                local downRT = CreateRenderTexture("", downWidth, downHeight)
                local downRT2 = CreateRenderTexture("", downWidth, downHeight)
                local downRT1 = CreateRenderTexture("", downWidth, downHeight)
                BokehBlurMat:setVec4("_MainTex_TexelSize", Amaz.Vector4f(1.0/downRT.width,1.0/downRT.height, downRT.width,downRT.height))
                commands:blit(src, downRT)
                commands:blitWithMaterial(downRT, downRT1, BokehBlurMat, 3)
                commands:blitWithMaterial(downRT, downRT2, BokehBlurMat, 4)
                BokehBlurMat:setTex("_DownLeftTex", downRT2)
                commands:blitWithMaterial(downRT1, dst, BokehBlurMat, 5)
            else
                local downRT = CreateRenderTexture("", downWidth, downHeight)
                local downRT1 = CreateRenderTexture("", downWidth, downHeight)
                commands:blit(src, downRT)
                if fastCircle then
                    BokehBlurMat:setVec4("_MainTex_TexelSize", Amaz.Vector4f(1.0/downRT.width,1.0/downRT.height, downRT.width,downRT.height))
                    commands:blitWithMaterial(downRT, downRT1, BokehBlurMat, 1)
                    commands:blitWithMaterial(downRT1, dst, BokehBlurMat, 2)
                else
                    BokehBlurMat:setVec4("_GoldenRot", Amaz.Vector4f(self.cosGol,self.sinGol,-self.sinGol,self.cosGol))
                    BokehBlurMat:setVec4("_Params", Amaz.Vector4f(blurIteration,blurSize,0.5/width,0.5/height))
                    commands:blitWithMaterial(downRT, dst, BokehBlurMat, 0)
                end
            end
            self.dirty = false
        end
    else
        if self.dirty then
            commands:clearAll()
            self.dirty = false
        end
    end
    cam.entity.scene:commitCommandBuffer(commands)
end