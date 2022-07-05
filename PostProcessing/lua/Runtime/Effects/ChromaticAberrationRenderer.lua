ChromaticAberrationRenderer = ScriptableObject(PostProcessEffectRenderer)

function ChromaticAberrationRenderer : ctor()
    self.chromaticAberrationSpectralLut = nil; -- CreateLUT(3, 1);
    self.pingPongRT = nil;
    self.fastModeAndIntensityAndRTSize = Amaz.Vector4f(0.0, 0.0, 1.0, 1.0);
end

function ChromaticAberrationRenderer : render(scene, renderContext)
    local enable = self.settings["enabled"];
    local commands = renderContext:getCommandBuffer();

    local width = renderContext:getScreenWidth();
    local height = renderContext:getScreenHeight();

    -- local scene = renderContext:getCamera().entity.scene;


    local src = renderContext:getSource();
    local dst = renderContext:getDestination();

    if self.pingPongRT == nil then
        self.pingPongRT = CreateRenderTexture("", width, height);
    end

    if self.settings["fastMode"] ~= nil then
        self.fastModeAndIntensityAndRTSize.x = self.settings["fastMode"] and 1.0 or 0.0;
    end

    if self.settings["intensity"] ~= nil then
        self.fastModeAndIntensityAndRTSize.y = self.settings["intensity"] * 0.05;
    end

    self.fastModeAndIntensityAndRTSize.z = width;
    self.fastModeAndIntensityAndRTSize.w = height;

    if enable then
        local material = renderContext:getResources():getShaders("ChromaticAberration"):getMaterial();

        material:setVec4("u_FastModeAndIntensityAndRTSize", self.fastModeAndIntensityAndRTSize);
    
        if self.dirty then
            commands:clearAll();


            if self.settings["spectralLut"] == nil then
                if self.chromaticAberrationSpectralLut == nil then
                    self.chromaticAberrationSpectralLut = CreateLUT(3, 1);
                    commands:blitWithMaterial(src, self.chromaticAberrationSpectralLut, material, 0);
                end
                material:setTex("u_SpectralLUT", self.chromaticAberrationSpectralLut);
            else
                material:setTex("u_SpectralLUT", self.settings["spectralLut"]);
            end
            commands:blitWithMaterial(src, self.pingPongRT, material, 1);

            -- commands:blit(scene:getOutputRenderTexture(), src);
            -- material:setTex("_Background", src);

            -- commands:blitWithMaterial(self.pingPongRT, scene:getOutputRenderTexture(), material, 2);
            
            
            -------------
            
            commands:blit(self.pingPongRT, dst);

            self.dirty = false;
        end
    else
        if self.dirty then
            commands:clearAll();

        --     commands:blit(scene:getOutputRenderTexture(), self.pingPongRT);
        --     material:setTex("_Background", self.pingPongRT);
        --     commands:blitWithMaterial(src, scene:getOutputRenderTexture(), material, 2);

            self.dirty = false;
        end
    end

    scene:commitCommandBuffer(commands)
end