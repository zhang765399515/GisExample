import { PostProcessStageCollection, PostProcessStage, PostProcessStageComposite } from "geokey-gis";

let viewer = window.viewer;
let collection: PostProcessStageCollection | undefined = undefined;
let rain: PostProcessStage | PostProcessStageComposite | undefined = undefined;
const RainShaderSource = `
uniform sampler2D colorTexture; //输入的场景渲染照片
varying vec2 v_textureCoordinates;

float hash(float x) { return fract(sin(x * 133.3) * 13.13); }

void main(void) {

    float time = czm_frameNumber / 60.0;
    vec2 resolution = czm_viewport.zw;

    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
    vec3 c = vec3(.6, .7, .8);

    float a = -.4;
    float si = sin(a), co = cos(a);
    uv *= mat2(co, -si, si, co);
    uv *= length(uv + vec2(0, 4.9)) * .3 + 1.;

    float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);
    float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;
    c *= v * b; //屏幕上雨的颜色

    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), 0.5); //将雨和三维场景融合
}
`
export function addRain() {
    collection = window.viewer.scene.postProcessStages;
    rain = createRainStage();
    collection.add(rain);
    viewer.scene.skyAtmosphere.hueShift = -0.8;//天气色调 0~1
    viewer.scene.skyAtmosphere.saturationShift = -0.7;//天气饱和度0~-1
    viewer.scene.skyAtmosphere.brightnessShift = -0.33;//天气亮度，默认为0,-1全黑
    viewer.scene.fog.density = 0.001;//雾的密度
    viewer.scene.fog.minimumBrightness = 0.8; //雾的亮度0-1
}
export function createRainStage() {
    return new PostProcessStage({
        name: 'czm_rain',
        fragmentShader: RainShaderSource
    });
}
export function removeRain() {
    if (collection && rain) {
        collection.remove(rain);
        viewer.scene.skyAtmosphere.hueShift = 0;
        viewer.scene.skyAtmosphere.saturationShift = 0;
        viewer.scene.skyAtmosphere.brightnessShift = 0;
        viewer.scene.fog.density = 0;
        viewer.scene.fog.minimumBrightness = 0;
    }
}