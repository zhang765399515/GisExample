import {
  Geokey3DTileset,
  Color,
  Cartesian3,
  Material,
  UniformType,
  PolygonGeometry,
  PolygonHierarchy,
  GroundPrimitive,
  GeometryInstance,
  MaterialAppearance,
  CustomShader,
  Matrix4,
  Transforms
} from "geokey-gis";

export async function loadPGEarth3DTileset() {
  // const tileset = await new Geokey3DTileset({
  //   url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=chunfeng_suidao'
  // }).readyPromise;
  // window.viewer.scene.primitives.add(tileset);
  // window.viewer.zoomTo(tileset);
  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  window.viewer.resolutionScale = window.devicePixelRatio;
  const allTileset = ['1-1', '1-2', '1-4', 'sea', 'seajy'];
  const inverseModelLocal = new Matrix4();
  const modelLocal = new Matrix4();
  let tileset: any = undefined;
  allTileset.forEach(item => {
    tileset = new Geokey3DTileset({
      url: `http://14.22.86.227:12022/service/gis/3DModel/Scene/Production_2.json?uuid=633463e9-97e2-47e1-86f6-85edb862c4cd&serviceName=sz_hsl_b3dm20231109`,
      maximumScreenSpaceError: 1
    });
    tileset.customShader = new CustomShader({
      uniforms: {
        u_firstPWC: {
          type: UniformType.VEC3,
          value: Cartesian3.fromDegrees(114.49031743659374, 22.64646998587102, 10)
        },
        u_first2PWC: {
          type: UniformType.VEC3,
          value: Cartesian3.fromDegrees(114.49031743659374, 22.64607058627925, 10)
        },
        u_first3PWC: {
          type: UniformType.VEC3,
          value: Cartesian3.fromDegrees(114.49134037988868, 22.64607058627925, 10)
        },
        u_first4PWC: {
          type: UniformType.VEC3,
          value: Cartesian3.fromDegrees(114.49134037988868, 22.64646998587102, 10)
        }
      },
      vertexShaderText: `
       void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
        vec4 firstpMC = czm_inverseModel * vec4(u_firstPWC, 1);
        vec4 firstp3MC = czm_inverseModel * vec4(u_first3PWC, 1);
        if(
          vsOutput.positionMC.x < firstpMC.x &&
          vsOutput.positionMC.x > firstp3MC.x &&
          vsOutput.positionMC.z < firstp3MC.z &&
          vsOutput.positionMC.z > firstpMC.z)
        {
          vsOutput.positionMC.y = firstp3MC.y;
        }
      }
      `
    });
    window.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
    window.viewer.scene.primitives.add(tileset);
    tileset.readyPromise.then((v: any) => {
      const center = v.boundingSphere.center;
      // tileset.localView = Transforms.eastNorthUpToFixedFrame(center, window.viewer.scene.globe.ellipsoid, modelLocal);
      // tileset.localViewInverse = Matrix4.inverse(modelLocal, inverseModelLocal);
      window.viewer.zoomTo(tileset);
    });
  });

  const geo = new PolygonGeometry({
    polygonHierarchy: new PolygonHierarchy(
      Cartesian3.fromDegreesArrayHeights([
        114.49031743659374, 22.64646998587102, 10, 114.49031743659374, 22.64607058627925, 10, 114.49134037988868, 22.64607058627925, 10, 114.49134037988868, 22.64646998587102, 10
      ])
    ),
    perPositionHeight: true
  });

  const primitive = new GroundPrimitive({
    geometryInstances: new GeometryInstance({
      geometry: geo
    }),
    appearance: new MaterialAppearance({
      material: new Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: Color.RED.withAlpha(0.5)
          }
        }
      })
    })
  });

  window.viewer.scene.primitives.add(primitive);

  window.viewer.scene.postProcessStages.fxaa.enabled = true;
}
