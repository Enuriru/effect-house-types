PostProcessEffectRenderer = ScriptableObject()

function PostProcessEffectRenderer : ctor()
    self.settings = nil
    self.dirty = true
end

function PostProcessEffectRenderer : setSettings(settings)
    self.settings = settings
end

function PostProcessEffectRenderer : onDirty(dirty)
    self.dirty = dirty
end

function PostProcessEffectRenderer : render(scene, context)

end
