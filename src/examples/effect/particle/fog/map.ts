import { PostProcessStage, Cartesian4, Color, PostProcessStageCollection, PostProcessStageComposite } from 'geokey-gis'
let viewer = window.viewer;
let collection: PostProcessStageCollection | undefined = undefined;
let fog: PostProcessStage | PostProcessStageComposite | undefined = undefined;
const shaderSource = `
        float getDistance(sampler2D depthTexture, vec2 texCoords)
            {
                float depth = czm_unpackDepth(texture2D(depthTexture, texCoords));
                if(depth == 0.0){
                    return czm_infinity;
                }
                vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
                return -eyeCoordinate.z / eyeCoordinate.w;
            }
            //按距离进行插值计算
            float interpolateByDistance(vec4 nearFarScalar, float distance)
            {
                float startDistance = nearFarScalar.x;
                float startValue = nearFarScalar.y;
                float endDistance = nearFarScalar.z;
                float endValue = nearFarScalar.w;
                float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0);
                return mix(startValue,endValue, t);
            }
            //计算透明度
            vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor)
            {
                return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a);
            }
            uniform sampler2D colorTexture; //颜色纹理，内置变量
            uniform sampler2D depthTexture; //深度纹理，内置变量
            varying vec2 v_textureCoordinates; //屏幕采样点坐标，内置变量
            uniform vec4 fogByDistance;//自定义属性，外部变量
            uniform vec4 fogColor; //自定义属性，外部变量
            void main(void)
            {
                float distance = getDistance(depthTexture, v_textureCoordinates);
                vec4 sceneColor = texture2D(colorTexture, v_textureCoordinates);
                float blendAmount = interpolateByDistance(fogByDistance, distance);
                vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount);
                gl_FragColor = alphaBlend(finalFogColor, sceneColor);
            }
`;
export function addFog() {
    collection = window.viewer.scene.postProcessStages;
    fog = createFogStage();
    collection.add(fog);
    viewer.scene.skyAtmosphere.hueShift = -0.8;//天气色调 0~1
    viewer.scene.skyAtmosphere.saturationShift = -0.7;//天气饱和度0~-1
    viewer.scene.skyAtmosphere.brightnessShift = -0.33;//天气亮度，默认为0,-1全黑
    viewer.scene.fog.density = 0.001;//雾的密度
    viewer.scene.fog.minimumBrightness = 0.8; //雾的亮度0-1
}
export function createFogStage() {
    return new PostProcessStage({
        fragmentShader: shaderSource,
        uniforms: {
            fogByDistance: new Cartesian4(50, 0, 1000, 0.8),//new Cartesian4(10, 0, 600, 1.0) ： 10米内看清物体，透明度从0-1，能见度600米
            fogColor: Color.WHITE
        }
    });
}
export function removeFog(){
    if(collection&&fog){
        collection.remove(fog);
        viewer.scene.skyAtmosphere.hueShift = 0;
        viewer.scene.skyAtmosphere.saturationShift = 0;
        viewer.scene.skyAtmosphere.brightnessShift = 0;
        viewer.scene.fog.density = 0;
        viewer.scene.fog.minimumBrightness = 0;
    }
}