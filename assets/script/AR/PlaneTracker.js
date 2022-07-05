// Amaz
const Amaz = effect.Amaz;
const amg = require('amg');

class PlaneTracker extends amg.Script {
    constructor() {
        super();
        this.name = "PlaceTracker";
    }

    onInit(){

    }

    onEnable(){
        console.log("[OnEnable]",this.name);
    }

    onStart() {
	    console.log("running:InteractableObject:onStart"); 
    }

    onUpdate(deltaTime) {
        
    }

    onLateUpdate(deltaTime) {
	  	
    }

    onEvent(event) {
    }

    onDestroy(sys) {
    }

}

exports.PlaneTracker = PlaneTracker;
