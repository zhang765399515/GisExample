import {
  Cartesian3,
  Transforms,
  Model,
  Geokey3DTileset,
  Geokey3DTileStyle,
  Color,
  CustomShader,
  TextureUniform,
  UniformType,
  CustomShaderMode,
  LightingModel,
  ImageBasedLighting,
  VaryingType
} from "geokey-gis"
import buildings from "./buildings.png"
export async function load3dtiles() {
  try {
    const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_baimo');
    window.viewer.scene.primitives.add(tileset);
    window.viewer.zoomTo(tileset);
    tileset.customShader = loadCustomShader();
  } catch {
    console.log("加载3DTile失败");
  }
}

export function loadCustomShader() {
  return new CustomShader({
    lightingModel: LightingModel.UNLIT,
    varyings: {
      v_geokey_normalMC: VaryingType.VEC3
    },
    uniforms: {
      u_geokey_texture: {
        value: new TextureUniform({
          url: buildings
        }),
        type: UniformType.SAMPLER_2D
      }
    },
    vertexShaderText: /* glsl */ `
        void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
            v_geokey_normalMC = vsInput.attributes.normalMC;
          }`,
    fragmentShaderText: /* glsl 如果贴图方向不对，用下面这个 */ `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          vec3 positionMC = fsInput.attributes.positionMC;
          if (dot(vec3(0.0, 0.0, 1.0), v_geokey_normalMC) > 0.95) {
            //处理楼顶:统一处理成深色。
            material.diffuse = vec3(0.079, 0.107, 0.111);
          } else {
            //处理四个侧面: 贴一样的图
            float geokey_width = 100.0;
            float geokey_height = 100.0;
            float geokey_textureX = 0.0;
            float geokey_dotXAxis = dot(vec3(0.0, 1.0, 0.0), v_geokey_normalMC);
            if (geokey_dotXAxis > 0.52 || geokey_dotXAxis < -0.52) {
              geokey_textureX = mod(positionMC.x, geokey_width) / geokey_width;
            } else {
              geokey_textureX = mod(positionMC.y, geokey_width) / geokey_width; //positionMC.z
            }
            float geokey_textureY = mod(positionMC.z, geokey_height) / geokey_height; //positionMC.y
            material.diffuse = texture(u_geokey_texture, vec2(geokey_textureX, geokey_textureY)).rgb;
          }
        }`
  });
}