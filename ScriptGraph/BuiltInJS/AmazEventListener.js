/**
 * @file AmazEventListener.js
 * @author xuyuan
 * @date 2022/5/17
 * @brief AmazEventListener.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

class AmazEventListener {
  constructor() {
    this.registry = new Map(); //key: EventType  value: ArrayObj ({listener, cbFunc, userData})
  }

  haveRegistered(eventType, listener, userData, cbFuncName) {
    if (this.registry.has(eventType) === false) {
      return false;
    } else {
      const arr = this.registry.get(eventType);
      return arr.some(item => {
        return (
          (item.listener.equals ? item.listener.equals(listener) : item.listener === listener) &&
          (item.userData.equals ? item.userData.equals(userData) : item.userData === userData) &&
          item.cbFunc === cbFuncName
        );
      });
    }
  }

  registerListener(script, eventType, listener, userData, cbFuncName, ignoreCheck) {
    let needReg = false;
    if (!cbFuncName) {
      cbFuncName = 'onCallBack';
    }
    if (ignoreCheck) {
      script.addScriptListener(listener, eventType, cbFuncName, userData);
      needReg = true;
    } else {
      if (this.haveRegistered(eventType, listener, userData, cbFuncName) === false) {
        script.addScriptListener(listener, eventType, cbFuncName, userData);
        needReg = true;
      } else {
        console.error('The event has been monitored: ', eventType);
      }
    }
    if (needReg) {
      if (this.registry.has(eventType) === false) {
        this.registry.set(eventType, new Array());
      }
      this.registry.get(eventType).push({listener: listener, cbFunc: cbFuncName, userData: userData});
    }
  }

  removeListener(script, eventType, listener, userData, cbFuncName) {
    if (!cbFuncName) {
      cbFuncName = 'onCallBack';
    }
    if (this.haveRegistered(eventType, listener, userData, cbFuncName)) {
      script.removeScriptListener(listener, eventType, cbFuncName, userData);
    } else {
      console.error('No listener to remove!!');
    }
  }

  onDestroy(sys) {
    for (const [k, v] of this.registry) {
      for (const item of v) {
        this.removeListener(sys.script, k, item.listener, item.userData, item.cbFunc);
      }
    }
  }
}

exports.AmazEventListener = AmazEventListener;
