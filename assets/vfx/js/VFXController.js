
    const Amaz = effect.Amaz;

    class VFXController {
      constructor() {
        this.name = 'VFXController';
        this.totaltime = 0;
      }
    
      onStart() {
        this.totaltime = 0;
        this.vfx = this.getComponent("VFXEffectBlock");
        
      }
    
      onUpdate(deltaTime) {
        this.totaltime = this.totaltime + deltaTime;
        
      }
    
      onEvent(event) {
  
      }
    }
    
    exports.VFXController = VFXController;    
  