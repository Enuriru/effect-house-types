/**
 * @file CGImageTap.js
 * @author rcano
 * @date 2022/5/11
 * @brief CGImageTap.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('./BaseNode');
const Amaz = effect.Amaz;

class CGImageTap extends BaseNode {
  constructor() {
    super();
    this._min = new Amaz.Vector3f();
    this._max = new Amaz.Vector3f();
    this._fixedTapPos = new Amaz.Vector3f();
    this._tapPos = new Amaz.Vector2f();
    this._clamp01 = num => Math.min(Math.max(num, 0), 1);
    this._imgTrans = null;
    this._img = null;
    this._canvas = null;
    this._isScreenTapped = false;
  }

  onUpdate(sys, dt)
  {
    this.outputs[1] = false;
    if(this._isScreenTapped)
    {
      this._runImageTapNode(sys);
      this._isScreenTapped = false;
    }
  }

  onEvent(sys, event) {
    if (this.inputs[0] == null) {
      return;
    }

    if (event.type === Amaz.EventType.TOUCH) {
      const touch = event.args.get(0);
      if (touch.type === Amaz.TouchType.TOUCH_BEGAN) {
        this._tapPos.set(touch.x, 1 - touch.y);
        this._isScreenTapped = true;
      }
    }
  }

  _runImageTapNode(sys) {
    const img = this.inputs[0]();

    if (img == null || !img.entity.visible) {
      return;
    }

    if (this._imgTrans == null || this._img !== img) {
      this._imgTrans = img.entity.getComponent('IFTransform2d');
      this._img = img;
    }

    const canvas = this._findComponentInParent(this._imgTrans.parent, 'IFCanvas2d');
    if (canvas == null) {
      return;
    }

    const layer = canvas.entity.layer;
    const entities = sys.scene.entities;
    for (let i = 0; i < entities.size(); i++) {
      const cams = entities.get(i).getComponents('Camera');
      for (let j = 0; j < cams.size(); ++j) {
        const cam = cams.get(j);
        if (!cam.isLayerVisible(layer) || !cam.entity.visible) {
          continue;
        }

        const isValidTap = this._setupData(this._imgTrans, cam);

        if (!isValidTap) {
          continue;
        }

        const isImgTapped = this._isImgTapped(cam);

        if (isImgTapped) {
          this.outputs[1] = true;
          if(this.nexts[0] != null)
          {
            this.nexts[0](); //on tapped event 
          }
          return; //early out if we get a tap
        }
      }
    }
  }

  _isImgTapped(cam) {
    const imgPos = this._imgTrans.worldPosition;
    const worldToLocal = this._imgTrans.getWorldMatrix().invert_Full();
    let localTapPoint = cam.viewportToWorldPoint(this._fixedTapPos);
    localTapPoint.z = imgPos.z; //currently in world space
    localTapPoint = worldToLocal.multiplyPoint3(localTapPoint); //now in image local space

    const imgPosViewSpace = cam.worldToViewportPoint(imgPos);
    //can do AABB test even with rotations since the point is in the image's local space
    const isInQuad = this._isInAABB(localTapPoint, this._min, this._max);
    const isInView = this._inViewPlanes(cam, imgPosViewSpace.z);

    return isInQuad && isInView;
  }

  _isInAABB(point, min, max) {
    return point.x > min.x && point.x < max.x &&
           point.y > min.y && point.y < max.y;
  }

  //sets up the corner points and adjusts the tap position to account for viewport adjustments
  _setupData(trans, cam) {
    const viewport = cam.viewport;
    if (!this._isInRect(this._tapPos, viewport)) {
      return false;
    }

    //correct for viewport adjustments
    //remaps the tapposition to be normalized screen coords to in actual camera's viewport
    this._fixedTapPos.set(
      this._inverseLerp(this._tapPos.x, viewport.x, viewport.x + viewport.width),
      this._inverseLerp(this._tapPos.y, viewport.y, viewport.y + viewport.height),
      0
    );

    const pixelWidth = cam.renderTexture.width;
    const pixelHeight = cam.renderTexture.height;

    const adjWidth = Math.min(viewport.width, 1 - viewport.x);
    const adjHeight = Math.min(viewport.height, 1 - viewport.y);

    //weird math to account for viewport adjustments and to create a vector that goes from the center of the screen to trans.size/2.
    //we can't just use screentoworldpoint(trans.size/2) since that is for points and this is a vector.
    let halfsize = new Amaz.Vector3f(
      (pixelWidth + trans.size.x) * (0.5 * adjWidth) + viewport.x * pixelWidth,
      (pixelHeight + trans.size.y) * (0.5 * adjHeight) + viewport.y * pixelHeight,
      0
    );
    halfsize = cam.screenToWorldPoint(halfsize);
    halfsize = halfsize.mul(1.0 / cam.orthoScale); //I dont know why I nzeed to do this, screentoworldpoint should take care of this
    halfsize.set(Math.abs(halfsize.x), Math.abs(halfsize.y), 0);

    //calculate the min max in the Img's localspace
    this._min.set(-halfsize.x, -halfsize.y, 0);
    this._max.set(halfsize.x, halfsize.y, 0);

    return true;
  }

  _mulv3(a, b) {
    return new Amaz.Vector3f(a.x * b.x, a.y * b.y, a.z * b.z);
  }

  //only need to check if you are in between the near and far plane
  //and let inAABB take care of the other bounds
  _inViewPlanes(cam, d) {
    return d >= cam.zNear && d < cam.zFar;
  }

  _isInRect(point, rect) {
    return point.x > rect.x && point.x < rect.x + rect.width &&
           point.y > rect.y && point.y < rect.y + rect.height;
  }

  _inverseLerp(v, a, b) {
    if (a === b) {
      return 0;
    }

    return this._clamp01((v - a) / (b - a));
  }

  _findComponentInParent(trans, compName)
  {
    let comp = null;
    while (trans != null && comp == null) {
      comp = trans.entity.getComponent(compName);
      trans = trans.parent;
    }

    return comp;
  }
}

exports.CGImageTap = CGImageTap;
