import {
  Color,
  Cartesian3,
  EventDriven,
  PropertyBag,
  primitiveSymbol,
  PolygonHierarchy,
  sectorPointUtils
} from 'geokey-gis';

let ranges: any[] = [];
let rangesData: any[] = [];
let firstPoint: any;
let myPrimitive: any;
let clickDraw: EventDriven | null = null;
let circularDraw: EventDriven | null = null;
let stopClickDraw: EventDriven | null = null;

export function drawAny() {
  window.viewer.scene.globe.depthTestAgainstTerrain = false; //开启坐标深度拾取
  clickDraw = new EventDriven(window.viewer);
  clickDraw.addEvent('LEFT_CLICK', (e: any) => {
    // 储存第一个点位置信息
    firstPoint = e.mapPoint;

    rangesData.push({
      longitude: e.mapPoint.longitude,
      latitude: e.mapPoint.latitude,
      height: e.mapPoint.height
    });

    ranges.push(e.mapPoint.longitude, e.mapPoint.latitude);

    // myPrimitive && window.viewer.map.remove(myPrimitive); //当myPrimitive存在时，移除myPrimitive

    let length = ranges.length / 2;

    if (length === 1) {
      myPrimitive = drawPoint({ ranges });
    } else if (length === 2) {
      myPrimitive = drawLine({ ranges, lineWidth: 20, color: 'rgba(255,0,0,0.7)' });
    } else if (length > 2) {
      myPrimitive = drawArea({ ranges, color: 'rgba(255,0,0,0.7)' });
    }
    // myPrimitive && window.viewer.scene.primitives.add(myPrimitive);

    // window.viewer.scene.primitives.add(
    //   new GroundPrimitive({
    //     geometryInstances: rectangleInstance
    //   })
    // );
  });

  // // 右键点击停止绘制事件
  // stopClickDraw = new EventDriven(window.viewer);

  // stopClickDraw.addEvent('right_click', (e: any) => {
  //   rangesData = [];
  //   ranges = [];
  // });

  // stopClickDraw.removeEvent('right_click');
}

/**
 * 绘制点
 * @param options
 * @returns
 */
function drawPoint(options: { color?: string; ranges: number[] }) {
  const pointSymbol = primitiveSymbol({
    type: 'circle',
    center: [options.ranges[0], options.ranges[1]],
    color: options.color ? options.color : 'rgba(255,255,0,0.7)',
    radius: 1,
    class: 'both'
  });
  return pointSymbol;
}

/**
 * 绘制线
 * @param options {
 *  ranges - 位置点集合,
 *  color-线的颜色,
 *  lineWidth - 线宽
 * }
 * @returns
 */
function drawLine(options: { ranges: number[]; color?: string; lineWidth: number }) {
  // const greenCorridor = window.viewer.entities.add({
  //   name: 'Green corridor at height with mitered corners and outline',
  //   corridor: {
  //     positions: Cartesian3.fromDegreesArray(options.ranges),
  //     height: 2.0,
  //     width: 2.0,
  //     cornerType: CornerType.MITERED,
  //     material: Color.GREEN,
  //     outline: true // height required for outlines to display
  //   }
  // });

  // window.viewer.scene.primitives.add(
  //   new GroundPrimitive({
  //     geometryInstances: new GeometryInstance({
  //       geometry: new CorridorGeometry({
  //         positions: Cartesian3.fromDegreesArray(options.ranges),
  //         width: 10.0
  //       }),
  //       attributes: {
  //         color: ColorGeometryInstanceAttribute.fromColor(new Color(0.0, 0.0, 1.0, 0.5))
  //       },
  //       id: 'corridor'
  //     }),
  //     classificationType: ClassificationType.TERRAIN
  //   })
  // );

  // let corridorGeometry = new CorridorGeometry({
  //   positions: Cartesian3.fromDegreesArray(options.ranges),
  //   width: 20.0,
  //   vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT
  // });
  // // Create a geometry instance using the corridor geometry
  // // created above. We can also specify a color attribute,
  // // in this case, we're creating a translucent red color.
  // const redCorridorInstance = new GeometryInstance({
  //   geometry: corridorGeometry,
  //   attributes: {
  //     color: ColorGeometryInstanceAttribute.fromColor(new Color(1.0, 0.0, 0.0, 0.5))
  //   }
  // });
  // // Add the geometry instance to primitives.
  // window.viewer.scene.groundPrimitives.add(
  //   new Primitive({
  //     geometryInstances: redCorridorInstance,
  //     appearance: new PerInstanceColorAppearance({
  //       closed: true
  //     })
  //   })
  // );

  const lineSymbol = primitiveSymbol({
    type: 'line',
    ranges: options.ranges,
    color: 'rgba(255,0,0,0.7)', //红色
    width: options.lineWidth,
    class: 'both'
  });
  window.viewer.scene.primitives.add(lineSymbol)
  return;
  return lineSymbol;
}

/**
 * 绘制面
 * @param options {
 *  ranges - 位置点集合,
 *  color-线的颜色,
 *  lineWidth - 线宽
 * }
 * @returns
 */
function drawArea(options: { ranges: number[]; color?: string }) {
  options.ranges.push(firstPoint.longitude, firstPoint.latitude);
  const areaSymbol = primitiveSymbol({
    id: 'this is polygon' + options.ranges.length,
    ranges: options.ranges,
    color: options.color ? options.color : 'rgba(255,0,0,0.5)',
    class: 'both',
    allowPicking: false
  });
  (areaSymbol as any).name = 'area'; // 绑定name属性，同一名称可绑定在多个primitive上，可通过该属性区分某一类图形

  return areaSymbol;
}

function flattenDeep(longitude: number, latitude: number, radius: number, height = null) {
  let tvn = sectorPointUtils({
    center: [longitude * 1, latitude * 1], //中心坐标
    radius: radius * 1, //半径
    startAngle: 0, //起始角度
    endAngle: 360, //终止角度
    pointNum: 360 //坐标点个数
  });
  if (height != null || height != undefined) {
    tvn.filter((rs: any) => {
      return (rs[2] = height);
    });
    tvn.push(tvn[1]);
  }
  delete tvn[0];
  return tvn.reduce((a: any, b: any) => a.concat(b), []);
}

export function drawCircular(type: string) {
  ranges = [];
  circularDraw = new EventDriven(window.viewer);
  circularDraw.addEvent('LEFT_CLICK', (e: any) => {
    ranges.push(e.mapPoint.longitude, e.mapPoint.latitude);
    let lon = ranges[0];
    let lat = ranges[1];
    let radius = 1000; //圆的半径
    let material = '#DC143C';
    let outline = false;
    let outlinecolor = '#fff';
    let altitude = 200;
    window.viewer.entities.removeAll();
    window.viewer.entities.add({
      id: type,
      name: 'circular',
      polygon: {
        hierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(flattenDeep(ranges[0], ranges[1], radius))),
        material: Color.fromCssColorString(material),
        classificationType: 0 // 支持类型： 0:地形、1:3DTile、2:或者在地面上
      },
      properties: new PropertyBag({
        type,
        lon,
        lat,
        radius,
        altitude,
        material,
        outline,
        outlinecolor
      })
    });
  });
}

export function clearAllDraw() {
  clickDraw?.removeEvent('LEFT_CLICK');
  circularDraw?.removeEvent('LEFT_CLICK');
  stopClickDraw?.removeEvent('right_click');
  ranges = []; // 清空坐标数组
  myPrimitive && window.viewer.map.remove(myPrimitive); //当myPrimitive存在时，移除myPrimitive
  let item = window.viewer.entities.getById('circular');
  item && window.viewer.entities.remove(item);
}
