import {
    Geokey3DTileset
} from "geokey-gis"
let showLocation = false;
let tilesetData = {};
export function load3dtiles(data, check, fileUrl) {
    if (check) {
        const tile = window.viewer.scene.primitives.add(
            new Geokey3DTileset({
                url: `${fileUrl}/${data.childrenId}/tileset.json`,
            })
        );
        tilesetData[data.childrenId] = tile;
        tile.readyPromise.then(r => {
            if (showLocation == false) {
                window.viewer.zoomTo(r)
                showLocation = true;
            }
        })
    }else{
        for (const key in tilesetData) {
            if(key == data.childrenId){
                window.viewer.scene.primitives.remove(tilesetData[key]);
                delete tilesetData[key];
            }
        }
    }
}