import { EasingFunction } from "geokey-gis";

let cam: any;
let index: number = 0;
export function widgetsFly() {
  index = 0;
  cam = [
    {
      destination: { x: -2035904.5001483043, y: 5088535.801465344, z: 3251608.071887449 },
      orientation: { heading: 4.841046776496762, pitch: -0.23070355408012553, roll: 0 }
    },
    {
      destination: { x: -2035411.5465197498, y: 5088741.4520483585, z: 3251594.8487136466 },
      orientation: { heading: 4.841046773862214, pitch: -0.23070355507292115, roll: 0 }
    },
    {
      destination: { x: -2035045.325195264, y: 5088894.231447274, z: 3251590.4319712906 },
      orientation: { heading: 4.609394707723581, pitch: -0.2425723413415849, roll: 0 }
    }
  ];
  cam.forEach((item: any) => {
    item.complete = () => {
      index++;
      if (index >= cam.length) {
        return;
      }
      fly();
    };
    item.easingFunction = EasingFunction.LINEAR_NONE;
  });

  fly();
}
function fly() {
  window.viewer.camera.flyTo(cam[index]);
}
