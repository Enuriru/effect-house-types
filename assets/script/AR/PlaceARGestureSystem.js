'use strict';

const Amaz = effect.Amaz;

const getRayFromScreen = (camera, point) =>{
    const width = camera.renderTexture.inputTexture.width;
    const height = camera.renderTexture.inputTexture.height;
    const ray = camera.ScreenPointToRay(new Amaz.Vector2f(point.x * width, (1 - point.y) * height));
    return ray;
}
const minVec3 = (a, b) =>{
    return new Amaz.Vector3f(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
}

const maxVec3 = (a, b) =>{
    return new Amaz.Vector3f(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
}

const minAB = (a, b) => {
    return a < b ? a : b;
}

const maxAB = (a, b) => {
    return a > b ? a : b;
}
const isAxis = (ray) => {
    const dirNormalize = ray.direction.normalize();
    return dirNormalize.x === 1 || dirNormalize.y === 1 || dirNormalize.z === 1;
}

const RayHitAABB2d = (aabb, ray) =>{
    if(ray.direction.x !== 0){
        const yz = ray.getPoint(0);
        return aabb.min_y < yz.y && aabb.max_y > yz.y &&  aabb.min_z < yz.z && aabb.max_z > yz.z;
    }

    if(ray.direction.y !== 0){
        const xz = ray.getPoint(0);
        return aabb.min_x < xz.x && aabb.max_x > xz.x &&  aabb.min_z < xz.z && aabb.max_z > xz.z;
    }

    if(ray.direction.z !== 0){
        const xy = ray.getPoint(0);
        return aabb.min_x < xy.x && aabb.max_x > xy.x &&  aabb.min_z < xy.z && aabb.max_z > xy.z;
    }
}

const RayHitAABB = (aabb, ray) => {
    if(isAxis(ray)){
        return RayHitAABB2d(aabb, ray);
    }
    const invR = new Amaz.Vector3f(1.0 / ray.direction.x, 1.0 / ray.direction.y, 1.0 / ray.direction.z);
    const bottomT = new Amaz.Vector3f(invR.x * (aabb.min_x - ray.origin.x), invR.y * (aabb.min_y - ray.origin.y), invR.z * (aabb.min_z - ray.origin.z));
    const topT = new Amaz.Vector3f(invR.x * (aabb.max_x - ray.origin.x), invR.y * (aabb.max_y - ray.origin.y), invR.z * (aabb.max_z - ray.origin.z));
    const minT = minVec3(bottomT, topT);
    const maxT = maxVec3(bottomT, topT);
    const largestMinT = maxAB(maxAB(minT.x, minT.y), maxAB(minT.x, minT.z));
    const largestMaxT = minAB(minAB(maxT.x, maxT.y), minAB(maxT.x, maxT.z));
    return largestMaxT > largestMinT;
}

const AABBExpand = (aabb, point) =>{

    if (point.x < aabb.min_x)
        aabb.min_x = point.x;
    if (point.y < aabb.min_y)
        aabb.min_y = point.y;
    if (point.z < aabb.min_z)
        aabb.min_z = point.z;
    if (aabb.max_x < point.x)
        aabb.max_x = point.x;
    if (aabb.max_y < point.y)
        aabb.max_y = point.y;
    if (aabb.max_z < point.z)
        aabb.max_z = point.z;
}

const AABBMulitMatrix = (aabb, mat4) =>{
    let aabbResult = new Amaz.AABB();
    const min = new Amaz.Vector4f(aabb.min_x, aabb.min_y, aabb.min_z, 1);
    const max = new Amaz.Vector4f(aabb.max_x, aabb.max_y, aabb.max_z, 1);
    // console.log("AABBMulitMatrix aabb 0 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(min)).toString())
    // console.log("AABBMulitMatrix aabb 1 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(new Amaz.Vector4f(max.x, min.y, min.z, 1))).toString())
    // console.log("AABBMulitMatrix aabb 2 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(new Amaz.Vector4f(max.x, max.y, min.z, 1))).toString())
    // console.log("AABBMulitMatrix aabb 3 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(new Amaz.Vector4f(min.x, max.y, min.z, 1))).toString())
    // console.log("AABBMulitMatrix aabb 4 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(max)).toString())
    // console.log("AABBMulitMatrix aabb 5 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(new Amaz.Vector4f(min.x, max.y, max.z, 1))).toString())
    // console.log("AABBMulitMatrix aabb 4 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(new Amaz.Vector4f(min.x, min.y, max.z, 1))).toString())
    // console.log("AABBMulitMatrix aabb 5 mat4.multiplyVector3(min): ", (mat4.multiplyVector4(new Amaz.Vector4f(max.x, min.y, max.z, 1))).toString())

    //console.log("AABBMulitMatrix preAABBExpand aabb min:", aabbResult.min_x, ", ", aabbResult.min_y, ", ", aabbResult.min_z);
    AABBExpand(aabbResult, mat4.multiplyVector4(min));
    //console.log("AABBMulitMatrix aftAABBExpand aabb min:", aabbResult.min_x, ", ", aabbResult.min_y, ", ", aabbResult.min_z);
    AABBExpand(aabbResult, mat4.multiplyVector4(new Amaz.Vector4f(max.x, min.y, min.z, 1)));
    AABBExpand(aabbResult, mat4.multiplyVector4(new Amaz.Vector4f(max.x, max.y, min.z, 1)));
    AABBExpand(aabbResult, mat4.multiplyVector4(new Amaz.Vector4f(min.x, max.y, min.z, 1)));

    AABBExpand(aabbResult, mat4.multiplyVector4(max));
    AABBExpand(aabbResult, mat4.multiplyVector4(new Amaz.Vector4f(min.x, max.y, max.z, 1)));
    AABBExpand(aabbResult, mat4.multiplyVector4(new Amaz.Vector4f(min.x, min.y, max.z, 1)));
    AABBExpand(aabbResult, mat4.multiplyVector4(new Amaz.Vector4f(max.x, min.y, max.z, 1)));
    return aabbResult;
}

const getMeshRenderAABB = (meshRenderer)=>{
    const transform = meshRenderer.entity.getComponent("Transform").getWorldMatrix();
    const mMesh = meshRenderer.mesh;
    //return meshRenderer.getBoundingBox()

    if (mMesh && mMesh.submeshes.size() != 0 && transform)
    {
        const m_boundingBox = AABBMulitMatrix(mMesh.boundingBox, transform);
        return m_boundingBox;
    }
    console.error("getMeshRenderAABB fail!, meshrender guid: ", meshRenderer.guid.toString(), ", submesh size: ", mMesh.submeshes().size(), ", tranform guid: ", transform.guid.toString());
    return undefined;
}
const rayCastHit = (meshRenderer, camera, point) =>{
    const ray = getRayFromScreen(camera, point);
    const aabb = getMeshRenderAABB(meshRenderer);
    //const aabbRight = meshRenderer.getBoundingBox();
    // console.log("rayCastHit right aabb min:", aabbRight.min_x, ", ", aabbRight.min_y, ", ", aabbRight.min_z);
    // console.log("rayCastHit aabb min:", aabb.min_x, ", ", aabb.min_y, ", ", aabb.min_z);
    // console.log("rayCastHit right aabb max:", aabbRight.max_x, ", ", aabbRight.max_y, ", ", aabbRight.max_z);
    // console.log("rayCastHit aabb max:", aabb.max_x, ", ", aabb.max_y, ", ", aabb.max_z);

    return RayHitAABB(aabb, ray);
}

class PlaceARGestureSystem{

    constructor() {
        //config
        this.config = {}
        // AR compont
        this.ARCamera = undefined 
        this.interactableMap = new Amaz.Map()
        this.operatingEntity = undefined
        this.operatingTransform = undefined
        // interaction
        this.point1 = undefined
        this.point2 = undefined
        this.moveOffset = new Amaz.Vector2f()
        this.scaleInfo = {}
        this.rotationInfo = {}
        this.operating = false
        this.touchTimer = 0
        this.tap = false
        this.firstTest = false
        this.placing = 0
        // scale & rotate
        this.scaleInfo = {}
        this.rotationInfo = {}
        this.scaleInfo.initDist = 0
        this.scaleInfo.isCheck = false
        this.scaleInfo.currScale = 0
        this.rotationInfo.isCheck = false
        this.rotationInfo.initPointerDir = new Amaz.Vector2f();
        this.rotationInfo.currAngle = 0

    }

    onInit() {
        console.log("running: PlaceARGestureSystem:onInit")
    }

    onStart() {
        console.log("running: PlaceARGestureSystem:onStart")
        //----------------- config -----------------
        this.config.moveRange = 20.0    //--- maximum moving range, unuse
        this.config.touchThresh = 0.5   //--- touch time to be recognized as tap operation, unuse
        this.config.selectRange = 1  //--- select range for drag move, scale and rotate, screen space,
        //----------------- scaleInfo -----------------
        this.scaleInfo.maxValue = Number.MAX_VALUE  //--- maximum scale size
        this.scaleInfo.minValue = 0.01  //--- minimum scale size
        this.scaleInfo.speed = 0.15     //--- scale speed
        //---------------- rotationInfo ---------------
        this.rotationInfo.speed = 6.0   //--- rotate speed

        
    }

    onComponentAdded(comp) {
        console.log("running: PlaceARGestureSystem:onComponentAdded")
        const compEntity = comp.entity
        if(this._isARCamera(compEntity)){
            this.ARCamera = compEntity
            console.log("PlaceARGestureSystem:onComponentAdded ARCamera add, guid: ", this.ARCamera.guid.toString());
        }else if(this._isInteractableObject(compEntity) && this.interactableMap.has(compEntity.guid.toString()) === false){
            this.interactableMap.insert(compEntity.guid.toString(), compEntity)
            //comp.entity.visible = false
            this.placing = 1
            console.log("PlaceARGestureSystem:onComponentAdded interactableObject add, guid: ", compEntity.guid.toString())
        }
    }

    onComponentRemoved(comp) {
        console.log("running: PlaceARGestureSystem:onComponentRemoved")
        const compEntity = comp.entity
        if(this._isARCamera(compEntity)){
            this.ARCamera = undefined
            console.log("PlaceARGestureSystem:onComponentRemoved ARCamera remove, guid: ", this.ARCamera.guid.toString())
        }else if(this._isInteractableObject(compEntity) && this.interactableMap.has(compEntity.guid.toString()) === true){
            this.interactableMap.remove(compEntity.guid.toString())
            console.log("PlaceARGestureSystem:onComponentRemoved interactableObject remove, guid: ", compEntity.guid.toString())
        }
    }
    onUpdate(dt) {
        const algo_result = Amaz.AmazingManager.getSingleton('Algorithm').getAEAlgorithmResult()
        if(!algo_result) {
            console.log("PlaceARGestureSystem:onUpdate, algo_result is undefind")
            return 
        }

        const slam_info = algo_result.getSlamInfo()
        if(!slam_info) {
            console.log("PlaceARGestureSystem:onUpdate, slam_info is undefind")
            return
        }

        if (this.placing === 2) {
            //this._visiableAllInterable();
            //this._initPlace(this.ARCamera.getComponent("Camera"));
            this.placing = 3
        }

        if(this.placing == 1 && slam_info.enable && slam_info.trackStatus === 1) {
            this.placing = 2
        }


        if (this.operating) {
            this.touchTimer = this.touchTimer + dt
        }

        if (this.tap) {
            this.tap = false
        }
    }

    onEvent(event) {
        if(event.type === Amaz.EventType.TOUCH){
            console.log("Gesture begin");
            this._handleTouchEvent(event)
        }
    }

    onDestroy() {
        
    }

    onCallBack(sys, sender, eventType) {
       
    }

    _isInterable(interabeleObject){
        if(interabeleObject.name === "SkeletonAndRenderRoot"){
            return true;
        }
        if(interabeleObject && interabeleObject.getComponent("JSScriptComponent") !== undefined){
            const jsscript = interabeleObject.getComponent("JSScriptComponent");
            if(jsscript.path === "js/InteractableObject.js" && jsscript.enabled){
                return jsscript.properties.has("isInteractable") && jsscript.properties.get("isInteractable")
            }
          }
        return false;
    }

    _visiableAllInterable(){
        const keys = this.interactableMap.getVectorKeys()
        console.log("_visiableAllInterable size: ", keys.size())
        for(let i = 0;i < keys.size(); i++){
            const key = keys.get(i)
            const entity = this.interactableMap.get(key);
            entity.visible = true;
            console.log("_visiableAllInterable, visible entity guid: ", entity.guid.toString(), ", visiable: ", entity.visible)
        }
    }

    _initPlace(camera){
        //emit the ray from the center of the screen to AR plane (0 * x + 1 * y + 0 * z + 0 = 0)
        const width = camera.renderTexture.inputTexture.width;
        const height = camera.renderTexture.inputTexture.height;
        console.log("_initPlace: screen width: ", width, " ,screen height: ", height);
        const ray = camera.ScreenPointToRay(new Amaz.Vector2f(width / 2, height /2));
        const origin = ray.origin;
        const dir = ray.direction;
        const t = -origin.y / dir.y;
        const result = ray.getPoint(t);
        console.log("_initPlace: screen center world pos: x:", result.x, " ,y: ", result.y, ", z:", result.z);

        //change all entities transform
        const entities = camera.entity.scene.entities;
        for(let index = 0; index < entities.size(); index++){
            const entity = entities.get(index);
            if(entity.guid.equals(this.ARCamera.guid)){
                continue;
            }
            const transform =  entity.getComponent("Transform");
            transform.worldPosition = new Amaz.Vector3f(transform.worldPosition.x + result.x, 
                transform.worldPosition.y + result.y,
                transform.worldPosition.z + result.z,)
            console.log("_initPlace, guid: ", entity.guid.toString() ,"transform move point is: x: ", transform.worldPosition.x, ", y: ", transform.worldPosition.y, ", z: ", transform.worldPosition.y)                                    
        }
    }

    _isARCamera(cameraEntity){
        //console.log("_isARCamera: has Camera: ", cameraEntity && cameraEntity.getComponent("Camera") !== undefined, "has JSScriptComponent: ", cameraEntity &&  cameraEntity.getComponent("JSScriptComponent") !== undefined )
        console.log("_isARCamera: cameraEntity is null?: ", cameraEntity !== null && cameraEntity !== undefined);
        console.log("_isARCamera: cameraEntity has camera: ", cameraEntity.getComponent("Camera") !== null);
        console.log("_isARCamera: cameraEntity has JSScriptComponent: ", cameraEntity.getComponent("JSScriptComponent") !== null);
        
        if(cameraEntity && cameraEntity.getComponent("Camera") && cameraEntity.getComponent("JSScriptComponent")){
          const camera = cameraEntity.getComponent("Camera");
          const jsscript = cameraEntity.getComponent("JSScriptComponent");
          console.log("_isARCamera: jscript path:  ", jsscript.path, ", jsscript.enabled: ", jsscript.enabled, ",camera enable: ", camera.enabled);
          return camera.enabled && jsscript.path === "js/DeviceTracker.js" && jsscript.enabled;
        }
        return false;
    }

    _isInteractableObject(entity){
       // console.log("_isInteractableObject: has JSScriptComponent: ", entity && entity.getComponent("JSScriptComponent") !== undefined)
        if(entity && entity.getComponent("JSScriptComponent") !== undefined){
            const jsscript = entity.getComponent("JSScriptComponent");
            //console.log("_isInteractableObject path: ", jsscript.path, "guid: ", jsscript.guid.toString());
            return jsscript.path === "js/InteractableObject.js" && jsscript.enabled;
          }
        return false;
    }

    _getMeshRender(entity){
        if(entity.getComponent("MeshRenderer")){
            return entity.getComponent("MeshRenderer")
        }
        return undefined;
    }

    _handleTouchEvent(event){
        const pointer = event.args.get(0)
        if(pointer !== undefined ){
            const scaleInfo = this.scaleInfo
            const rotationInfo = this.rotationInfo
            const type = pointer.type
            let viewportPoint = new Amaz.Vector2f(pointer.x, pointer.y)
            if(type === Amaz.TouchType.TOUCH_BEGAN) {
                console.log("Gesture begin: TOUCH_BEGAN");
                this.point1 = pointer
                if (this.operatingEntity === undefined) {
                    this._initGestures(pointer, scaleInfo, rotationInfo)
                    this.operating = true
                    this.touchTimer = 0
                    console.log("Gesture begin: TOUCH_BEGAN: _initGestures");
                }
                if (pointer.count === 1) {
                    const meshrendererComp = this._getMeshRender(this.operatingEntity);
                    const cameraComp = this.ARCamera.getComponent("Camera");
                    const castresult = meshrendererComp ? rayCastHit(meshrendererComp, cameraComp, pointer) : true;
                    console.log("Gesture begin TOUCH_BEGAN: mesh render guid:", meshrendererComp.guid.toString(), "meshrendererComp name: ", meshrendererComp.name);
                    console.log("Gesture begin TOUCH_BEGAN: cameraComp guid:", cameraComp.guid.toString(), "cameraComp name: ", cameraComp.name);
                    console.log("Gesture begin TOUCH_BEGAN: ray cast:", castresult);
                    console.log("Gesture begin TOUCH_BEGAN:_isInterable", castresult)
                    if(castresult && this._isInterable(this.operatingEntity)){
                        const offset = this._calcWorldPosition(this.ARCamera.getComponent("Camera"), pointer, this.operatingTransform.worldPosition)
                        console.log("Gesture begin TOUCH_BEGAN: move offset: x: ", offset.x, ", y: ", offset.y, ", z:", offset.z);
                        this.operatingTransform.worldPosition = offset
                    }
                }
            }else if(type === Amaz.TouchType.TOUCH_MOVED) {
                console.log("Gesture begin: TOUCH_MOVED");
                if (pointer.pointerId !== this.point1.pointerId) {
                    console.log("Gesture begin: TOUCH_MOVED: init pointer2");
                    this.point2 = pointer
                }else if (pointer.pointerId === this.point1.pointerId) {
                    console.log("Gesture begin: TOUCH_MOVED: update pointer1");
                    this.point1 = pointer
                }
                if (pointer.count === 2) {
                    console.log("Gesture begin: TOUCH_MOVED: two pointer");
                    viewportPoint = new Amaz.Vector2f(0, 0);
                    viewportPoint.add(new Amaz.Vector2f((this.point1.x - this.point2.x) * 0.5, (this.point1.y - this.point2.y) * 0.5));
                    viewportPoint.add(new Amaz.Vector2f(this.point2.x, this.point2.y));
                }

                if (this.operatingEntity === undefined) {
                    console.log("Gesture begin: TOUCH_MOVED: _initGestures");
                    this._initGestures(viewportPoint, scaleInfo, rotationInfo)
                }

                if (this.operatingEntity !== undefined && this._isInterable(this.operatingEntity)) {
                    if (pointer.count === 2 && pointer.pointerId == this.point2.pointerId) {
                        console.log("Gesture begin: TOUCH_MOVED: handle rotation & Scale");
                        const meshrendererComp = this._getMeshRender(this.operatingEntity);
                        const cameraComp = this.ARCamera.getComponent("Camera");
                        const midpoint = {x:(this.point1.x + this.point2.x) / 2.0, y:(this.point1.y + this.point2.y) / 2.0}
                        const castresult = meshrendererComp ? rayCastHit(meshrendererComp, cameraComp, midpoint) : true;
                        if(castresult){
                            this._handleRotationGesture(pointer, rotationInfo, this.operatingTransform)
                            this._handleScaleGesture(pointer, scaleInfo, this.operatingTransform)
                        }
                        //this._handleRotationGesture(pointer, rotationInfo, this.operatingTransform)
                        //this._handleScaleGesture(pointer, scaleInfo, this.operatingTransform)
                    }else if (pointer.count === 1) {
                        const meshrendererComp = this._getMeshRender(this.operatingEntity);
                        const cameraComp = this.ARCamera.getComponent("Camera");
                        const castresult = meshrendererComp ? rayCastHit(meshrendererComp, cameraComp, pointer) : true;
                        meshrendererComp && console.log("Gesture begin TOUCH_MOVED: mesh render guid:", meshrendererComp.guid.toString(), "meshrendererComp name: ", meshrendererComp.name);
                        console.log("Gesture begin TOUCH_MOVED: cameraComp guid:", cameraComp.guid.toString(), "cameraComp name: ", cameraComp.name);
                        console.log("Gesture begin TOUCH_MOVED: ray cast:", castresult);
                        if(castresult){
                            const offset = this._calcWorldPosition(this.ARCamera.getComponent("Camera"), pointer, this.operatingTransform.worldPosition)
                            console.log("Gesture begin TOUCH_BEGAN: move offset: x: ", offset.x, ", y: ", offset.y, ", z:", offset.z);
                            this.operatingTransform.worldPosition = offset
                        }
                    }
                }
            }else if(type === Amaz.TouchType.TOUCH_ENDED) {
                if (this.touchTimer < this.config.touchThresh) {
                    this.tap = true
                }
                this.operating = false
                this.operatingEntity = undefined
            }
        }
    }

    _initGestures(pointer, scaleInfo, rotationInfo){
        this.operatingEntity = this._getClosestEntity(new Amaz.Vector2f(pointer.x, pointer.y), this.config.selectRange)
        console.log("_initGestures:operatingEntity guid: ", this.operatingEntity.guid, "operatingEntity name:", this.operatingEntity.name)
        if (this.operatingEntity !== undefined) {
            this.operatingTransform = this.operatingEntity.getComponent("Transform");
            this._initScaleGesture(scaleInfo, this.operatingTransform)
            this._initRotationGesture(rotationInfo, this.operatingTransform)
        }
    }

    _getRenderEntity(entity){
        if(entity.getComponent("SkinMeshRenderer")){
            let tranformNew = entity.getComponent("Transform");
            while(tranformNew){
                if(tranformNew.entity.name === "SkeletonAndRenderRoot"){
                    return tranformNew.entity
                }
                tranformNew = tranformNew.parent
            }

        }
        return entity;
    }

    _getClosestEntity(viewportPoint, threshold){
        let distance = Number.MAX_VALUE;
        let entity = undefined
        let cameraComp = this.ARCamera.getComponent("Camera")
        console.log("_getClosestEntity interactableVector size: ", this.interactableMap.size());
        const keys = this.interactableMap.getVectorKeys();
        for(let i = 0;i < keys.size(); i++){
            const key = keys.get(i)
            const entityNow = this._getRenderEntity(this.interactableMap.get(key));
            const entityNowWorldPos = entityNow.getComponent("Transform").getWorldPosition()
            let viewportPos = cameraComp.worldToViewportPoint(entityNowWorldPos);
            viewportPos = new Amaz.Vector2f(viewportPos.x, 1.0 - viewportPos.y)
            const dir = new Amaz.Vector2f(viewportPos.x - viewportPoint.x, viewportPos.y - viewportPoint.y);
            let currDist = dir.sqrMagnitude()
            console.log("_getClosestEntity distance: ", currDist);
            if (currDist < distance && currDist < threshold) {
                this.moveOffset = dir;
                distance = currDist
                entity = entityNow;
            }
        }
        //console.log("_getClosestEntity closet entity guid: ", entity.guid.toString());
        return entity
    }

    _handleScaleGesture(pointer, scaleInfo, interabeleObject){
        const point1 = new Amaz.Vector2f(this.point1.x, this.point1.y)
        const point2 = new Amaz.Vector2f(this.point2.x, this.point2.y)

        if (scaleInfo.isCheck === false) {
            scaleInfo.initDist = point1.distance(point2)
            scaleInfo.isCheck = true
        }

        let newDist = point1.distance(point2)
        let newScale = scaleInfo.currScale + (newDist - scaleInfo.initDist) * this.scaleInfo.speed

        if (newScale > scaleInfo.maxValue) {
            newScale = scaleInfo.maxValue
        }else if(newScale < scaleInfo.minValue) {
            newScale = scaleInfo.minValue
        }
        console.log("_handleScaleGesture, new sacle: ", newScale, ", now newScale: ", newScale , ", last world angle: ", interabeleObject.worldScale.y);
        interabeleObject.worldScale = new Amaz.Vector3f(newScale, newScale, newScale)
    }

    _handleRotationGesture(pointer, rotationInfo, interabeleObject){
        const point1 = new Amaz.Vector2f(this.point1.x, this.point1.y)
        const point2 = new Amaz.Vector2f(this.point2.x, this.point2.y)

        if (rotationInfo.isCheck === false){
            rotationInfo.initPointerDir.x = point2.x - point1.x
            rotationInfo.initPointerDir.y = point2.y - point1.y
            rotationInfo.isCheck = true
        }

        const pointerDir = new Amaz.Vector2f(point2.x - point1.x, point2.y - point1.y)
        let newAngle = pointerDir.angle(rotationInfo.initPointerDir)
        const dirX = new Amaz.Vector3f(pointerDir.x, pointerDir.y, 0);
        const dirY = new Amaz.Vector3f(rotationInfo.initPointerDir.x, rotationInfo.initPointerDir.y, 0);
        const LR = dirX.cross(dirY)
        if (LR.z < 0) {
            newAngle = -newAngle
        }
        console.log("_handleRotationGesture, new rotation: ", newAngle, ", now angle: ", newAngle * this.rotationInfo.speed + rotationInfo.currAngle, ", last world angle: ", interabeleObject.worldEulerAngle.y);
        interabeleObject.worldEulerAngle = new Amaz.Vector3f(0, (newAngle * 10 + rotationInfo.currAngle), 0)
    }

    _initScaleGesture(scaleInfo, tracker){
        scaleInfo.isCheck = false
        scaleInfo.currScale = tracker.worldScale.x
    }
    
    _initRotationGesture(rotationInfo, tracker){
        rotationInfo.isCheck = false
        rotationInfo.currAngle = tracker.worldEulerAngle.y
    }

    _checkDistance(entity){
        let cameraPos = this.ARCamera.getComponent("Transform").getWorldPosition();
        cameraPos = new Amaz.Vector3f(cameraPos.x, 0.0, cameraPos.z)
        let entityPos = entity.getComponent("Transform").getWorldPosition()
        let dist = new Amaz.Vector3f.SqrMagnitude(cameraPos - entityPos)
        return dist
    }

    _calcWorldPosition(camera, screenPos, objectPostion){
        //emit the ray from the center of the screen to AR plane (0 * x + 1 * y + 0 * z + 0 = y0)
        const width = camera.renderTexture.inputTexture.width;
        const height = camera.renderTexture.inputTexture.height;
        const ray = camera.ScreenPointToRay(new Amaz.Vector2f(screenPos.x * width, (1-screenPos.y) * height));
        const origin = ray.origin;
        const dir = ray.direction;
        const t = (objectPostion.y - origin.y) / dir.y;
        const result = ray.getPoint(t);
        
        return result;
      }
};

exports.PlaceARGestureSystem = PlaceARGestureSystem;