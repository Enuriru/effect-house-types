
const effect_api = "undefined" != typeof effect ? effect : "undefined" != typeof tt ? tt : "undefined" != typeof lynx ? lynx : {};
const Amaz = effect_api.getAmaz();
const amg = require('./amg');

class LutFilter {
    constructor() {
        this.name = "LutFilter";
        this.renderer = null;
        this.material = null;
        this.texture = null;
        this.intensity = null;
        this.propertiesMap = null;
    }

    component() {
        const jsScriptComps = this.entity.getComponents('JSScriptComponent');
        for (let i = 0; i < jsScriptComps.size(); i++) {
            const comp = jsScriptComps.get(i);
            if (comp.path === 'js/LutFilter.js') {
                return comp;
            }
        }
    }

    findMaterial() {
        this.renderer = this.entity.getComponent("MeshRenderer");
        if (this.renderer === null) {
            console.error("No renderer found");
            return;
        }
        this.renderer.useFrustumCulling = false;
        if (this.renderer.sharedMaterials.size() === 0) {
            console.error("No material existed in renderer");
            return;
        }
        this.material = this.renderer.material;
        if (this.material === null) {
            console.error("No material found");
            return;
        }
    }

    onInit() {
        this.propertiesMap = this.component().properties;
        findMaterial();
    }

    setMaterialProperties() {
        if (this.material !== null) {
            this.texture = this.propertiesMap.get("texture");
            if (this.texture !== null) {
                this.material.setTex("_BaseTexture", this.texture);
            }
            this.intensity = this.propertiesMap.get("intensity");
            if (this.intensity !== null) {
                this.material.setFloat("_Intensity", this.intensity);
            }
            return;
        } else {
            //Try to find the material
            this.findMaterial();
        }
    }

    onEnable() {
    }

    onStart() {
        this.onInit();
    }

    onUpdate(deltaTime) {
        this.setMaterialProperties();
    }

    onLateUpdate(deltaTime) {
    }

    onEvent(event) {
    }
}

exports.LutFilter = LutFilter;
