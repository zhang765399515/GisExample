import { Cartesian3, EventDriven, GeokeyTerrainProvider, } from "geokey-gis";
import ViewshedAnalysis from "./ViewshedAnalysis"

let viewshedAnalysis: ViewshedAnalysis;
export async function openViewshedAnalysis() {
    let elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem', {
        requestVertexNormals: true,
        requestWaterMask: true
    });
    window.viewer.terrainProvider = elevationLayer;

    viewshedAnalysis = new ViewshedAnalysis(window.viewer);

    const handler = new EventDriven(window.viewer)
    handler.addEvent('LEFT_CLICK', (movement: any) => {
        const position = movement.cartesian;

        viewshedAnalysis.start(position, {
            radius: 2000,
            horizontalAngle: 120,
            verticalAngle: 90,
            resolution: 50
        });

        viewshedAnalysis.addViewerMarker();
    })
}

/**
 * 清除可视域分析
 */
export function stopViewshedAnalysis() {
    viewshedAnalysis.clear();
}
