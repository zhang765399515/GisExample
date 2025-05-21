import { 
    Entity,
    CallbackProperty,
    Cartesian3,
    Color,
    ColorMaterialProperty
} from "geokey-gis";

export function createBlinkCircle(options){
    if (options && options.position) {
      window.viewer.camera.flyTo({
        destination:Cartesian3.fromDegrees(options.position.lng,options.position.lat,5000)
    })
        var entity = new Entity(),
          alp = options.alp || 1,
          flog = options.flog || true
        entity.position = Cartesian3.fromDegrees(options.position.lng,options.position.lat,options.position.alt);
        entity.ellipse = {
          semiMinorAxis: options.semiMinorAxis || 200,
          semiMajorAxis: options.semiMajorAxis || 200,
          height: options.height || 10,
          material: new ColorMaterialProperty(new CallbackProperty(function () {
            if (flog) {
              alp = alp - options.speed
              if (alp <= 0) {
                flog = false // hide
              }
            } else {
              alp = alp + options.speed
              if (alp >= 1) {
                flog = true // show
              }
            }
            return Color.fromCssColorString(options.color).withAlpha(alp)
          }, false))
        }
        return window.viewer.entities.add(entity)
      }
}