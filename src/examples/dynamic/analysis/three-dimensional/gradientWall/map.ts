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

export function createDynamicShadeWallGraphics(options) {

    if (options && options.positions) {
        window.viewer.camera.flyTo({
          destination:Cartesian3.fromDegrees(113.928684, 22.555127,5000)
      })

      var alp = options.alp || 1,
        num = options.num || 20,
        color = options.color || Color.YELLOW,
        speed = options.speed || 0.003;

      var wallEntity = new Entity();
      wallEntity.wall = {
        positions: Cartesian3.fromDegreesArrayHeights(options.positions),
        material: new ImageMaterialProperty({
          image: options.img||'image/Textures/fence.png',
          transparent: true,
          color: new CallbackProperty(function () {

            if ((num % 2) === 0) {
              alp -= speed
            } else {
              alp += speed
            }

            if (alp <= 0.1) {
              num++
            } else if (alp >= 1) {
              num++
            }
            return color.withAlpha(alp)
          }, false)
        })
      }
      return window.viewer.entities.add(wallEntity)
    }
  }