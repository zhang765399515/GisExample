import { Color, Cartesian2, Cartesian3, Cartographic, Entity, Property, JulianDate, Simon1994PlanetaryPositions, CallbackProperty } from "geokey-gis";
import SunlightAnalysis from "./SunlightAnalysis";

/**
 * 太阳光照强度分析
 */
class SunlightIntensityAnalysis extends SunlightAnalysis {
    private _intensityPoints: Entity[] = [];

    // 在指定位置添加光照强度检测点
    addIntensityPoint(position: Cartesian3) {
        const point = this._viewer.entities.add({
            position: position,
            point: {
                pixelSize: 10,
                color: Color.YELLOW,
                outlineColor: Color.BLACK,
                outlineWidth: 2
            },
            label: {
                text: '光照强度: 计算中...',
                font: '14px sans-serif',
                pixelOffset: new Cartesian2(0, -20)
            }
        });

        this._intensityPoints.push(point);
        return point;
    }

    // 计算光照强度
    calculateIntensity(position: Cartesian3, time: JulianDate) {
        // 获取太阳位置
        const sunPosition = Simon1994PlanetaryPositions.computeSunPositionInEarthInertialFrame(time);

        // 计算太阳高度角
        const sunCartographic = Cartographic.fromCartesian(sunPosition);
        const pointCartographic = Cartographic.fromCartesian(position);

        // 计算光照强度（简化模型）
        const angle = Math.sin(sunCartographic.height);
        const intensity = Math.max(0, angle * 100); // 0-100的强度值

        return intensity;
    }

    // 更新所有检测点的光照强度
    updateIntensities() {
        if (!this._isAnalysisActive) return;

        const currentTime = this._viewer.clock.currentTime;

        this._intensityPoints.forEach(point => {
            const position = point.position?.getValue(currentTime);
            if (position) {
                const intensity = this.calculateIntensity(position, currentTime);
                point.label!.text = new CallbackProperty(() => `光照强度: ${intensity.toFixed(1)}%`, false);

                // 根据光照强度改变点的颜色
                const color = Color.fromHsl(0.1, 1.0, intensity / 100);
                point.point!.color = new CallbackProperty(() => color, false);
            }
        });
    }

    // 开始分析并更新强度
    start() {
        super.start();
        this._viewer.scene.preRender.addEventListener(() => {
            this.updateIntensities();
        });
    }
}

export default SunlightIntensityAnalysis