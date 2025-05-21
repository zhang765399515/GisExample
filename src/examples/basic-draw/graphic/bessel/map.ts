import { Graphic, GeoGraphicsLayer, Cartesian3 } from "geokey-gis";
import * as turf from '@turf/turf';

export function widgetsBezierSpline() {
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(106.60926039262215, 29.51713147487907, 65000)
  });

  const layer = new GeoGraphicsLayer({
    id: 'bessel-layer'
  });
  window.viewer.map.add(layer);

  const allPoints = [
    [106.75833794440615, 29.632188592776643],
    [106.65394818950097, 29.658362289315146],
    [106.57360221766014, 29.60319328348005],
    [106.60926039262215, 29.51713147487907],
    [106.51397421037518, 29.463425982788795],
    [106.42644499103791, 29.547930297370478],
    [106.35585495625318, 29.458090935030473]
  ];

  //普通线
  const lineGeo = {
    type: 'polyline',
    paths: allPoints,
    disableDepthTestDistance: 5000000000
  };
  const lineSymbol = {
    type: 'simple-line',
    width: 10,
    style: {
      color: 'yellow'
    },
    disableDepthTestDistance: 50000000000
  };
  const lineGraphic = new Graphic({
    geometry: lineGeo,
    symbol: lineSymbol
  });
  layer.add(lineGraphic);

  const line = turf.lineString(allPoints);

  const curved = turf.bezierSpline(line); // 生成曲线坐标

  const lineGeo1 = {
    type: 'polyline', //autocasts as new Polyline
    paths: curved.geometry.coordinates
  };
  const lineSymbol1 = {
    type: 'simple-line', //autocasts as new SimpleLineSymbol()
    width: 10,
    style: {
      color: '#ff0000'
    }
  };
  const lineGraphic1 = new Graphic({
    geometry: lineGeo1,
    symbol: lineSymbol1
  });
  layer.add(lineGraphic1);
}
