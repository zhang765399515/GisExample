import { Graphic, GeoGraphicsLayer, GeoPolyline, SimpleLineSymbol } from "geokey-gis";

export function loadPolylineGraphics() {
  let layer = new GeoGraphicsLayer({
    id: 'layer2'
  });
  window.viewer.map.add(layer);

  //普通线
  let lineGeo = new GeoPolyline({
    paths: [
      [106.654321, 30.91006341, 10],
      [106.654321, 35.91006341, 10]
    ]
  });
  let lineSymbol = new SimpleLineSymbol({
    width: 10,
    style: {
      color: '#00ffff'
    }
  });
  let lineGraphic = new Graphic({
    geometry: lineGeo,
    symbol: lineSymbol
  });
  layer.add(lineGraphic);

  //虚线——1
  let lineGeo1 = {
    type: 'polyline', //autocasts as new Polyline
    paths: [
      [106.654321 + 0.3, 30.91006341, 10],
      [106.654321 + 0.3, 35.91006341, 10]
    ]
  };
  let lineSymbol1 = {
    type: 'simple-line', //autocasts as new SimpleLineSymbol()
    width: 10,
    style: {
      type: 'line-dash',
      color: '#00ffff',
      dashLength: 30 // 间距
    }
  };
  let lineGraphic1 = new Graphic({
    geometry: lineGeo1,
    symbol: lineSymbol1
  });
  layer.add(lineGraphic1);

  //虚线——2
  let lineGeo2 = {
    type: 'polyline', //autocasts as new Polyline
    paths: [
      [106.654321 + 0.6, 30.91006341, 10],
      [106.654321 + 0.6, 35.91006341, 10]
    ]
  };
  let lineSymbol2 = {
    type: 'simple-line', //autocasts as new SimpleLineSymbol()
    width: 10,
    style: {
      type: 'line-dash',
      color: '#00ffff',
      dashLength: 30,
      gapColor: { r: 46, g: 51, b: 254, a: 1 } // 间隔颜色
    }
  };
  let lineGraphic2 = new Graphic({
    geometry: lineGeo2,
    symbol: lineSymbol2
  });
  layer.add(lineGraphic2);

  //带有外边线的直线  line-outline
  let lineGeo3 = {
    type: 'polyline', //autocasts as new Polyline
    paths: [
      [106.654321 + 0.9, 30.91006341, 5000],
      [106.654321 + 0.9, 35.91006341, 5000]
    ]
  };
  let lineSymbol3 = {
    type: 'simple-line', //autocasts as new SimpleLineSymbol()
    width: 10,
    style: {
      type: 'line-outline',
      color: { r: 46, g: 51, b: 254, a: 1 },
      outlineWidth: 5,
      outlineColor: '#00ffff'
    }
  };
  let lineGraphic3 = new Graphic({
    geometry: lineGeo3,
    symbol: lineSymbol3
  });
  layer.add(lineGraphic3);

  //带箭头的直线 line-arrow
  let lineGeo4 = {
    type: 'polyline', //autocasts as new Polyline
    paths: [
      [106.654321 + 1.2, 30.91006341, 5000],
      [106.654321 + 1.2, 35.91006341, 5000]
    ]
  };
  let lineSymbol4 = {
    type: 'simple-line', //autocasts as new SimpleLineSymbol()
    width: 50,
    followSurface: false, //默认为true
    style: {
      type: 'line-arrow',
      color: { r: 46, g: 51, b: 254, a: 1 }
    }
  };
  let lineGraphic4 = new Graphic({
    geometry: lineGeo4,
    symbol: lineSymbol4
  });
  layer.add(lineGraphic4);

  //外发光 line-glow
  let lineGeo5 = {
    type: 'polyline', //autocasts as new Polyline
    paths: [
      [106.654321 + 1.5, 30.91006341, 5000],
      [106.654321 + 1.5, 35.91006341, 5000]
    ]
  };
  let lineSymbol5 = {
    type: 'simple-line', //autocasts as new SimpleLineSymbol()
    width: 10,
    followSurface: false, //默认为true
    style: {
      type: 'line-glow',
      glowPower: 0.3, //发光力
      color: '#88fa2a'
    }
  };
  let lineGraphic5 = new Graphic({
    geometry: lineGeo5,
    symbol: lineSymbol5
  });
  layer.add(lineGraphic5);

  window.viewer.goTo({
    center: [106.754321, 34.31006341, 1000000]
  });
}
