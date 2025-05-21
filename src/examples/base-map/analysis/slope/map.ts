import {
    Cartographic,
    CMath,
    Cartesian3,
    Primitive,
    GeokeyTerrainProvider,
    SlopeAspectAnalysis
} from 'geokey-gis';


let SlopeAspectObj: SlopeAspectAnalysis;
export async function init() {
    const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=DP_dem600_new');
    setTimeout(() => {
        window.viewer.terrainProvider = elevationLayer;
        SlopeAspectObj = new SlopeAspectAnalysis(window.viewer);
        window.viewer.camera.setView({
            destination: new Cartesian3(
                -2442860.655868229,
                5367465.605868203,
                2434892.2854271014
            ),
            orientation: {
                heading: 6.008301246795102,
                pitch: -0.6502785231866124,
                roll: 0.00021982442927548362,
            },
        });
    }, 1000);
}
export function IsometricAnalysis() {
    SlopeAspectObj.clearAll();
    SlopeAspectObj.MOUSE_MOVE_TIP();
    SlopeAspectObj.IsometricAnalysis(0.05);
}
export function EqualDivisionAnalysis() {
    SlopeAspectObj.clearAll();
    SlopeAspectObj.MOUSE_MOVE_TIP();
    SlopeAspectObj.EqualDivisionAnalysis(20);
}
export function deleteAll() {
    SlopeAspectObj.clearAll();
}