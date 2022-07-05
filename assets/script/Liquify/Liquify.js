const Amaz = effect.Amaz;

const LiquifyAreaMap = new Map([
  ['Full', new Amaz.Vector2f(0.0, 0.0)],
  ['Left', new Amaz.Vector2f(-1.0, 0.0)],
  ['Right', new Amaz.Vector2f(1.0, 0.0)],
  ['Up', new Amaz.Vector2f(0.0, 1.0)],
  ['Down', new Amaz.Vector2f(0.0, -1.0)],
]);

class Liquify {
  constructor() {
    this.name = 'Liquify';
  }
  onStart() {
    this.renderer = this.entity.getComponent('MeshRenderer');
  }
  /*
   * @return this attached component, since this property does not exist for JS Scripts
   */
  component() {
    const jsScriptComps = this.entity.getComponents('JSScriptComponent');
    for (let i = 0; i < jsScriptComps.size(); i++) {
      const comp = jsScriptComps.get(i);
      const className = comp.getScript().className;
      if (className === this.script.className) {
        return comp;
      }
    }
  }

  onUpdate(dt) {
    const componentProperties = this.component().properties;

    const radius = componentProperties.get("radius")
    const intensityX = componentProperties.get("intensityX")
    const intensityY = componentProperties.get("intensityY")
    const area = componentProperties.get("area")

    // console.warn("Liquify radius: ", radius.toString());
    // console.warn("Liquify intensityX: ", intensityX.toString());
    // console.warn("Liquify intensityY:", intensityY.toString());
    // console.warn("Liquify area:", area.toString());

    if (this.renderer && this.renderer.material)
    {
        this.renderer.material.setFloat("radius", radius);
        this.renderer.material.setVec2("intensity", new Amaz.Vector2f(intensityX, intensityY));
        this.renderer.material.setVec2("signFlag", LiquifyAreaMap.get(area));
        this.renderer.material.disableMacro("AE_LIQUIFYBACKGROUND");
    }
  }

  onEnable() {
    if (this.renderer !== null && this.renderer !== undefined) {
      this.renderer.enabled = true;
    }
  }

  onDisable() {
    if (this.renderer !== null && this.renderer !== undefined) {
      this.renderer.enabled = false;
    }
  }

  onLateUpdate(dt) { }
}
exports.Liquify = Liquify;