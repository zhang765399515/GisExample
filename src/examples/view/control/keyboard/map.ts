import { Cartesian3, HeadingPitchRoll, Color, Material, HeightReference, Transforms, CustomShader, LightingModel } from "geokey-gis";

import { reactive } from 'vue';

export const keyCode: { [key: string]: boolean } = reactive({
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  KeyQ: false,
  KeyE: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
});

const keysOfClick: { [key: string]: Function } = {
  KeyW: function (status: boolean) {
    keyCode['KeyW'] = status;
  },
  KeyA: function (status: boolean) {
    keyCode['KeyA'] = status;
  },
  KeyS: function (status: boolean) {
    keyCode['KeyS'] = status;
  },
  KeyD: function (status: boolean) {
    keyCode['KeyD'] = status;
  },
  KeyQ: function (status: boolean) {
    keyCode['KeyQ'] = status;
  },
  KeyE: function (status: boolean) {
    keyCode['KeyE'] = status;
  },
  ArrowUp: function (status: boolean) {
    keyCode['ArrowUp'] = status;
  },
  ArrowDown: function (status: boolean) {
    keyCode['ArrowDown'] = status;
  },
  ArrowLeft: function (status: boolean) {
    keyCode['ArrowLeft'] = status;
  },
  ArrowRight: function (status: boolean) {
    keyCode['ArrowRight'] = status;
  }
};

export function loadAircraftModel() {
  const hpr = new HeadingPitchRoll(0, 0, 0);
  //朝向（弧度单位）
  const position = Cartesian3.fromDegrees(107.161133, 36.746181, 0);
  const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

  window.viewer.entities.add({
    position: position,
    name: 'aircraft',
    orientation: orientation as any,
    ellipse: {
      semiMinorAxis: 10.0,
      semiMajorAxis: 10.0,
      material: Color.RED,
      heightReference: HeightReference.NONE
    },
    model: {
      uri: 'src/assets/model/untitled.gltf',
      minimumPixelSize: 128,
      maximumScale: 20
    }
  });

  window.viewer.goTo({ center: [107.161133, 36.746181, 1000] });
}

export function keyboardControl() {
  const ellipsoid = window.viewer.scene.globe.ellipsoid;

  document.addEventListener('keydown', event => {
    keysOfClick[event.code] && keysOfClick[event.code](true);
  });

  document.addEventListener('keyup', event => {
    keysOfClick[event.code] && keysOfClick[event.code](false);
  });

  window.viewer.clock.onTick.addEventListener(() => {
    const camera = window.viewer.camera;

    const cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;

    const moveRate = cameraHeight / 100;

    keyCode.KeyW && camera.moveForward(moveRate);
    keyCode.KeyS && camera.moveBackward(moveRate);
    keyCode.KeyQ && camera.moveUp(moveRate);
    keyCode.KeyE && camera.moveDown(moveRate);
    keyCode.KeyA && camera.moveLeft(moveRate);
    keyCode.KeyD && camera.moveRight(moveRate);
    keyCode.ArrowUp && camera.lookUp(0.001);
    keyCode.ArrowDown && camera.lookDown(0.001);
    keyCode.ArrowLeft && camera.lookLeft(0.001);
    keyCode.ArrowRight && camera.lookRight(0.001);
  });
}

// const customShader = new CustomShader({
//   lightingModel: LightingModel.UNLIT,
//   uniforms: {
//     u_cameraDirectionWC: {
//       type: UniformType.VEC3,
//       value: viewer.scene.camera.positionWC
//     },
//     u_lightColor1: {
//       type: UniformType.VEC4,
//       value: lightPoint1.color
//     },
//     u_lightPos1: {
//       type: UniformType.VEC3,
//       value: lightPoint1.postion
//     },
//     u_lightColor2: {
//       type: UniformType.VEC4,
//       value: lightPoint2.color
//     },
//     u_lightPos2: {
//       type: UniformType.VEC3,
//       value: lightPoint2.postion
//     },
//     u_lightColor3: {
//       type: UniformType.VEC4,
//       value: lightPoint3.color
//     },
//     u_lightPos3: {
//       type: UniformType.VEC3,
//       value: lightPoint3.postion
//     }
//   },
//   fragmentShaderText: `
//     vec4 makeLight(vec4 lightColorHdr,vec3 lightPos,vec3 positionWC,vec3 positionEC,vec3 normalEC,czm_pbrParameters pbrParameters){
//       vec3 color = vec3(0.0);
//       float mx1 = 1.0;
//       vec3 light1Dir = positionWC - lightPos;
//       float distance1 = length(light1Dir);
//       if(distance1 < 1000.0){
//         vec4 l1 = czm_view * vec4(lightPos, 1.0);
//         vec3 lightDirectionEC = l1.xyz - positionEC;
//         mx1 = 1.0 - distance1 / 1000.0;
//         color = czm_pbrLighting(
//           positionEC,
//           normalEC,
//           lightDirectionEC,
//           lightColorHdr.xyz,
//           pbrParameters
//         ).xyz;
//       }
//       mx1 = max(color.r,max(color.g,color.b)) * pow(mx1,1.0) * 10.0;
//       return vec4(color,mx1);
//     }
//     void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material){
//       material.diffuse = vec3(1.0);
//       vec3 positionWC = fsInput.attributes.positionWC;
//       vec3 normalEC = fsInput.attributes.normalEC;
//       vec3 positionEC = fsInput.attributes.positionEC;

//       vec3 lightColorHdr = czm_lightColorHdr;
//       vec3 lightDirectionEC = czm_lightDirectionEC;
//       lightDirectionEC = (czm_view * vec4(u_cameraDirectionWC,1.0)).xyz - positionEC;

//       czm_pbrParameters pbrParameters;
//       pbrParameters.diffuseColor = material.diffuse;
//       pbrParameters.f0 = vec3(0.5);
//       pbrParameters.roughness = 1.0;

//       vec3 ligth1Color0 = czm_pbrLighting(
//         positionEC,
//         normalEC,
//         lightDirectionEC,
//         lightColorHdr,
//         pbrParameters
//       );

//       vec4 ligth1ColorR = makeLight(u_lightColor1,u_lightPos1,positionWC,positionEC,normalEC,pbrParameters);
//       vec4 ligth1ColorG = makeLight(u_lightColor2,u_lightPos2,positionWC,positionEC,normalEC,pbrParameters);
//       vec4 ligth1ColorB = makeLight(u_lightColor3,u_lightPos3,positionWC,positionEC,normalEC,pbrParameters);

//       vec3 finalColor = mix(ligth1Color0.rgb, ligth1ColorR.rgb, ligth1ColorR.a);
//       finalColor = mix(finalColor, ligth1ColorG.rgb, ligth1ColorG.a);
//       finalColor = mix(finalColor, ligth1ColorB.rgb, ligth1ColorB.a);
//       material.diffuse = finalColor;
//     }`
// });

// Material._materialCache.addMaterial('RectFlayLightMaterial', {
// 	fabric: {
// 		type: ,
// 		uniforms: {
//             uTime: 0
//         },
//         source: `czm_material czm_getMaterial(czm_materialInput materialInput){
// 			czm_material material = czm_getDefaultMaterial(materialInput);
// 			return material;
// 		}`
// 	}
// })
