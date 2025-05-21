import { ArcType, CMath, Color, Cartesian2, HeightReference, Cartesian3, Entity, GeoJsonDataSource, PolylineArrowMaterialProperty, NearFarScalar, UnderGround } from "geokey-gis";

import data from '@/assets/data/holeModel.json';

export function openUnderground(enable: any) {
  window.viewer.surfacePierce.enable = enable;
}

export function loadUnderground3D() {
  window.viewer.scene.globe.depthTestAgainstTerrain = true;

  const linesData = GeoJsonDataSource.load('http://219.151.151.45:10250/sxdzjm/MapData/geojsonnew/test.json');

  linesData.then(function (dataSource: any) {
    let myLine = dataSource.entities.values;
    myLine.forEach((entity: Entity) => {
      if (entity.billboard) {
        entity.billboard = undefined;
        entity.point = {
          color: Color.CHARTREUSE.withAlpha(1),
          pixelSize: 10,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          outlineColor: Color.WHITE,
          outlineWidth: 1
        } as any;
      }
    });
    window.viewer.dataSources.add(dataSource);
    for (let i = 1000; i < 2200; i++) {
      const position = myLine[i]._polyline._positions._value;
      let greenBox = window.viewer.entities.add({
        name: 'guanwang',
        polylineVolume: {
          positions: position,
          shape: computeCircle(2.0),
          material: Color.LIGHTBLUE.withAlpha(0.3)
        }
      });
    }
  });

  const data1 = [
    [114.06146759048094, 22.624553933219982, -30],
    [114.06138898020407, 22.624464555722298, -30],
    [114.06130159969356, 22.624362092450315, -30],
    [114.06121434834115, 22.624251552195773, -30],
    [114.06112726129648, 22.62415601641793, -30],
    [114.06104562498409, 22.62406062481803, -30],
    [114.06095880382607, 22.623952250696373, -30],
    [114.06086151808455, 22.623839149052003, -30],
    [114.06077075582416, 22.623747514296203, -30]
  ];
  const data2 = [
    [114.06037547040808, 22.624975478873406, -30],
    [114.06046030269668, 22.624898537776634, -30],
    [114.06055008416985, 22.62482985127348, -30],
    [114.06063098484006, 22.62475845579864, -30],
    [114.06070456802632, 22.62469681474383, -30],
    [114.06078116577206, 22.624637891588538, -30],
    [114.06087536547564, 22.624556637168013, -30],
    [114.06095928600854, 22.6244851647955, -30],
    [114.06104914410456, 22.62441083838729, -30],
    [114.06113309460491, 22.624339340425173, -30]
  ];
  const data3 = [
    [114.06186968907599, 22.623690468942904, -30],
    [114.0618100345932, 22.623749292716447, -30],
    [114.06172225336395, 22.623821454438087, -30],
    [114.06165656281277, 22.62388488199213, -30],
    [114.06159457879122, 22.623936014746917, -30],
    [114.06152209996331, 22.624000844824646, -30],
    [114.06144899106339, 22.624058676768843, -30],
    [114.0613868915277, 22.62411292891883, -30],
    [114.06131955480207, 22.6241732662277, -30],
    [114.06125824478048, 22.624228338626864, -30]
  ];
  addArrow(data1);
  addArrow(data2);
  addArrow(data3);

  data.map(function (val: any) {
    addEllipse(val.X, val.Y, 0, val.G1 * 3, '#fe9301', 2.32, 0);
    addEllipse(val.X, val.Y, val.G1 * 3, val.G1 * 3 + val.G2 * 3, '#7d7e82', 2.28, 2);
    addEllipse(val.X, val.Y, val.G1 * 3 + val.G2 * 3, val.G1 * 3 + val.G2 * 3 + val.G3 * 3, '#944226', 2.26, 3);
    addEllipse(val.X, val.Y, val.G1 * 3 + val.G2 * 3 + val.G3 * 3, val.G1 * 3 + val.G2 * 3 + val.G3 * 3 + val.G4 * 3, '#1c3959', 2.26, 3);
    addEllipse(val.X, val.Y, val.G1 * 3 + val.G2 * 3 + val.G3 * 3 + val.G4 * 3, val.G1 * 3 + val.G2 * 3 + val.G3 * 3 + val.G4 * 3 + val.G5 * 3, '#915d13', 2.22, 5);
  });

  function addArrow(data: number[][]) {
    for (var m = 0; m < data.length; m += 2) {
      if (m === data.length - 1) {
        break;
      }
      var a2 = [data[m], data[m + 1]].flat();
      var line2 = window.viewer.entities.add({
        name: 'lineArrow',
        polyline: {
          positions: Cartesian3.fromDegreesArrayHeights(a2),
          width: 13,
          arcType: ArcType.NONE,
          material: new PolylineArrowMaterialProperty(Color.BLUE)
        }
      });
    }
    for (var n = 1; n < data.length; n += 2) {
      if (n === data.length - 1) {
        break;
      }
      var a3 = [data[n], data[n + 1]].flat();
      var line3 = window.viewer.entities.add({
        name: 'lineArrow',
        polyline: {
          positions: Cartesian3.fromDegreesArrayHeights(a3),
          width: 13,
          arcType: ArcType.NONE,
          material: new PolylineArrowMaterialProperty(Color.BLUE)
        }
      });
    }
  }

  function addEllipse(x: number, y: number, z: number, h: number, color: string, width: number, index: number) {
    if (h === 0) {
      return;
    }
    //height 相对于椭圆表面的高度，extrudedHeight相对于椭圆表面的拉伸，所以要在拉伸高度是基于height的，在height的基础上进行拉伸
    window.viewer.entities.add({
      position: Cartesian3.fromDegrees(x, y),
      name: 'dixiazuankong' + h,
      ellipse: {
        semiMinorAxis: width,
        semiMajorAxis: width,
        height: z,
        extrudedHeight: h,
        material: Color.fromCssColorString(color)
      }
    });
  }

  function computeCircle(radius: number) {
    let positions = [];
    for (let i = 0; i < 360; i++) {
      let radians = CMath.toRadians(i);
      positions.push(new Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
  }

  window.viewer.goTo({
    center: [114.235, 22.693722, 1000],
    pitch: -30
  });
}

export function toggleSurface(value: any) {
  window.viewer.surfacePierce.alpha = value
}
