import {
  Color,
  Cartesian3,
  CallbackProperty,
  PolygonHierarchy,
  CMath,
  ClassificationType,
  ImageMaterialProperty,
  Entity,
  EventDriven,
  BillboardCollection,
  DistanceDisplayCondition,
  NearFarScalar,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Transforms,
  Matrix3,
  Matrix4,
  Ellipsoid,
  GeokeyTerrainProvider
} from 'geokey-gis';
export function load() {
  window.viewer.entities.add({
    polygon: {
      hierarchy: Cartesian3.fromDegreesArray([
        114.0095594025062, 22.584902848696128, 114.0095594025062, 22.56801315104415, 114.0220065974938, 22.58201315104415, 114.0220065974938, 22.584902848696128
      ]),
      material: Color.fromCssColorString('rgba(255,0,0,0.5)'),
      classificationType: 2
    }
  });
}
export function flyTo(lon: number, lat: number) {
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(lon, lat, 8000),
    duration: 0.5
  });
}
