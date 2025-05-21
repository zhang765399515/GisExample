import {
  GeokeyTerrainProvider,
  WebMapServiceImageryProvider,
  ColorGeometryInstanceAttribute,
  Geokey3DTileset,
  PolygonGeometry,
  PolygonHierarchy,
  Cartesian3,
  GroundPrimitive,
  GeometryInstance,
  PerInstanceColorAppearance,
  Material,
  Color,
  ClassificationType,
  GeoJsonDataSource,
} from "geokey-gis"
//  import polygonData from "./20240614_061417_481.json"
import polygonData from "./20240614_141442_449_4m.json"
export async function load3dtiles() {
  const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=chengdu_dem');
  window.viewer.terrainProvider = elevationLayer;

  const tile = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=SC_ljyxjckc2312088_b3dm')
  window.viewer.scene.primitives.add(tile);
  window.viewer.zoomTo(tile);
}
export function loadShp2() {
  let promise = GeoJsonDataSource.load(polygonData, {
    fill: Color.PINK,
    clampToGround: true
  })
  promise.then((dataSource) => {
    window.viewer.dataSources.add(dataSource);
    let entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (entity.properties && entity.polygon) {
        let color = entity.properties.color._value;
        entity.polygon.material = Color.fromCssColorString(color);
      }
    }
  })
}
/**
 * 
 * @param polygonData 绘制面的数据
 * @param name 名称
 */
export function loadShp(polygonData: any, name: string) {
  let instances: any[] = [];
  console.log('name：polygonData.features', polygonData.features);
  polygonData.features.forEach(e => {
    let properties = e.properties;
    if (e.geometry.type == "Polygon") {
      let coordinates = e.geometry.coordinates[0];
      let polygonList = [];
      coordinates.forEach(_c => {
        polygonList.push(_c[0], _c[1])
      })
      instances.push(onePolygon(polygonList, properties));
    } else if (e.geometry.type == "MultiPolygon") {
      let coordinatesArr = e.geometry.coordinates;
      coordinatesArr.forEach(coord => {
        let coordinates = coord[0];
        let polygonList = [];
        coordinates.forEach(_c => {
          polygonList.push(_c[0], _c[1])
        })
        instances.push(onePolygon(polygonList, properties));
      })
    }
  })
  drawPolygon(instances, name);
}
/**
 * 
 * @param data 一个面的数据集合
 * @param type 根据类别设置颜色
 * @returns 
 */
export function onePolygon(data, properties) {
  let instance = new GeometryInstance({
    geometry: new PolygonGeometry({
      polygonHierarchy: new PolygonHierarchy(
        Cartesian3.fromDegreesArray(data)
      ),
    }),
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(properties.color))
    }
  })
  instance.id = properties;
  return instance
}
/**
 * 
 * @param instances 所有面的集合
 * @param name 集合名称
 */
export function drawPolygon(instances, name) {
  const geometry = new GroundPrimitive({
    geometryInstances: instances,
    appearance: new PerInstanceColorAppearance({
      flat: false,
      faceForward: true,
      translucent: false //是否半透明
    }),
    classificationType: ClassificationType.BOTH
  });
  let primitive = window.viewer.scene.primitives.add(geometry);
  primitive.name = name
}
/**
 * 
 * @param name 名称
 */
export function removeShp(name) {
  const primitives = window.viewer.scene.primitives._primitives;
  for (let i = primitives.length - 1; i >= 0; i--) {
    if (primitives[i].name == name) {
      window.viewer.scene.primitives.remove(primitives[i])
    }
  }
}
