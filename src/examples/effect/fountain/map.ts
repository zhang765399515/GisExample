
import {
    EventDriven,
    Matrix4,
    Cartesian3,
    Cartesian2,
    CMath,
    ConeEmitter,
    Color,
    ParticleSystem,
    HeadingPitchRoll,
    TranslationRotationScale,
    Quaternion,
    Transforms
} from 'geokey-gis';
import smokeImg from './smoke.png';
let leftEvent: EventDriven | null = null;;

function computeModelMatrix(position) {
    let center = Cartesian3.fromDegrees(114.07, 22.62, 5)
    let modelMatrix = Transforms.eastNorthUpToFixedFrame(center);
    return modelMatrix;
}

// 计算粒子发射器的位置姿态
function computeEmitterodelMatrix() {
    let hpr = HeadingPitchRoll.fromDegrees(0, 0, 0);
    let trs = new TranslationRotationScale();
    trs.translation = Cartesian3.fromElements(0, 0, 0);
    trs.rotation = Quaternion.fromHeadingPitchRoll(hpr);
    let Matrix = Matrix4.fromTranslationRotationScale(trs);
    return Matrix
}
export function createParticleSystem() {

    let particle = new ParticleSystem({
        image: smokeImg,
        // 从绿色到白色淡出
        startColor: Color.LIGHTCYAN.withAlpha(0.8),
        endColor: Color.WHITE.withAlpha(0.0),
        startScale: 1,// 初始缩放比例
        endScale: 50,// 最终缩放比例
        minimumSpeed: 180,
        maximumSpeed: 200,
        sizeInMeters: false, //使用米为单位，位false时以像素位单位
        emissionRate: 1000,// 发射速率
        lifetime: 0.2, // 粒子寿命 秒
        emitter: new ConeEmitter(CMath.toRadians(30.0)),// 锥形发射器
        modelMatrix: computeModelMatrix({ lon: 120.3918010, lat: 36.0733867, alt: 41 }),// 粒子系统位置矩阵
        emitterwodellatrix: computeEmitterodelMatrix(),// 发射器转换为世界坐标
    
        // 增加重力场影像，
        updateCallback: applyGravity,
    });
    
    var gravityVector = new Cartesian3();
    var gravity = -70;// !!!重力方向向上向下 -(9.8*9.8)
    function applyGravity(p, dt) {
        var position = p.position;
        Cartesian3.normalize(position, gravityVector);
        Cartesian3.multiplyByScalar(gravityVector, gravity * dt, gravityVector);
        p.velocity = Cartesian3.add(p.velocity, gravityVector, p.velocity);
    }
    
    
    let primitives = window.viewer.scene.primitives.add(particle)
    primitives.name = 'fountain'
    window.viewer.camera.setView({
        destination: Cartesian3.fromDegrees(114.07, 22.62, 500),
        orientation: {
            heading: CMath.toRadians(45),
            pitch: CMath.toRadians(-2),
            roll: CMath.toRadians(0),
        },
    });

}
//移除
export function removeFire() {
    let primitives = window.viewer.scene.primitives._primitives;
    for (let i = primitives.length - 1; i >= 0; i--) {
        if (primitives[i].name == 'fountain') {
            window.viewer.scene.primitives.remove(primitives[i]);
        }
    }
    leftEvent?.removeEvent('LEFT_CLICK');
}