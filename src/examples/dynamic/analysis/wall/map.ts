import { Color, Cartesian3, Primitive, Material, GeometryInstance, WallGeometry, MaterialAppearance } from "geokey-gis";

import nanshanData from '@/assets/data/walljson/nanshanstreet.json';
import nantouData from '@/assets/data/walljson/nantoustreet.json';
import shaheData from '@/assets/data/walljson/shahestreet.json';
import shekouData from '@/assets/data/walljson/shekoustreet.json';
import taoyuanData from '@/assets/data/walljson/taoyuanstreet.json';
import xiliData from '@/assets/data/walljson/xilistreet.json';
import yuehaiData from '@/assets/data/walljson/yuehaistreet.json';
import zhaoshangData from '@/assets/data/walljson/zhaoshangstreet.json';

const wallObject: { [key: string]: any } = {};
const wallJsonData: { [key: string]: any } = {
  nanshan: {
    wallHeight: 800,
    wallData: nanshanData,
    wallColor: '#5F438C'
  },
  nantou: {
    wallHeight: 600,
    wallData: nantouData,
    wallColor: '#286fa9'
  },
  shahe: {
    wallHeight: 800,
    wallData: shaheData,
    wallColor: '#515199'
  },
  shekou: {
    wallHeight: 600,
    wallData: shekouData,
    wallColor: '#0094b4'
  },
  taoyuan: {
    wallHeight: 700,
    wallData: taoyuanData,
    wallColor: '#00acae'
  },
  xili: {
    wallHeight: 600,
    wallData: xiliData,
    wallColor: '#00bc9e'
  },
  yuehai: {
    wallHeight: 1200,
    wallData: yuehaiData,
    wallColor: '#fb7a99'
  },
  zhaoshang: {
    wallHeight: 500,
    wallData: zhaoshangData,
    wallColor: '#00c9b7'
  }
};

export function loadStereoscopicWall() {
  const wallPrimitive: { [key: string]: Primitive } = {};
  const wallMaterial: { [key: string]: Material } = {};

  for (let key in wallJsonData) {
    let walls = [];
    let color = wallJsonData[key].wallColor;

    for (let i = 0; i < wallJsonData[key].wallData.length; i++) {
      walls.push(+wallJsonData[key].wallData[i][0], +wallJsonData[key].wallData[i][1], wallJsonData[key].wallHeight);
    }

    wallMaterial[key] = new Material({
      fabric: {
        type: 'dynamicVLoopWallMaterial',
        uniforms: {
          color: Color.BLACK
        },
        source: `
            czm_material czm_getMaterial(czm_materialInput materialInput){
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec2 coords = materialInput.st;
              vec3 borderTopColor = vec3(255.0, 255.0, 255.0);
              float time = czm_frameNumber;
              vec3 diffuseColor = borderTopColor + color.rgb;
              material.specular = 0.5;
              
              if(coords.t > 0.96) {
                material.diffuse = diffuseColor;
                material.shininess = 10.0;
              }else{
                material.diffuse = vec3(0.0, 0.0, 0.0);
                material.shininess = 0.8;
              }
              material.alpha = color.a * (fract(coords.t)) * 0.9;
              material.emission = color.rgb;
              return material;
            }`
      }
    });
    wallMaterial[key].uniforms.color = Color.fromCssColorString(color);

    wallPrimitive[key] = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: new WallGeometry({
          positions: Cartesian3.fromDegreesArrayHeights(walls)
          // maximumHeights: new Array(5).fill(5000),
          // minimumHeights: new Array(5).fill(0),
        })
      }),
      appearance: new MaterialAppearance({
        material: wallMaterial[key]
      })
    });
    wallObject[key] = wallPrimitive[key];
    window.viewer.scene.primitives.add(wallPrimitive[key]);
  }

  /**
   * 垂直循环动态立体墙
   **/
  const dynamicVLoopWallMaterialGradual = new Material({
    fabric: {
      type: 'dynamicVLoopWallMaterial',
      uniforms: {
        image: '/image/light2.png'
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          vec4 colorImage = texture(image, vec2(fract(st.t), st.t));
          material.alpha = colorImage.a;
          material.diffuse = (colorImage.rgb)/2.0;
          return material;
        }`
    }
  });
  //创建wall墙体
  const wallWarpGradual = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new WallGeometry({
        positions: Cartesian3.fromDegreesArrayHeights([113.9, 22.35, 1000.0, 113.85, 22.35, 1000.0, 113.85, 22.3, 1000.0, 113.9, 22.3, 1000.0, 113.9, 22.35, 1000.0])
        // maximumHeights: new Array(4).fill(500),
        // minimumHeights: new Array(4).fill(0),
      })
    }),
    appearance: new MaterialAppearance({
      material: dynamicVLoopWallMaterialGradual
    })
  });

  //添加箭头效果立体墙
  window.viewer.scene.primitives.add(wallWarpGradual);

  window.viewer.goTo({
    center: [113.9, 22.28362, 20000.0],
    heading: 0.0,
    pitch: -35.0,
    roll: 0.0
  });
}
