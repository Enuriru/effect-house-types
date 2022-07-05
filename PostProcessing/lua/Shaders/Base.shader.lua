BaseShader = ScriptableObject()

function BaseShader : ctor()
    self.material = nil
end

function BaseShader : getMaterial()
    return self.material
end