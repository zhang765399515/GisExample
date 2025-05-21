import { GeoElevationLayer } from "geokey-gis";

export function loadElevationLayer() {
  let elevationLayer = new GeoElevationLayer({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=lh_tif',
    id: 'dem'
  });

  console.log(elevationLayer);

  window.viewer.map.ground.layer.add(elevationLayer);
}
