import { Cartesian3, GeokeyTerrainProvider, Skyline } from 'geokey-gis';

export async function openSkyLine() {
    const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=DP_dem600_new');
    window.viewer.terrainProvider = elevationLayer;
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

    const skyLine = new Skyline(window.viewer, {
        position: null
    })
}