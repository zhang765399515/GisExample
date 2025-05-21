import {
    Cartesian3,
    Color,
    PolygonGeometry,
    PolygonHierarchy,
    EllipsoidSurfaceAppearance,
    Material,
    Primitive,
    GeometryInstance,
    Geokey3DTileset
} from 'geokey-gis';
import waterNormals from './waterNormals.png'
import specularMap from './specularMap.png'
export async function load3dtileset() {
    const tile = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_shenzhen_jianzhu1&uuid=1')
    window.viewer.zoomTo(tile);
    window.viewer.scene.primitives.add(tile);
}
export class drawWater {
    constructor(option) {
        this.waterPrimitive = null;
        this.normalMap = option.waterNormals || waterNormals,//法向贴图
            this.frequency = option.frequency || 10000.0,//频率
            this.animationSpeed = option.animationSpeed || 0.01,//动画速度
            this.amplitude = option.amplitude || 100.0,//振幅
            this.baseWaterColor = option.baseWaterColor || 'rgba(47,131,137,0.6)'
    }
    startCreate(data) {
        let geometry = this.CreateGeometry(data);
        let appearance = this.CreateAppearance();
        let primitive = new Primitive({
            // allowPicking: false,
            geometryInstances: new GeometryInstance({
                geometry: geometry
            }),
            appearance: appearance,
            asynchronous: true
        });
        this.waterPrimitive = window.viewer.scene.primitives.add(primitive);

    }
    CreateGeometry(data) {
        console.log('name：data', data);
        return new PolygonGeometry({
            polygonHierarchy: new PolygonHierarchy(data),
            extrudedHeight: 100,
            vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        })
    }
    CreateAppearance() {
        return new EllipsoidSurfaceAppearance({
            material: new Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        specularMap: specularMap,
                        normalMap: waterNormals,//法向贴图
                        // frequency: this.frequency,//频率
                        // animationSpeed: this.animationSpeed,//动画速度
                        // amplitude: this.amplitude,//振幅
                        // baseWaterColor: Color.fromCssColorString(this.baseWaterColor)
                        frequency: 10000,
                        animationSpeed: 0.01,
                        amplitude: 1.0,
                        ripple: 100,
                        specularIntensity: 0.8,
                        fadeFactor: 1.0,
                        opacity: 0.8,
                        stRotation: 0,
                        stRotationDegree: 0
                    },
                },
            }),
            // vertexShaderSource:this.createVSWaterFace(),
            // fragmentShaderSource: this.createFSWaterFace(),
        });
    }
    createVSWaterFace() {
        return `
        in vec3 position3DHigh;
        in vec3 position3DLow;
        in vec3 normal;
        in vec2 st;
        in float batchId;

        out vec3 v_positionEC;
        out vec3 v_normalEC;
        out vec2 v_st;

        uniform mat4 reflectorProjectionMatrix;
        uniform mat4 reflectorViewMatrix;
        uniform mat4 reflectMatrix;
        out vec4 v_worldPosition;  // 世界坐标
        out vec4 v_uv;             // 纹理坐标

        void main() {
        vec4 pMars3D = czm_computePosition();

        v_positionEC = (czm_modelViewRelativeToEye * pMars3D).xyz;      // position in eye coordinates
        v_normalEC = czm_normal * normal;                         // normal in eye coordinates
        v_st = st;

        mat4 modelView = reflectorViewMatrix * reflectMatrix * czm_model;
        modelView[3][0] = 0.0;
        modelView[3][1] = 0.0;
        modelView[3][2] = 0.0;
        v_uv = reflectorProjectionMatrix * modelView * pMars3D;
        vec4 positionMC = vec4(position3DHigh + position3DLow, 1.0);
        v_worldPosition = czm_model * positionMC;

        gl_Position = czm_modelViewProjectionRelativeToEye * pMars3D;
        }
        `
    }
    createFSWaterFace() {
        // return
        // `
        // uniform sampler2D reflexTexture; // 反射贴图
        // uniform sampler2D normalTexture; // 法线贴图
        // uniform float time;

        // uniform mat4 fixedFrameToEastNorthUpTransform; // 水面的东北天矩阵的逆矩阵

        // // 从顶点着色器传来的
        // in vec4 v_worldPosition; // 当前像素的世界坐标
        // in vec4 v_uv; // 原本的纹理坐标乘以贴图矩阵

        // // 可配置的参数
        // uniform float ripple; // 波纹大小（数值越大波纹越密集）
        // uniform vec4 waterColor; // 水面颜色
        // uniform float waterAlpha; // 水面透明度
        // uniform float reflectivity; // 水面反射率
        // uniform vec3 lightDirection; // 光照方向
        // uniform float shiny; // 光照强度
        // uniform float distortion; // 倒影的扭曲程度
        // uniform float specularIntensity;
        // uniform float globalAlpha;

        // const vec3 sunColor = vec3(1.0);

        // // 获取噪声
        // // vec4 czm_getWaterNoise(sampler2D normalMap, vec2 uv, float time, float angleInRadians)
        // vec4 mars3d_getNoise(sampler2D normalMap, vec2 uv) {
        // vec2 uv0 = (uv / 103.0) + vec2(time / 17.0, time / 29.0);
        // vec2 uv1 = uv / 107.0 - vec2(time / -19.0, time / 31.0);
        // vec2 uv2 = uv / vec2(8907.0, 9803.0) + vec2(time / 101.0, time / 97.0);
        // vec2 uv3 = uv / vec2(1091.0, 1027.0) - vec2(time / 109.0, time / -113.0);
        // vec4 noise = texture(normalMap, uv0) +
        //     texture(normalMap, uv1) +
        //     texture(normalMap, uv2) +
        //     texture(normalMap, uv3);
        // return noise * 0.5 - 1.0;
        // }

        // void mars3d_sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor) {
        // vec3 sunDirection = normalize(lightDirection);
        // vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));  // 获得太阳对表面法线的反射向量
        // float direction = max(0.0, dot(eyeDirection, reflection));  // 当太阳反射方向和眼睛的方向一致时，direction 最大，为 1，当角度大于 90度时最小，最小为 0
        // specularColor += pow(direction, shiny) * sunColor * spec;
        // diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;
        // }

        // czm_material czm_getMaterial(czm_materialInput materialInput) {
        // czm_material material = czm_getDefaultMaterial(materialInput);

        //     // 通过法线贴图计算新的表面法线
        // vec2 transformedSt = materialInput.st * 2.0 - 1.0;  // [0, 1] => [-1, 1]
        // vec4 noise = mars3d_getNoise(normalTexture, transformedSt * ripple);
        // vec3 surfaceNormal = normalize(noise.xzy);  // [0, +1]，Y up

        //     // 漫反射光
        // vec3 diffuseLight = vec3(0.0);
        //     // 高光
        // vec3 specularLight = vec3(0.0);

        //     // 获取视线方向（世界坐标）
        // vec3 eye = (czm_inverseView * vec4(vec3(0.0), 1.0)).xyz;
        //     // 获取视线方向（水面的本地坐标）
        // eye = (fixedFrameToEastNorthUpTransform * vec4(eye, 1.0)).xyz;
        //     // 当前像素的本地坐标
        // vec3 world = (fixedFrameToEastNorthUpTransform * vec4(v_worldPosition.xyz, 1.0)).xyz;

        // vec3 worldToEye = eye - world;  // east, north, up
        // worldToEye = vec3(worldToEye.x, worldToEye.z, -worldToEye.y);  // Y up
        // vec3 eyeDirection = normalize(worldToEye);

        // float spec = 2.0;
        // float diffuse = 0.5;
        // mars3d_sunLight(surfaceNormal, eyeDirection, shiny, spec, diffuse, diffuseLight, specularLight);

        // float distance = length(worldToEye);
        // vec2 distortion = surfaceNormal.xz * (0.001 + 1.0 / distance) * distortion;
        // vec3 reflectionSample = vec3(texture(reflexTexture, (v_uv.xy / v_uv.w) * 0.5 + 0.5 + distortion));

        // float theta = max(dot(eyeDirection, surfaceNormal), 0.0);
        // float reflectivity = reflectivity;
        // float reflectance = mix(reflectivity, 1.0, pow(1.0 - theta, 5.0));

        //     // surfaceNormal 是以反射平面为 X-Y 平面的，
        //     // 所以 eyeDirection 也得是以反射平面为 X-Y 平面。
        // vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection)) * waterColor.rgb;
        // vec3 albedo = mix(sunColor * diffuseLight * 0.3 + scatter, vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight, reflectance);
        // material.diffuse = albedo.rgb;
        // material.alpha = waterAlpha* globalAlpha;
        // material.specular = specularIntensity;

        // return material;
        // }
        // `

        return `
            in vec3 v_positionMC;\n\
            in vec3 v_positionEC;\n\
            in vec2 v_st;\n\
            void main()\n\
            {\n\
            czm_materialInput materialInput;\n\
            vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
            materialInput.s = v_st.s;\n\
            materialInput.st = v_st;\n\
            materialInput.str = vec3(v_st, 0.0);\n\
            materialInput.normalEC = normalEC;\n\
            materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
            vec3 positionToEyeEC = -v_positionEC;\n\
            materialInput.positionToEyeEC = positionToEyeEC;\n\
            czm_material material = czm_getMaterial(materialInput);\n\
            #ifdef GL_ES\n\
            out_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
            #else\n\
            out_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
            out_FragColor.a = 0.2;\n\
            #endif\n\
            }\n\
            `;
    }
    clear() {
        window.viewer.scene.primitives.remove(this.waterPrimitive);
    }
    modifyWater(waterData) {
        if (this.waterPrimitive) {
            let uniforms = this.waterPrimitive.appearance.material.uniforms;
            waterData.amplitude ? uniforms.amplitude = waterData.amplitude : null;
            waterData.animationSpeed ? uniforms.animationSpeed = waterData.animationSpeed : null;
            waterData.frequency ? uniforms.frequency = waterData.frequency : null;
            waterData.baseWaterColor ? uniforms.baseWaterColor = Color.fromCssColorString(waterData.baseWaterColor) : null;
        }
    }

}