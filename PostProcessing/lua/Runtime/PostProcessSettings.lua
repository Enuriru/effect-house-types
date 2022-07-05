PostProcessSettings = ScriptableObject()

function PostProcessSettings : ctor()
    self.dirty = false
    self.enabled = false
    self.settings = {}
end

function PostProcessSettings : update(props)
end