import { Color, Cartesian3, PolylineGlowMaterialProperty } from 'geokey-gis';

export function loadGlowingLine(){
  window.viewer.entities.add({
    name: "Glowing blue line on the surface",
    polyline: {
      positions: [
        {
            "x": -2382927.484962853,
            "y": 5381304.830502401,
            "z": 2450180.8317439803
        },
        {
            "x": -2410116.807341243,
            "y": 5370708.422838458,
            "z": 2446856.9249786385
        },
        {
            "x": -2410116.807341243,
            "y": 5370708.422838458,
            "z": 2446856.9249786385
        }
    ],
      width: 20,
      material: new PolylineGlowMaterialProperty({
        glowPower: 0.2,
        taperPower: 1,
        color: Color.CORNFLOWERBLUE,
      }),
    },
  });
}
