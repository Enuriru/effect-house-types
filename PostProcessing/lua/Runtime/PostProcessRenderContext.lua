PostProcessRenderContext = ScriptableObject()

function PostProcessRenderContext : ctor()
    self.camera = nil
    self.source = nil
    self.destination = nil
    self.commands = nil
    self.width = 720
    self.height = 1280
    self.resources = PostProcessResources.new()
    self.deltaTime = 0
end

function PostProcessRenderContext:getResources()
    return self.resources
end

function PostProcessRenderContext:setCamera(camera)
    self.camera = camera
end

function PostProcessRenderContext:getCamera()
    return self.camera
end

function PostProcessRenderContext:setSource(renderTexture)
    self.source = renderTexture
end

function PostProcessRenderContext:getSource()
    return self.source
end

function PostProcessRenderContext:setDestination(renderTexture)
    self.destination = renderTexture
end

function PostProcessRenderContext:getDestination()
    return self.destination
end

function PostProcessRenderContext:setScreenWidth(width)
    self.width = width
end

function PostProcessRenderContext:getScreenWidth()
    return self.width
end

function PostProcessRenderContext:setScreenHeight(height)
    self.height = height
end

function PostProcessRenderContext:getScreenHeight(height)
    return self.height
end

function PostProcessRenderContext:setCommandBuffer(commands)
    self.commands = commands
end

function PostProcessRenderContext:getCommandBuffer()
    return self.commands
end

function PostProcessRenderContext:setDeltaTime(time)
    self.deltaTime = time
end

function PostProcessRenderContext:getDeltaTime(height)
    return self.deltaTime
end

-- return the height of the Camera viewport is in pixels
function PostProcessRenderContext:getHeight()
    if self.camera ~= nil then
    return self.camera.viewport.height * self.camera.renderTexture.height
    end
end

function PostProcessRenderContext:getWidth()
    if self.camera ~= nil then
    return self.camera.viewport.width * self.camera.renderTexture.width
    end
end