
import { EventDriven, Matrix4, Cartesian3, Cartesian2, CMath, ConeEmitter, Color, ParticleSystem } from 'geokey-gis';
import fireImg from './fire.png';
let leftEvent: EventDriven | null = null;;
let particleSystem = undefined;
export function addFire() {
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
    leftEvent = new EventDriven(window.viewer);
    leftEvent.addEvent('LEFT_CLICK', (e: any) => {
        // if(particleSystem){
        //     window.viewer.scene.primitives.remove(particleSystem); //删除粒子对象
        // }
        particleSystem = createParticleSystem(e.mapPoint.longitude, e.mapPoint.latitude, e.mapPoint.height);
        particleSystem.name = 'fire'
        window.viewer.scene.primitives.add(particleSystem);
    });
}
//创建粒子对象
export function createParticleSystem(lon: any, lat: any, height: number) {
    var emitterModelMatrixScratch = new Matrix4();
    var position1 = Cartesian3.fromDegrees(lon, lat, height + 2);
    var emitterModelMatrix = Matrix4.fromTranslation(position1, emitterModelMatrixScratch);

    return new ParticleSystem({
        image:  fireImg, 
        startColor : Color.RED.withAlpha(0.7),
        endColor : Color.YELLOW.withAlpha(0.3),
        startScale : 0,
        endScale : 10,
        minimumParticleLife : 1,
        maximumParticleLife : 6,
        minimumSpeed :1,
        maximumSpeed : 4,
        // imageSize: new Cartesian2(2,2),
        minimumImageSize: new Cartesian2(2, 2),
        maximumImageSize: new Cartesian2(3, 3),
        emissionRate: 200,
        lifetime: 10.0,
        loop: true,
        emitter: new ConeEmitter(CMath.toRadians(45.0)),
        sizeInMeters: true,
        emitterModelMatrix: emitterModelMatrix
    });
}
//移除
export function removeFire() {
    let primitives = window.viewer.scene.primitives._primitives;
    for (let i = primitives.length - 1; i >= 0; i--) {
        if (primitives[i].name == 'fire') {
            window.viewer.scene.primitives.remove(primitives[i]);
        }
    }
    particleSystem = undefined;
    leftEvent?.removeEvent('LEFT_CLICK');
}