import { CMath, Color, Cartesian3, Ellipsoid, Primitive, Material, GeometryInstance, WallGeometry, MaterialAppearance ,BlendingState,
  PolygonGeometry,
  PolygonHierarchy,
  EllipsoidSurfaceAppearance,
} from "geokey-gis";
import nantouData from '@/assets/data/walljson/nantoustreet.json';
import shaheData from '@/assets/data/walljson/shahestreet.json';

export function loadStereoscopicWall() {
  const arrowWallData: number[] = [];
  const warpWallData: number[] = [];
  nantouData.forEach((item: string[]) => {
    arrowWallData.push(+item[0], +item[1]);
  });
  shaheData.forEach((item: string[]) => {
    warpWallData.push(+item[0], +item[1]);
  });
  //水平循环流动墙材质
  const dynamicHLoopWallMaterial = new Material({
    fabric: {
      //材质类型
      type: 'dynamicHLoopWallMaterial',
      //参数传递
      uniforms: {
        image: '/image/loop.png',
        color: Color.AQUAMARINE,
        speed: 1000, // 循环系数-[与速度成反比]
        copy: {
          //纹理平铺
          x: 20,
          y: 2.0
        }
      },
      //glsl源码
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 coords = vec2(30.0,1.0) * materialInput.st; 
          vec4 colorImage = texture2D(image,vec2(fract(czm_frameNumber/speed-coords.s) ,fract(coords.t)));
          material.diffuse = color.rgb;
          material.alpha = colorImage.a;
          material.emission = color.rgb * colorImage.a;
          return material;
        }`
    }
  });
  //创建wall墙体
  const wallArrow = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new WallGeometry({
        positions: Cartesian3.fromDegreesArray(arrowWallData),
        maximumHeights: new Array(263).fill(500)
        // minimumHeights: new Array(5).fill(0),
      })
    }),
    appearance: new MaterialAppearance({
      material: dynamicHLoopWallMaterial
    })
  });

  //添加箭头效果立体墙
  window.viewer.scene.primitives.add(wallArrow);

  /**
   * 垂直循环动态立体墙
   **/
  const dynamicVLoopWallMaterial = new Material({
    fabric: {
      type: 'dynamicVLoopWallMaterial',
      uniforms: {
        image: '/image/lightLine.png',
        
        color: Color.LIGHTSKYBLUE.withAlpha(0),
        speed: 100,
        copy: { x: 1.0, y: 4.0 }
      },
      source: `
        vec4 getVec4ColorSpaceByImage(sampler2D image,vec2 coords){
          return texture2D(image, vec2(coords.s, coords.t));
        }
        float getRandomNumber(float begin,float rate,float speed){
          return begin+abs(rate*sin(czm_frameNumber / speed));
        }
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 coords = materialInput.st;
          float time = czm_frameNumber;
          vec4 colorImageAlpha = getVec4ColorSpaceByImage(image, vec2(copy.x * coords.s , 1.0 - 0.7*fract(copy.y * coords.t * 1.0 - fract(czm_frameNumber / speed))));
          material.diffuse = color.rgb;
          material.alpha = color.r * 0.5 + colorImageAlpha.r * 0.5;
          material.emission = color.rgb;
          return material;
        }`
    }
  });
  //创建wall墙体
  const wallWarp = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new WallGeometry({
        positions: Cartesian3.fromDegreesArray(warpWallData),
        maximumHeights: new Array(558).fill(500)
        // minimumHeights: new Array(4).fill(0),
      })
    }),
    appearance: new MaterialAppearance({
      material: dynamicVLoopWallMaterial
    })
  });

  //添加箭头效果立体墙
  window.viewer.scene.primitives.add(wallWarp);

  
  const fshader = `
      void main (void)
      {
      vec2 uv = gl_FragCoord.xy/vec2(1024,100);
      vec3 color = hsb2rgb(vec3(uv.x,1.0,uv.y));
      gl_FragColor = vec4(color,0.5);
      // gl_FragColor.a = material.alpha; //=>0.5
      }
    `;
const material = new Material({
  fabric: {
    uniforms: {
      u_time: 0.5,
    },
    source: `
    uniform float u_time;
    vec3 hsb2rgb( vec3 c ){
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
      rgb = rgb*rgb*(3.0-2.0*rgb);
      return c.z * mix(vec3(1.0), u_time*rgb, c.y);
    }
    `,
  },
});
window.viewer.scene.primitives.add(
  new Primitive({
    geometryInstances: new GeometryInstance({
      geometry:new PolygonGeometry({
          polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights([
          113.8, 22.5, 1000.0,
          113.7, 22.5, 1000.0,
          113.7, 22.4, 1000.0,
          113.8, 22.4, 1000.0,
          113.8, 22.5, 1000.0,
        ])),
          extrudedHeight: 300,
          vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
      })
      // geometry: new WallGeometry({
      //   positions: Cartesian3.fromDegreesArrayHeights([
      //     113.8, 22.5, 1000.0,
      //     113.7, 22.5, 1000.0,
      //     113.7, 22.4, 1000.0,
      //     113.8, 22.4, 1000.0,
      //     113.8, 22.5, 1000.0,
      //   ]),
      // })
    }),
    appearance: new MaterialAppearance({
      material: material,
      renderState: {
        blending: BlendingState.DISABLED, //混合
        depthTest: { enabled: true }, //深度测试
        depthMask: true,
      },
      fragmentShaderSource: fshader,
    }),
    show: true,
  })
);
// setInterval(() => {
//   material.uniforms.u_time = Math.random();
// }, 1000);

  window.viewer.goTo({
    center: [113.94101588347209, 22.383628759991456, 12000],
    heading: 0,
    pitch: -35,
    roll: 0
  });
}
