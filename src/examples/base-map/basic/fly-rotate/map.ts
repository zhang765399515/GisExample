import { Cartesian3 } from "geokey-gis";

let i: any = Date.now();

export function closeRatation() {
  window.viewer.clock.onTick.removeEventListener(rotate);
}

export function widgetsFlyRotation() {
  window.viewer.clock.onTick.addEventListener(rotate);
}

function rotate() {
  let a = 0.1;
  let t = Date.now();
  let n = (t - i) / 1e3;
  i = t;
  window.viewer.scene.camera.rotate(Cartesian3.UNIT_Z, -a * n);
}
