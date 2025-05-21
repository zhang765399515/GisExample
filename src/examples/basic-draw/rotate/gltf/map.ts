import { 
    Entity,
    ImageMaterialProperty,
    CallbackProperty,
    Cartesian3,
    Transforms,
    HeadingPitchRoll,
    CMath,
    Color,
    ModelGraphics
} from "geokey-gis";
export function createModel(options){
  if (options && options.position) {
    window.viewer.camera.flyTo({
      destination:Cartesian3.fromDegrees(options.position.lng,options.position.lat,5000)
  })
    var entity = new Entity();
    entity.model = new ModelGraphics({
      uri:options.url,
      scale:options.scale || 1,
      minimumPixelSize: options.minimumPixelSize || 10,
      color: options.color || Color.WHITE
    })
    entity.position = Cartesian3.fromDegrees(options.position.lng,options.position.lat,options.position.alt)
    return window.viewer.entities.add(entity)
  }

}
/**
 * 左右旋转
 * @param options 
 */
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
/**
 * 上下移动
 * @param options 
 */
export function setGraphicsFloat(options) {
  if (options && options.entity && options.maxHeight) {
    try {
      var entity = options.entity,
        minHeight = options.minHeight || 5,
        maxHeight = options.maxHeight || 100,
        _position = options.position,
        speed = options.speed || 0.06,
        bg_minHeight = minHeight,
        flag = false;
        entity.position = new CallbackProperty(function () {
          if (minHeight >= maxHeight || minHeight <= bg_minHeight) {
            flag = !flag
          }
          flag ? minHeight += speed : minHeight -= speed
          _position.alt = minHeight
          return Cartesian3.fromDegrees(_position.lng,_position.lat,_position.alt)
        }, false)
    } catch (error) {
      console.log(error)
    }

  }
}