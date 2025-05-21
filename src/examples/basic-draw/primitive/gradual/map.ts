import { Color, Cartesian3, GeometryInstance, Primitive, PolygonGeometry, PolygonHierarchy, Material, MaterialAppearance, VertexFormat } from "geokey-gis";
import nanshanData from '@/assets/data/walljson/nanshanstreet.json';
import nantouData from '@/assets/data/walljson/nantoustreet.json';
import shaheData from '@/assets/data/walljson/shahestreet.json';
import shekouData from '@/assets/data/walljson/shekoustreet.json';
import taoyuanData from '@/assets/data/walljson/taoyuanstreet.json';
import xiliData from '@/assets/data/walljson/xilistreet.json';
import yuehaiData from '@/assets/data/walljson/yuehaistreet.json';
import zhaoshangData from '@/assets/data/walljson/zhaoshangstreet.json';

const partitionJsonData: { [key: string]: any } = {
  nanshan: {
    height: 1,
    positions: nanshanData,
    color: '#5F438C'
  },
  nantou: {
    height: 200,
    positions: nantouData,
    color: '#286fa9'
  },
  shahe: {
    height: 200,
    positions: shaheData,
    color: '#515199'
  },
  shekou: {
    height: 200,
    positions: shekouData,
    color: '#0094b4'
  },
  taoyuan: {
    height: 200,
    positions: taoyuanData,
    color: '#00acae'
  },
  xili: {
    height: 300,
    positions: xiliData,
    color: '#00bc9e'
  },
  yuehai: {
    height: 400,
    positions: yuehaiData,
    color: '#fb7a99'
  },
  zhaoshang: {
    height: 300,
    positions: zhaoshangData,
    color: '#00c9b7'
  }
};

export function loadRegions(feature: any, index: number) {
  for (let key in partitionJsonData) {
    const degreesArrayHeights: number[] = [];

    partitionJsonData[key].positions.forEach((item: string[]) => {
      degreesArrayHeights.push(+item[0]);
      degreesArrayHeights.push(+item[1]);
      degreesArrayHeights.push(partitionJsonData[key].height);
    });

    const wallMaterial = new Material({
      fabric: {
        type: 'CenterGradual',
        uniforms: {
          color: Color.WHEAT
        },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 coords = materialInput.st;
            float time = czm_frameNumber;
            float dis = distance(coords, vec2(0.5, 0.5));
            if(dis > 0.0) {
                material.alpha = color.a * dis;
            }else{
                material.alpha = color.a * dis / 1.5;
            }
            material.diffuse = color.rgb;
            material.emission = color.rgb;
            return material;
          }`
      }
    });
    console.log('name：degreesArrayHeights',degreesArrayHeights);
    wallMaterial.uniforms.color = Color.fromCssColorString(partitionJsonData[key].color);
    const wallPrimitive = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: new PolygonGeometry({
          polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(degreesArrayHeights)),
          perPositionHeight: true,
          extrudedHeight: 0,
          vertexFormat: VertexFormat.ALL
        })
      }),
      appearance: new MaterialAppearance({
        material: wallMaterial
      })
    });
    window.viewer.scene.primitives.add(wallPrimitive);
  }

  window.viewer.goTo({
    center: [113.94, 22.3, 12000],
    heading: 0,
    pitch: -30.0,
    roll: 0
  });
}
