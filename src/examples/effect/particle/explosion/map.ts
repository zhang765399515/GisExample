/*
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2024-04-17 17:48:11
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2024-04-17 17:50:35
 * @FilePath: \vite-pgEarth\src\examples\effect\particle\explosion\map.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventDriven, Matrix4, Cartesian3, Cartesian2, CMath, ConeEmitter, Color, ParticleSystem,ParticleBurst,CircleEmitter} from 'geokey-gis';
import fireImg from './fire.png';
let leftEvent: EventDriven | null = null;;
let particleSystem = undefined;
export function addExplosion() {
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
    leftEvent = new EventDriven(window.viewer);
    leftEvent.addEvent('LEFT_CLICK', (e: any) => {
        // if(particleSystem){
        //     window.viewer.scene.primitives.remove(particleSystem); //删除粒子对象
        // }
        particleSystem = createParticleSystem(e.mapPoint.longitude, e.mapPoint.latitude, e.mapPoint.height);
        particleSystem.name = 'Explosion'
        window.viewer.scene.primitives.add(particleSystem);
    });
}
//创建粒子对象
export function createParticleSystem(lon: any, lat: any, height: number) {
    var emitterModelMatrixScratch = new Matrix4();
    var position1 = Cartesian3.fromDegrees(lon,lat,height+2);
    var emitterModelMatrix = Matrix4.fromTranslation(position1, emitterModelMatrixScratch);
    return new ParticleSystem({
        image: fireImg,
        startColor : Color.RED.withAlpha(0.9),
        endColor : Color.YELLOW.withAlpha(0.2),
        startScale : 0,
        endScale : 10,
        minimumParticleLife : 1,
        maximumParticleLife : 6,
        minimumSpeed :1,
        maximumSpeed : 4,
        imageSize : new Cartesian2(30, 30),
        // Particles per second.
        bursts: [  //在周期性的时间发射粒子爆发。在给定时刻,这些爆炸效果会产生随机个粒子,在设定最少和最多值之间。
            new ParticleBurst({ time: 0.6, minimum: 0, maximum: 40 }),
            new ParticleBurst({ time: 1.2, minimum: 0, maximum: 80 }),
        ],
        emissionRate : 2,
        lifetime : 0.5,
        emitter : new CircleEmitter(5.0),
        emitterModelMatrix: emitterModelMatrix
    });
}
//移除
export function removeExplosion() {
    let primitives = window.viewer.scene.primitives._primitives;
    for (let i = primitives.length - 1; i >= 0; i--) {
        if (primitives[i].name == 'Explosion') {
            window.viewer.scene.primitives.remove(primitives[i]);
        }
    }
    particleSystem = undefined;
    leftEvent?.removeEvent('LEFT_CLICK');
}