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
          "destination": {
              "x": -2393424.5295229442,
              "y": 5389131.390549494,
              "z": 2428211.251238909
          },
          "orientation": {
              "heading": 5.4437785697502346,
              "pitch": -0.456361774659237,
              "roll": 0.000058801080728976274
          },
          "duration": 1
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