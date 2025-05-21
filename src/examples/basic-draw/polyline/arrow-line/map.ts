import { Color, Cartesian3, GeometryInstance, PolylineGeometry, PolylineMaterialAppearance, Material, Primitive, UrlTemplateImageryProvider } from 'geokey-gis';
import imgUrl from "image/meteor_01.png"
export function loadDynamicLine() {
  const geometryInstance = new GeometryInstance({
    geometry: new PolylineGeometry({
      positions: [
        new Cartesian3(
          -2382927.484962853,
          5381304.830502401,
          2450180.8317439803
        ),
        new Cartesian3(
          -2410116.807341243,
          5370708.422838458,
          2446856.9249786385
        ),
        new Cartesian3(
          -2410116.807341243,
          5370708.422838458,
          2446856.9249786385
        ),
      ],
      width: 20,
      vertexFormat: PolylineMaterialAppearance.VERTEX_FORMAT,
    })
  })

  // 自定义材质
  const material = new Material({
    translucent: true,
    fabric: {
      uniforms: {
        color: Color.fromRandom({ alpha: 1 }),
        image: "image/ArrowOpacity.png",
        speed: 5,
      },
      source: `
      czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        float st_map_s = fract(st.s - speed * czm_frameNumber * 0.001);
        vec4 colorImage = texture(image, vec2(st_map_s, st.t));
        vec4 fragColor;
        fragColor.rgb = color.rgb / 1.0;
        material.alpha = colorImage.a * color.a;
        material.diffuse = fragColor.rgb;
        material.emission = fragColor.rgb;
        return material;
      }
    `,
    },
  });
  const primitive = new Primitive({
    geometryInstances: [geometryInstance],
    appearance: new PolylineMaterialAppearance({
      material: material
    }),
    asynchronous: false,
  });

  window.viewer.scene.primitives.add(primitive)
}


