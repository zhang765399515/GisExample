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
    CMath,
    CircleSpiralMaterialProperty
} from "geokey-gis";

export function load(){
  window.viewer.entities.add({
    position: Cartesian3.fromDegrees(114, 23),
    ellipse: {
      semiMajorAxis: 10000.0,
      semiMinorAxis: 10000.0,
      material: new CircleSpiralMaterialProperty({
        color: Color.fromCssColorString("#00ffec"),
        speed: 10.0,
      }),
    },
  });
  window.viewer.zoomTo(window.viewer.entities);
}