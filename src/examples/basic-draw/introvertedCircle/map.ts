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
    CircleSpiralMaterialProperty,
    DiffuseLinesMaterialProperty
} from "geokey-gis";

export function load(){
  window.viewer.entities.add({
    position: Cartesian3.fromDegrees(116, 26),
    ellipse: {
      semiMajorAxis: 100000.0,
      semiMinorAxis: 100000.0,
      material: new DiffuseLinesMaterialProperty({
        color: Color.fromCssColorString("#00ffec"),
        speed: 15000,
      }),
    },
  });
  window.viewer.entities.add({
    position: Cartesian3.fromDegrees(114, 26),
    ellipse: {
      semiMajorAxis: 100000.0,
      semiMinorAxis: 100000.0,
      material: new DiffuseLinesMaterialProperty({
        color: Color.fromCssColorString("#00ffec"),
        speed: 9000,
      }),
    },
  });
  window.viewer.zoomTo(window.viewer.entities);
}