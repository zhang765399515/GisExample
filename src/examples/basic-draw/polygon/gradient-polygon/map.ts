import { Cartesian3, Color, PolygonGeometry, PolygonHierarchy, EllipsoidSurfaceAppearance, Material, Primitive, GeometryInstance, Geokey3DTileset } from 'geokey-gis';
export async function load() {
  const positionArray = Cartesian3.fromDegreesArray([114.0359, 22.803471, 114.637146, 22.655038, 114.627616, 22.35099, 114.084979, 22.292167]);
  const primitiveData = new Primitive({
    geometryInstances: [
      new GeometryInstance({
        geometry: new PolygonGeometry({
          polygonHierarchy: new PolygonHierarchy(positionArray),
          extrudedHeight: 1000,
          height: 0
        })
      })
    ],
    appearance: new EllipsoidSurfaceAppearance({
      material: new Material({
        fabric: {
          source: Material.GradientPolygon,
          uniforms: {
            // 外部传入材质中的数据
            alpha_0: 0.5,
            color_1: Color.fromCssColorString('rgb(255, 0, 0)'),
            color_2: Color.fromCssColorString('rgb(0, 255, 0)'),
            color_3: Color.fromCssColorString('rgb(0, 0, 255)'),
            color_4: Color.fromCssColorString('rgb(255, 255, 0)')
          }
        },
        translucent: false
      })
    })
  });
  window.viewer.scene.primitives.add(primitiveData); //添加到场景中
  window.viewer.goTo({
    center: [114.0359, 22.803471, 500000],
  });
}
