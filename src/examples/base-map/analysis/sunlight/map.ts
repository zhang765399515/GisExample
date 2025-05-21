import SunlightAnalysis from "./SunlightAnalysis"
import SunlightIntensityAnalysis from "./SunlightIntensityAnalysis"

let sunlightAna: SunlightAnalysis;
export function sunlightAnalysis() {
    sunlightAna = new SunlightAnalysis(window.viewer);

    // 设置分析时间范围（例如：一天的日照变化）
    const startDate = new Date(2024, 0, 1, 11, 0, 0);  // 1月1日 6:00
    const endDate = new Date(2024, 0, 1, 18, 0, 0);   // 1月1日 18:00

    sunlightAna.setTimeRange(startDate, endDate);
    sunlightAna.enableShadows();
    sunlightAna.start();
}

/**
 * 关闭日照分析
 */
export function stopSSunlightAnalysis () {
    sunlightAna.disableShadows();
    sunlightAna.stop();
}
