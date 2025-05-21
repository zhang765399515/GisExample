import { CallbackProperty, PostProcessStage, DynamicCloudShaders, Transforms, Matrix4, Cartesian3 } from 'geokey-gis';
let postProcessStage: any;
export function load() {
  let position = Cartesian3.fromDegrees(114.144444, 22.661265, 2000.7689009180795);
  let guiConfig = {
    cloudCover: 0.6, //云覆盖度
    windSpeedRatio: 0.0002, //风速
    fogColor: 3.0,
    length: 5000.0,
    width: 5000.0,
    height: 1000,
    cloudThickness: 1000, //云层厚度
    windVectorX: -100,
    windVectorY: 0,
    windVectorZ: 100
  };
  postProcessStage = window.viewer.scene.postProcessStages.add(
    new PostProcessStage({
      fragmentShader: DynamicCloudShaders,
      uniforms: {
        fogColor: guiConfig.fogColor,
        inverse: Matrix4.inverse(Transforms.eastNorthUpToFixedFrame(position), new Matrix4()),
        positionX: guiConfig.length,
        positionY: guiConfig.width,
        positionZ: guiConfig.height,
        cloudCover: guiConfig.cloudCover, //云覆盖度
        windSpeedRatio: guiConfig.windSpeedRatio, //风速
        cloudThickness: guiConfig.cloudThickness, //云层厚度
        windVector: new Cartesian3(guiConfig.windVectorX, guiConfig.windVectorY, guiConfig.windVectorZ)
      }
    })
  );
  window.viewer.camera.setView({
    destination: Cartesian3.fromDegrees(114.144444, 22.66126, 10000.0)
  });
}
interface CloudData {
  cloudCover: number; // 云覆盖度
  windSpeedRatio: number; // 风速
  fogColor: number; // 云颜色
  length: number; // 长度
  width: number; // 宽度
  height: number; // 高度
  cloudThickness: number; // 云层厚度
  windVectorX: number; // 风速在X轴的分量
  windVectorY: number; // 风速在Y轴的分量
  windVectorZ: number; // 风速在Z轴的分量
}
export function cloudChange(data: CloudData) {
  postProcessStage.uniforms.cloudCover = data.cloudCover;
  postProcessStage.uniforms.fogColor = data.fogColor;
  postProcessStage.uniforms.windSpeedRatio = data.windSpeedRatio;
  postProcessStage.uniforms.positionX = data.length;
  postProcessStage.uniforms.positionY = data.width;
  postProcessStage.uniforms.positionZ = data.height;
  postProcessStage.uniforms.cloudThickness = data.cloudThickness;
  postProcessStage.uniforms.windVector = new Cartesian3(data.windVectorX, data.windVectorY, data.windVectorZ);
}
