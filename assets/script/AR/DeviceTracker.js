'use strict';
const amg = require('amg');
const { Vec3,Vec2, Quat } = require('./amg');

// Amaz
const Amaz = effect.Amaz;
const MAXDIS = 3;

class DeviceTracker extends amg.Script {
    constructor() {
        super();
        this.name = "DeviceTracker";
        this.trackingType = "World"
        this.initSceneByRayCast = 0;
        this.entityVisiableMap = new Map();
        this.camera = null;
        this.transform = null;
        this.algMgr = null;
        this.pos = new Vec3(0,0,0)
        this.scale = new Vec3(0,0,0)
        this.quat = new Quat(0,0,0,0)
    }
    onEnable(){
        //console.log("[OnEnable]",this.name);
    }
    onStart() {
	    console.log("running:DeviceTracker:onStart"); 
        //backup all meshrender enable
        const entities = this.entity.scene.entities;
        for(let index = 0; index < entities.size(); index++){
            const entityOther = entities.get(index);
            this.entityVisiableMap.set(entityOther.guid.toString(), entityOther.selfvisible);
                                     
        }
        this.camera = this.entity.getComponent("Camera");
        this.transform = this.entity.getComponent("Transform");
        this.algMgr = Amaz.AmazingManager.getSingleton('Algorithm');;
        // this.entityVisiableMap.forEach((value, key) => {
        //     console.log("onStart:", key, value);
        // });
    }
    onInit(){

    }

    onUpdate(deltaTime) {
        //console.log("deviceonUpdate: cube size", this.findfirstMeshRenderEnity());
        
        const algResult = this.algMgr.getAEAlgorithmResult();
        const slamResult = algResult.getSlamInfo();
        let slamVaild = false
        if(slamResult !== null && slamResult.trackStatus === 1 && slamResult.enable){
            slamVaild = true;
        }

        if(slamVaild === true){
            this.initSceneByRayCast = this.initSceneByRayCast + 1;
            if(this.initSceneByRayCast === 1){
                this.invisibleAllEntity(false);
            }

            if(this.initSceneByRayCast >= 3){
                this.invisibleAllEntity(true);
            }

        }else{
            this.initSceneByRayCast = 0;
            this.invisibleAllEntity(true);
        }
    

        if(this.initSceneByRayCast === 2){
            //console.log("deviceTracker: index 2")
            this.updateCameraPos(slamVaild, slamResult)
            this.initPlace(this.camera);
        }

        this.updateCameraPos(slamVaild, slamResult)
        
    }
    
    initPlace(camera){
        //emit the ray from the center of the screen to AR plane (0 * x + 1 * y + 0 * z + 0 = 0)
        const width = camera.renderTexture.inputTexture.width;
        const height = camera.renderTexture.inputTexture.height;
        //console.log("initPlace,width is ", width, ", height: ", height)
        const ray = camera.ScreenPointToRay(new Vec2(width / 2, height /2));
        //console.log("initPlace: origin: x:", ray.origin.x, ", y:", ray.origin.y, ", z:", ray.origin.z, ", direction: x:", ray.direction.x, ", y:", ray.direction.y, ", z:", ray.origin.z)
        const origin = ray.origin;
        const dir = ray.direction;
        const t = -origin.y / dir.y;
        let result = ray.getPoint(t);
        //console.log("initPlace,point is: x: ", result.x, ", z: ", result.z)
        if(result.sqrMagnitude() > MAXDIS){
            const cameraPos = camera.entity.getComponent("Transform").worldPosition;
            const dir = new Amaz.Vector3f(result.x - cameraPos.x, result.y - cameraPos.y, result.z - cameraPos.z);
            const normalizeDir = dir.normalize();
            result = new Amaz.Vector3f(cameraPos.x + MAXDIS * normalizeDir.x, cameraPos.y + MAXDIS * normalizeDir.y, cameraPos.z + MAXDIS * normalizeDir.z);

        }

        //change all entities transform
        const entities = this.entity.scene.entities;
        for(let index = 0; index < entities.size(); index++){
            const entityOther = entities.get(index);
            if(entityOther.guid.equals(this.entity.guid)){
                continue;
            }
            const transform =  entityOther.getComponent("Transform");
            if(transform.parent === null){
                const wp ={x:transform.localPosition.x, y:transform.localPosition.y, z:transform.localPosition.z}
        transform.localPosition = new Amaz.Vector3f(
                wp.x + result.x, 
                wp.y + result.y,
                wp.z + result.z,)
                //console.log("DeviceTracker:transform move point is: x: ", transform.localPosition.x, ", y: ", transform.localPosition.y, ", z: ", transform.localPosition.y)                                    
            }
                   
        }
    }

    findfirstMeshRenderEnity(){
        //change all entities transform
        const entities = this.entity.scene.entities;
        for(let index = 0; index < entities.size(); index++){
            const entityOther = entities.get(index);
            if(entityOther.guid.equals(this.entity.guid)){
                //console.log("invisibleAllEntity: skip")
                continue;
            }else{
                const meshrenderer = entityOther.getComponent("MeshRenderer")
                const transform = entityOther.getComponent("Transform")
                if(meshrenderer && transform){
                    //console.log("findfirstMeshRenderEnity: meshrenderer.guid:", meshrenderer.guid.toString())
                    return transform.worldScale.toString()
                }
            }
                                     
        }
    }

    invisibleAllEntity(visiable){
        //change all entities transform
        const entities = this.entity.scene.entities;
        for(let index = 0; index < entities.size(); index++){
            const entityOther = entities.get(index);
            if(entityOther.guid.equals(this.entity.guid)){
                //console.log("invisibleAllEntity: skip")
                continue;
            }else{
                // if(this.entityVisiableMap.get(entityOther.guid) === null){
                //     this.entityVisiableMap.set(entityOther.guid, entityOther.visible)
                // }
                if(this.entityVisiableMap.get(entityOther.guid.toString())){
                    //console.log("invisibleAllEntity: this.entityVisiableMap.guid:", entityOther.guid.toString())
                    entityOther.selfvisible = visiable;
                }
            }
                                     
        }
    }
    checkAlgorithmResult(){
        const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
        const algResult = algMgr.getAEAlgorithmResult();
        const slamResult = algResult.getSlamInfo();
        if(slamResult !== null && slamResult.trackStatus === 1 && slamResult.enable){
            return true;
        }else{
            if(slamResult === null) console.error("DeviceTracker:slamResult is null")
            if(slamResult !== null && slamResult.trackStatus !== 1) console.error("DeviceTracker:slamResult trackStatus != 1")
            if(slamResult !== null && slamResult.trackStatus === 1 && slamResult.enable === false ) console.error("DeviceTracker:slamResult is disable")
            return false
        }
    }

    getAlgorithmResult(){
        const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
        const algResult = algMgr.getAEAlgorithmResult();
        const slamResult = algResult.getSlamInfo();
        return slamResult;
    }

    updateCameraPos(slamVaild, slamResult){
        //console.log("DeviceTracker:updateCameraPos begin, tracking mode is ", this.trackingType)
        
        if (slamVaild && this.initSceneByRayCast >= 2){
            //console.log("DeviceTracker: slam status is ready")
            const camera = this.camera
            const transform =  this.transform
            //console.log("DeviceTracker: guid: ",transform.guid.toString())
            //console.log("DeviceTracker: c position: x: ", transform.localPosition.x, ", y: ", transform.localPosition.y, ", z: ", transform.localPosition.z);

            if(camera === null || camera === undefined){
                console.error("DeviceTracker:camera is null");
                return;
            }
            camera.projectionMatrix = slamResult.projection
            //console.log("DeviceTracker:camera guid is", camera.guid.toString());
            let mat = slamResult.view
            let pos = this.pos
            let scale = this.scale
            let quat = this.quat
            mat.getDecompose(pos,scale,quat)
            //console.log("DeviceTracker: surface scale: x: ", scale.x, ", y: ", scale.y, ", z: ", scale.y);
            if (this.trackingType === "Surface"){
                //console.log("trackingType: ", this.trackingType)
                // //console.log("DeviceTracker: surface position: x: ", pos.x, ", y: ", pos.y, ", z: ", pos.y);
                //console.log("DeviceTracker: surface scale: x: ", scale.x, ", y: ", scale.y, ", z: ", scale.y);
                // //console.log("DeviceTracker: surface rotationQuat: x: ", quat.x, ", y: ", quat.y, ", z: ", quat.y, " w: ", quat.w);
                transform.worldPosition = pos
                transform.worldScale = scale
                transform.worldOrientation = quat
            }
            else if (this.trackingType === "World") {
                //console.log("trackingType: ", this.trackingType)
                transform.worldPosition = pos
                transform.worldScale = scale
                transform.worldOrientation = quat
                
            } 
            else if (this.trackingType === "Orientation") {
                //console.log("trackingType: ", this.trackingType)
                //console.log("DeviceTracker: c position: x: ", transform.localPosition.x, ", y: ", transform.localPosition.y, ", z: ", transform.localPosition.y);
                //transform.worldPosition = new Amaz.Vec3(0, 0, 40);
                //transform.worldScale = scale
                const euglar = quat.quaternionToEuler();
                //console.log("Orientation x: ", euglar.x, ", y:", euglar.y, ",z", euglar.z)
                transform.worldOrientation = quat
            } 
        }
    }

    onLateUpdate(deltaTime) {
	    //console.log("running:DeviceTracker:onLateUpdate");
    }

    onEvent(event) {
	    //console.log("running:DeviceTracker:onEvent");
    }
}

exports.DeviceTracker = DeviceTracker;
