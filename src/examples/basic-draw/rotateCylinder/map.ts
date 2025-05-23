import { 
    Entity,
    CallbackProperty,
    Cartesian3,
    Color,
    ColorMaterialProperty,
    HeightReference,
    ImageMaterialProperty,
    Transforms,
    HeadingPitchRoll,
    CMath
} from "geokey-gis";

export function createRotateCylinder(options){
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
    var cylinderEntity = new Entity();
    cylinderEntity.cylinder = {
      HeightReference: HeightReference.RELATIVE_TO_GROUND,
      length: options.length || 100,
      topRadius: options.topRadius || 10,
      bottomRadius: options.bottomRadius || 10,
      material: options.material || new ImageMaterialProperty({
        image: options.img ||'image/Textures/cc1.jpg',
        transparent: true,
        repeat: {
          x: 1,
          y: 1
        }

      }),
      slices: options.slices || 128
    }
    cylinderEntity.position = Cartesian3.fromDegrees(options.position.lng,options.position.lat,options.position.alt);
    return window.viewer.entities.add(cylinderEntity)
  }
}
export function setGraphicsRotate(options) {
  if (options && options.entity && options.rotateAmount) {
    var entity = options.entity,
      rotateAmount = options.rotateAmount,
      _position = options.position;
    _position.heading = 0, _position.pitch = 0, _position.roll = 0
    entity.orientation = new CallbackProperty(function () {
      if (rotateAmount > 0) {
        _position.heading += rotateAmount
        if (_position.heading === 360) {
          _position.heading = 0
        }
      }
      return Transforms.headingPitchRollQuaternion(
        Cartesian3.fromDegrees(options.position.lng,options.position.lat,options.position.alt),
        new HeadingPitchRoll(
          CMath.toRadians(_position.heading),
          CMath.toRadians(_position.pitch),
          CMath.toRadians(_position.roll)
        )
      )
    }, false)
  }
}