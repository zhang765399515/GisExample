import { Color, Cartesian3, Entity, EventDriven } from 'geokey-gis';

let pointPosition = undefined;
export const pointEntityArr: Entity[] = [];

let lineArr = [];

export function loadEntityPoint() {
  const handler = new EventDriven(window.viewer);
  handler.addEvent('LEFT_CLICK', (e: any) => {
    if (e.cartesian) {
      // addPoint(e.cartesian);
      lineArr.push(e.cartesian);

      if (lineArr.length > 1) {
        addLine();
      }
    }
  });

  handler.addEvent('RIGHT_CLICK', (e: any) => {
    handler.removeEvent('LEFT_CLICK');
  });

  window.viewer.scene.renderError.addEventListener((scene, error) => {
    if (error) {
      console.log('error: ', error);
    }
  });
}

function addLine() {
  window.viewer.scene.globe.depthTestAgainstTerrain = false;
  const lineEntity = window.viewer.entities.add({
    name: 'point',
    polyline: {
      positions: lineArr,
      material: Color.fromCssColorString('#67F708'),
      width: 4,
      clampToGround: true
    }
  });
}

function addPoint(position: Cartesian3) {
  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  const pointEntity = window.viewer.entities.add({
    name: 'point',
    position: position,
    point: {
      color: Color.fromCssColorString('#67F708'),
      pixelSize: 4,
      outlineColor: Color.fromCssColorString('#67F708'),
      outlineWidth: 1,
      disableDepthTestDistance: 5000000
    },
    label: {
      text: '测试'
    }
  });
  pointEntityArr.push(pointEntity);
  window.viewer.scene.globe.depthTestAgainstTerrain = false;
}

function editPoint() {}
