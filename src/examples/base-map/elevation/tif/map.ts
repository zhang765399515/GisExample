import { GeoElevationLayer, Cartesian3 } from "geokey-gis";

export function loadElevationLayer() {
  let elevationLayer = new GeoElevationLayer({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=lh_tif',
    id: 'dem'
  });

  window.viewer.map.ground.layer.add(elevationLayer);
  window.viewer.camera.flyTo({
    "destination": {
      "x": -2409472.7439568853,
      "y": 5381073.087562549,
      "z": 2430591.768481925
    },
    "orientation": {
      "heading": 0.00024044460713312787,
      "pitch": -0.9462604118108913,
      "roll": 0.00001898255343579791
    },
    "duration": 1
  })
}
