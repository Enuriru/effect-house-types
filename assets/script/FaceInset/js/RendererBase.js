const Amaz = effect.Amaz;
const amg = require('./amg');

class RendererBase extends amg.Script {

    constructor() {
        super();
        this._previousUniforms = {};
    }

    onStart() {
        this._renderer = this.entity.native.getComponent("MeshRenderer");
    }

    // get
    // Get component property
    get(key) {
        return this._properties.get(key);
    }

    // set
    // Set component property
    set(key, value) {
        if (key != null && value != null) {
            this._properties.set(key, value);
        }
    }

    // _shouldUpdateMaterial
    // If the key/value isnt null and the value has changed, return true
    // Only used for primitive types
    _shouldUpdateMaterial(uniform, value) {
        if (this._material != null && 
            uniform != null && value != null && 
            this._previousUniforms[uniform] !== value) {
            this._previousUniforms[uniform] = value;
            return true;
        } else {
            return false;
        }
    }

    // _setFloat
    _setFloat(uniform, value) {
        if (this._shouldUpdateMaterial(uniform, value)) {
            this._material.setFloat(uniform, value);
        }
    }

    // _setVec2
    _setVec2(uniform, vec2) {
        if (this._shouldUpdateMaterial(uniform, vec2)) {
            this._material.setVec2(uniform, vec2);
        }
    }

    // _setVec3
    _setVec3(uniform, vec3) {
        if (this._shouldUpdateMaterial(uniform, vec3)) {
            this._material.setVec3(uniform, vec3);
        }
    }

    // _setVec4
    _setVec4(uniform, vec4) {
        if (this._shouldUpdateMaterial(uniform, vec4)) {
            this._material.setVec4(uniform, vec4);
        }
    }

    // _setColor
    _setColor(uniform, color) {
        if (this._shouldUpdateMaterial(uniform, color)) {
            const colorVec = new Amaz.Vector4f(color.r, color.g, color.b, color.a);
            this._material.setVec4(uniform, colorVec);
        }
    }

    // _setTex
    _setTex(uniform, tex) {
        if (this._material != null && tex != null) {
            this._material.setTex(uniform, tex);
        }
    }

    // _setVec2Vec
    _setVec2Vec(uniform, vec2vec) {
        if (this._material != null && vec2vec != null) {
            this._material.setVec2Vector(uniform, vec2vec);
        }
    }

    // _setFloatVec
    _setFloatVec(uniform, floatVec) {
        if (this._material != null && floatVec != null) {
            this._material.setFloatVector(uniform, floatVec);
        }
    }
}

exports.RendererBase = RendererBase;