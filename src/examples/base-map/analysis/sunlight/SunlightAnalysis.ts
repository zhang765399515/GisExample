import { Cartesian3, Cartesian2, Entity, JulianDate, ShadowMode, Viewer, } from "geokey-gis";

class SunlightAnalysis {
    _viewer: Viewer;
    _isAnalysisActive: boolean = false;

    constructor(viewer: Viewer) {
        this._viewer = viewer;
        // 启用光照效果
        this._viewer.scene.globe.enableLighting = true;
    }

    start() {
        this._isAnalysisActive = true;

        // 设置时间流动速度（这里设置为60倍速）
        this._viewer.clock.multiplier = 60;

        // 设置时间流动
        this._viewer.clock.shouldAnimate = true;

        // 添加时间控制器
        this._viewer.animation.viewModel.timeFormatter = (date: any) => {
            return JulianDate.toDate(date).toLocaleString();
        };
    }

    stop() {
        this._isAnalysisActive = false;
        this._viewer.clock.shouldAnimate = false;
    }

    // 设置特定时间
    setTime(date: Date) {
        const julianDate = JulianDate.fromDate(date);
        this._viewer.clock.currentTime = julianDate;
    }

    // 设置时间范围
    setTimeRange(startDate: Date, endDate: Date) {
        const start = JulianDate.fromDate(startDate);
        const end = JulianDate.fromDate(endDate);

        this._viewer.clock.startTime = start;
        this._viewer.clock.currentTime = start;
        this._viewer.clock.stopTime = end;
        this._viewer.timeline.zoomTo(start, end);
    }

    // 设置时间流动速度
    setSpeed(multiplier: number) {
        this._viewer.clock.multiplier = multiplier;
    }

    // 添加阴影显示
    enableShadows() {
        this._viewer.scene.globe.enableLighting = true;
        this._viewer.shadows = true;
        this._viewer.terrainShadows = ShadowMode.ENABLED;
    }

    // 关闭阴影显示
    disableShadows() {
        this._viewer.scene.globe.enableLighting = false;
        this._viewer.shadows = false;
        this._viewer.terrainShadows = ShadowMode.DISABLED;
    }
}

export default SunlightAnalysis