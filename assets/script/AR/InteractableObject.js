// Amaz
const Amaz = effect.Amaz;
const amg = require('amg');

class InteractableObject extends amg.Script {
    constructor() {
        super();
        this.name = "InteractableObject";
        this.offset = new Amaz.Vector3f(0,0,0);
        this.startPoint = new Amaz.Vector2f(0, 0);
        this.ARCameraEntity = undefined;
        this.ARCameraComp = undefined;
        this.isInteractable = true;
    }

    isARCamera(cameraEntity){
      if(cameraEntity && cameraEntity.getComponent("Camera") && cameraEntity.getComponent("JSScriptComponent")){
        const camera = cameraEntity.getComponent("Camera");
        const jsscript = cameraEntity.getComponent("JSScriptComponent");
        return camera.enabled && jsscript.path === "js/DeviceTracker.js" && jsscript.enabled;
      }
      return false;
    }

    //find first ARCamera
    findARCameraInEntity(entityFather){
      if(this.isARCamera(entityFather)){
        return entityFather;
      }
      const fatherTransform =  entityFather.getComponent("Transform")
      const childTransforms = fatherTransform.children;
      let result = undefined;
      for(let index = 0; index < childTransforms.size(); index++){
        const childTransform = childTransforms.get(index);
        const entityChild = childTransform.entity;
        if(this.isARCamera(entityChild)){
          result = entityChild;
          break;
        }
        else{
          const result = this.findARCameraInEntity(entityChild);
          if(result){
            return result
          }
        }
      }
      return result;
    }

    //find first ARCamera
    findARCamera(){
      const entities = this.entity.scene.entities;
      let result = undefined;
      for(let index = 0; index < entities.size(); index++){
        
        const entity = entities.get(index);
        if(entity.guid.equals(this.entity.guid)){
            continue;
        }
        result = this.findARCameraInEntity(entity);
        if(result){
          break;
        }
      }
      return result;
    }

    calcWorldPosition(camera, screenPos){
      //emit the ray from the center of the screen to AR plane (0 * x + 1 * y + 0 * z + 0 = 0)
      const width = camera.renderTexture.inputTexture.width;
      const height = camera.renderTexture.inputTexture.height;
      const ray = camera.ScreenPointToRay(new Amaz.Vector2f(screenPos.x * width, (1-screenPos.y) * height));
      const origin = ray.origin;
      const dir = ray.direction;
      const t = -origin.y / dir.y;
      const result = ray.getPoint(t);
      
      return result;
    }
    onInit(){

    }

    onEnable(){
        console.log("[OnEnable]",this.name);
    }

    onStart() {
	    console.log("running:InteractableObject:onStart"); 
        Amaz.AmazingManager.getSingleton('Input').addScriptListener(
            this.getComponent("InteractableObject").getScript(),
            Amaz.InputListener.ON_GESTURE_DRAG,
            'onCallBack',
            this.getComponent("InteractableObject").getScript()
        );
        this.ARCameraEntity = this.findARCamera();
        this.ARCameraComp = this.ARCameraEntity.getComponent("Camera");
    }

    onUpdate(deltaTime) {
      // if(this.isARCamera(this.ARCameraEntity)){
      //   this.ARCameraComp = this.ARCameraEntity.getComponent("Camera");
      //   //console.log("interabele: camera guid: ", this.ARCameraComp.guid);
      // }else{
      //   this.ARCameraEntity = this.findARCamera();
      // }
    }

    onLateUpdate(deltaTime) {
	    //console.log("running:InteractableObject:onLateUpdate");
    }

    onEvent(event) {
	    if (event.type === Amaz.EventType.TOUCH) {
            const touch = event.args.get(0);
            if (touch.type === Amaz.TouchType.TOUCH_BEGAN) {
              this.startPoint = new Amaz.Vector2f(touch.x, touch.y);
            }
          }
    }

    onDestroy(sys) {
        Amaz.AmazingManager.getSingleton('Input').removeScriptListener(
            this.getComponent("InteractableObject").getScript(),
            Amaz.InputListener.ON_GESTURE_DRAG,
            'onCallBack',
            this.getComponent("InteractableObject").getScript()
        );
    }

    onCallBack(userData, sender, eventType) {
        if (eventType != Amaz.InputListener.ON_GESTURE_DRAG) {
          return;
        }
    
        if (sender != null && this.ARCameraComp) {
          //this.getComponent("Transform").localPosition = this.calcWorldPosition(this.ARCameraComp, sender);
        }
      }
}

exports.InteractableObject = InteractableObject;
