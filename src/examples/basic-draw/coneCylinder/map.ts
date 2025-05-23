import { 
    Entity,
    Cartesian3,
    Color,
    CylinderGraphics,
    HeightReference,
    defaultValue,
    ColorMaterialProperty,
    CallbackProperty,
} from "geokey-gis";

export function createConeCylinder(options){
  if (options && options.position) {
    window.viewer.camera.flyTo({
      "destination": {
          "x": -2393516.801854312,
          "y": 5386381.258090659,
          "z": 2429612.736655257
      },
      "orientation": {
          "heading": 0.022936639534928638,
          "pitch": -0.8128745033016198,
          "roll": 0.000008284799254631992
      },
      "duration": 1
  })
    var cylinderEntity = new Entity(),
    alp = options.alp || 1,
    flog = options.flog || true;
    cylinderEntity.position = Cartesian3.fromDegrees(options.position.lng,options.position.lat,options.position.alt);
    cylinderEntity.cylinder = getCylinderGraphics(options);
    return window.viewer.entities.add(cylinderEntity)
  }
}
function getCylinderGraphics(options) {
  options = options || {}
  if (options) {
    return new CylinderGraphics({
      length: options.length || 500 / 2,
      topRadius: options.topRadius || 0,
      bottomRadius: options.bottomRadius || 0,
      material: options.material || Color.fromCssColorString('#02ff00'),
      slices: options.slices || 128,
      HeightReference: HeightReference.RELATIVE_TO_GROUND,
    })
  }
}