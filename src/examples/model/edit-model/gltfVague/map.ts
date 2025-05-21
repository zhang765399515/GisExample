import { Geokey3DTileset, Cartographic, CMath, Cartesian3, Matrix4, ColorBlendMode, Color, PostProcessStage,Material } from 'geokey-gis';
import menu from './menu.json';

export function loadGltf() {
  window.viewer.goTo({
    center: [114.054801, 22.558947, 500]
  });

  const url = "http://gisserver.igeokey.com:12022/service/gis/3DModel/?serviceName=luse_1&uuid=1";
  viewer.entities.add({
    id: 'gltf1111',
    name: url,
    position: Cartesian3.fromDegrees(114.054301, 22.558947),
    model: {
      uri: url
    }
  });
  viewer.entities.add({
    name: url,
    position: Cartesian3.fromDegrees(114.055301, 22.558947),
    model: {
      uri: url
    }
  });
  const fragmentShaderSource = `
            uniform sampler2D colorTexture;
            in vec2 v_textureCoordinates;
            const int KERNEL_WIDTH = 20;
            void main(void)
            {
                vec4 color = texture(colorTexture, v_textureCoordinates);
                if (czm_selected()) {
                    vec2 step = czm_pixelRatio / czm_viewport.zw;
                    vec2 integralPos = v_textureCoordinates - mod(v_textureCoordinates, 8.0 * step);
                    vec3 averageValue = vec3(0.0);
                    for (int i = 0; i < KERNEL_WIDTH; i++)
                    {
                        for (int j = 0; j < KERNEL_WIDTH; j++)
                        {
                            averageValue += texture(colorTexture, integralPos + step * vec2(i, j)).rgb;
                        }
                    }
                    averageValue /= float(KERNEL_WIDTH * KERNEL_WIDTH);
                    out_FragColor = vec4(averageValue, 1.0);
                } else {
                    out_FragColor = color;
                }
                
            }
         `;
  const stage = viewer.scene.postProcessStages.add(
    new PostProcessStage({
      fragmentShader: Material.GltfVague
    })
  );
  stage.selected = [];
  setTimeout(() => {
    const primitive = viewer.scene.primitives._primitives.find(e => {
      return e.id?.id === 'gltf1111'; // 使用 id 查找
    });
    stage.selected = [primitive];
  }, 3000);
}
