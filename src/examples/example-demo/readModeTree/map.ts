import {
    Geokey3DTileset
} from "geokey-gis"
let showLocation = false;
let tilesetData = {};
export function load3dtiles(fileUrl: any, callBack: (arg0: any[]) => void) {
    const tile = window.viewer.scene.primitives.add(
        new Geokey3DTileset({
            url: fileUrl,
        })
    );
    tile.readyPromise.then(r => {
        window.viewer.zoomTo(r)
    })
    tile.tileLoad.addEventListener(layer => {
        let layerChildren = layer.tileset.root.children;
        layerChildren.forEach(e => {
            if (e._content?.batchTable) {
                if (e._content.batchTable._features.length > 1) {
                    let nameAll = e._content.batchTable._propertyTable._jsonMetadataTable._properties.name;
                    nameAll.forEach((f, index) => {
                        if (!tilesetData[f]) {
                            tilesetData[f] = [];
                        }
                        e._content.batchTable._features[index].show=false
                        tilesetData[f].push(e._content.batchTable._features[index]);
                    });
                } else {
                    let _properties = e._content.batchTable._propertyTable._jsonMetadataTable._properties;
                    if (!tilesetData[_properties.name[0]]) {
                        tilesetData[_properties.name[0]] = [];
                    }
                    e._content.batchTable._features[0].show = false;
                    tilesetData[_properties.name[0]].push(e._content.batchTable._features[0], e);

                }

            }
        });
        if (typeof callBack == "function") {
            callBack(tilesetData);
        }
    })
}
export function loadLayer(name,check){
    for (const i in tilesetData) {
        if(name == i){
            tilesetData[i].forEach(e=>{
                e.show = check;
            })
        }
    }
}
