import {
    Entity,
    Graphics,
    Cartesian3,
    Color,
    GeoJsonDataSource,
    Geokey3DTileset,
    CMath,
    HeadingPitchRange,
    Matrix4,
    BoundingSphere,

} from "geokey-gis";
import sphereData from "./point.json"
import hlj from "./hlj.json"
import GeoTransform from "geotransform";
export function loadSphere() {
    let a = epsg2lonlat(114.21357539373112, 22.6969708136255)
    window.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(114.21357539373112, 22.6969708136255, 30.44),
        duration:1
    })

    for (let i = 0; i < sphereData.length; i++) {
        const redSphere = window.viewer.entities.add({
            position: Cartesian3.fromDegrees(sphereData[i][0], sphereData[i][1], sphereData[i][2]),
            ellipsoid: {
                radii: new Cartesian3(2.5, 2.5, 2.5),
                material: Color.YELLOW,
            },
        });
    }

}
export function loadShp2(){
    let promise = GeoJsonDataSource.load(hlj, {
      fill: Color.PINK,
      clampToGround:true
    })
    promise.then((dataSource)=>{
      window.viewer.dataSources.add(dataSource);
      window.viewer.zoomTo(dataSource)
      let entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
              let entity = entities[i];
            //   let color = entity.properties.color._value;
            //   entity.polygon.material = Color.fromCssColorString(color);
          }
  })
}
export function epsg2lonlat(lon, lat) {
    let gt = new GeoTransform();
    let coords = [lon, lat];
    let transCoords = gt.transform("EPSG:4326", "EPSG:3857", coords);
    return transCoords;
}