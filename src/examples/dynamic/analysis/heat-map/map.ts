import {
  GeoGraphicsLayer,
  Graphic,
  HeatmapImageryProvider
} from 'geokey-gis';
import data from '@/assets/data/xinglinshuj.json'

export function loadHotMap() {
  let heatmap: any;
  let test = function () {
    let height = window.viewer.camera.positionCartographic.height;
    let radius = height / 100000;
    if (radius === 0) {
      return;
    } else {
      setHeatMap(radius * 2);
    }
  };

  let layer = new GeoGraphicsLayer({
    id: 'layer1'
  });
  window.viewer.map.add(layer);
  let min = data[0].value,
    max = min;
  for (let len = 0; len < data.length; len++) {
    let l = data[len].value;
    l < min && (min = l), max < l && (max = l);
  }
  let maxData = max;
  let minData = min;
  let allData = data;
  let bounds = {
    west: 103.28643664,
    east: 111.204377043478,
    south: 27.163693565,
    north: 33.203430325
  };

  setHeatMap(24);

  for (let i = 0, len = data.length; i < len; i += 8) {
    let cylinderPoint = {
      type: 'point', //autocasts as new Point()
      longitude: data[i].x,
      latitude: data[i].y,
      height: 0
    };
    let color;
    if (data[i].value >= 1 && data[i].value <= 12738) {
      color = '#00FF00';
    } else if (data[i].value > 12738 && data[i].value <= 25476) {
      color = '#0000FF';
    } else if (data[i].value > 25476 && data[i].value <= 38214) {
      color = 'yellow';
    } else if (data[i].value > 38214 && data[i].value <= 50952) {
      color = 'orange';
    } else if (data[i].value > 50951 && data[i].value <= 63690) {
      color = 'red';
    }
    let cylinderSymbol = {
      type: 'point-3d', //autocasts as new PointSymbol3D()
      style: {
        type: 'cylinder',
        height: data[i].value,
        width: 100,
        color: color,
        outline: false //默认为false
      }
    };

    let cylinderGraphic = new Graphic({
      geometry: cylinderPoint,
      symbol: cylinderSymbol
    });
    layer.add(cylinderGraphic);
  }

  function setHeatMap(radius: number) {
    heatmap && window.viewer.imageryLayers.remove(heatmap);
    let heatProvider = new HeatmapImageryProvider({
      data: {
        min: minData,
        max: maxData,
        points: allData
      },
      heatmapoptions: {
        radius: radius,
        gradient: {
          0.8: 'rgb(0,0,255)',
          0.85: 'rgb(0,255,0)',
          0.9: 'yellow',
          1: 'rgb(255,0,0)'
        }
      },
      bounds: bounds
    });
    heatmap = window.viewer.imageryLayers.addImageryProvider(heatProvider);
  }
}
