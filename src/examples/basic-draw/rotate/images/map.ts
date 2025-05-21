import { 
    Entity,
    ImageMaterialProperty,
    CallbackProperty,
    Cartesian3,
    Transforms,
    HeadingPitchRoll,
    CMath,
    Color,

} from "geokey-gis";
export function craeteDynamicCricleGraphics(options){
    if (options && options.center) {
      var entity = new Entity(),
        $this = this,
        _center = options.center,
        _radius = options.radius || 800,
        _rotateAmount = options.rotateAmount || 0.03,//控制速度
        _stRotation = 0,
        _height = options.height || 1,
        heading = 0,
        pitch = 0,
        roll = 0,
        _scale = options.scale || null,
        _scale2 = options.scale2 || null,
        _material = options.material || new ImageMaterialProperty({
          image: options.imge ||'image/Textures/bg_circle.png',
          transparent: true
        })

        window.viewer.camera.flyTo({
            destination:Cartesian3.fromDegrees(_center.lng,_center.lat,5000)
        })
      entity.position = new CallbackProperty(function () {

        return Cartesian3.fromDegrees(_center.lng,_center.lat,_center.alt)
      }, false)

      entity.orientation = new CallbackProperty(function () {

        return Transforms.headingPitchRollQuaternion(
            Cartesian3.fromDegrees(_center.lng,_center.lat,_center.alt),
            new HeadingPitchRoll(
                CMath.toRadians(heading),
                CMath.toRadians(pitch),
                CMath.toRadians(roll)
            )
        )
      }, false)
      let bg_scale = _radius,
        flag = false
      var updateScalerAxis = () => {
        if (_radius >= _scale || _radius <= bg_scale) {
          flag = !flag
        }
        flag ? _radius += 2 : _radius -= 2
      }
      var updateScalerAxis2 = () => {

        _scale2 >= _radius ? _radius += 2 : _radius = bg_scale
      }
      entity.ellipse = {
        material: _material,
        height: _height,
        semiMajorAxis: new CallbackProperty(function () {
          return _radius
        }, false),
        semiMinorAxis: new CallbackProperty(function () {
          return _radius
        }, false),
        stRotation: new CallbackProperty(function () {
          if (_rotateAmount > 0) {
            _stRotation += _rotateAmount
            if (_stRotation >= 360) {
              _stRotation = 0
            }
          }
          if (_scale) updateScalerAxis()
          if (_scale2) updateScalerAxis2()
          return _stRotation
        }, false)
      }
      return window.viewer.entities.add(entity)
    }
}
