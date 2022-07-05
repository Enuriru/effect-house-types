/**
 * @file CGScreenTouch2point.js
 * @author liyili
 * @date 2022/3/30
 * @brief CGScreenTouch2point.js
 * @copyright Copyright (c) 2022, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

const PointerState = {
  UNINIT: 'UNINIT',
  RIGHT: 'RIGHT',
  FINISH: 'FINISH'
}
class Pointer {
  constructor() {
    this.Idle = true;
    this.OnStart = false;
    this.Stay = false;
    this.OnStop = false;
    this.id = undefined;
    this.currentPos = undefined;
    this.lastPos = undefined;
    this.state = PointerState.UNINIT;
  }

}
class CGScreenTouch2point extends BaseNode {
  constructor() {
    super();
    this.Pointer1 = new Pointer();
    this.Pointer2 = new Pointer();
  }

  onEvent(sys, event) {
    if(event.type === Amaz.EventType.TOUCH){
      console.log("Gesture begin");
      this._handleTouchEvent(event)
    }
  }

  onLateUpdate(sys, dt) {
    if(this.Pointer1.Idle && this.nexts[0]){
      //P1 Idle Event Port
      this.nexts[0]();
    }else{
      //P1 On Start
      if(this.Pointer1.OnStart && this.nexts[1]){
        this.nexts[1]();
      }
      //P1 Stay
      if(this.Pointer1.Stay && this.nexts[2]){
        this.nexts[2]();
      }

      //P1 on Stop
      if(this.Pointer1.OnStop && this.nexts[3]){
        this.nexts[3]();
      }
    }

    if(this.Pointer2.Idle && this.nexts[4]){
      //P2 Idle Event Port
      this.nexts[4]();
    }else{
      //P2 On Start
      if(this.Pointer2.OnStart && this.nexts[5]){
        this.nexts[5]();
      }
      //P2 Stay
      if(this.Pointer2.Stay && this.nexts[6]){
        this.nexts[6]();
      }

      //P2 on Stop
      if(this.Pointer2.OnStop && this.nexts[7]){
        this.nexts[7]();
      }
    }

    this.outputs[8] = this.Pointer1.currentPos;
    this.outputs[9] = this.Pointer1.lastPos;

    this.outputs[10] = this.Pointer2.currentPos;
    this.outputs[11] = this.Pointer2.lastPos;

    if(this.Pointer1.OnStop){
      this.setPointer(this.Pointer1, undefined, PointerState.UNINIT, true, false, false, false, undefined, undefined);
    }

    if(this.Pointer2.OnStop){
      this.setPointer(this.Pointer2, undefined, PointerState.UNINIT, true, false, false, false, undefined, undefined);
    }
    
  }

  _handleTouchEvent(event){
    const pointer = event.args.get(0)
    if(pointer !== undefined ){
        const type = pointer.type
        if(type === Amaz.TouchType.TOUCH_BEGAN) {
            if(this.Pointer1.state === PointerState.UNINIT || this.Pointer1.state === PointerState.FINISH ){
              this.setPointer(this.Pointer1, pointer.pointerId, PointerState.RIGHT, false, true, false, false, new Amaz.Vector2f(pointer.x, pointer.y), undefined);
            }else if(this.Pointer2.state === PointerState.UNINIT || this.Pointer2.state === PointerState.UNINIT ){
              this.setPointer(this.Pointer2, pointer.pointerId, PointerState.RIGHT, false, true, false, false, new Amaz.Vector2f(pointer.x, pointer.y), undefined);
            }
        }else if(type === Amaz.TouchType.TOUCH_MOVED) {
          if(this.Pointer1.state === PointerState.RIGHT && pointer.pointerId === this.Pointer1.id){
            this.setPointer(this.Pointer1, pointer.pointerId, PointerState.RIGHT, false, false, true, false, new Amaz.Vector2f(pointer.x, pointer.y), new Amaz.Vector2f(this.Pointer1.currentPos.x, this.Pointer1.currentPos.y));
          }else if(this.Pointer2.state === PointerState.RIGHT && pointer.pointerId === this.Pointer2.id){
            this.setPointer(this.Pointer2, pointer.pointerId, PointerState.RIGHT, false, false, true, false, new Amaz.Vector2f(pointer.x, pointer.y), new Amaz.Vector2f(this.Pointer2.currentPos.x, this.Pointer2.currentPos.y));
          }
            
        }else if(type === Amaz.TouchType.TOUCH_ENDED) {
          if(this.Pointer1.state === PointerState.RIGHT && pointer.pointerId === this.Pointer1.id){
            this.setPointer(this.Pointer1, pointer.pointerId, PointerState.FINISH, false, false, false, true, new Amaz.Vector2f(pointer.x, pointer.y), new Amaz.Vector2f(this.Pointer1.currentPos.x, this.Pointer1.currentPos.y));
          }else if(this.Pointer2.state === PointerState.RIGHT && pointer.pointerId === this.Pointer2.id){
            this.setPointer(this.Pointer2, pointer.pointerId, PointerState.FINISH, false, false, false, true, new Amaz.Vector2f(pointer.x, pointer.y), new Amaz.Vector2f(this.Pointer2.currentPos.x, this.Pointer2.currentPos.y));
          }  
        }
    }
  }

  setPointer(pointer, id, state, Idle, OnStart, Stay, OnStop, currentPos, lastPos){
    pointer.Idle = Idle;
    pointer.OnStart = OnStart;
    pointer.Stay = Stay;
    pointer.OnStop = OnStop;
    pointer.currentPos = currentPos 
    pointer.lastPos = lastPos;
    pointer.id = id;
    pointer.state = state;
  }
}

exports.CGScreenTouch2point = CGScreenTouch2point;
