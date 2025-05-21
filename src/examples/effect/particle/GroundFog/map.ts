import { GroundFog, GeokeyTerrainProvider } from 'geokey-gis'
let fog: GroundFog;

export function addFog() {
    fog = new GroundFog({
        longitude: 113.952492,
        latitude: 22.534648,
    }, window.viewer);
    window.viewer.goTo({
        center: [113.952492, 22.534648, 10000]
    })
}

export function removeFog() {
    fog.removePostProcessStage();
}


export async function addTile() {
    const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem', {
        requestVertexNormals: true,
        requestWaterMask: true
    });

    window.viewer.terrainProvider = elevationLayer;
}