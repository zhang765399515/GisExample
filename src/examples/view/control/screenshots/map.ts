import { Geokey3DTileset } from "geokey-gis"
export function load3dtiles() {
    const tile = window.viewer.scene.primitives.add(new Geokey3DTileset({
      url: "http://14.22.86.227:12022/service/gis/3DModel/shenzhen_jianzhu/tileset.json?serviceName=sz_baimo"
    }));
    tile.readyPromise.then((til) => {
      window.viewer.zoomTo(tile);
    });
  }
/**
 * @description: 场景导出
 * @param {*} _viewer
 * @return {*}
 */
export function saveToImage(_viewer) {
    _viewer.render();
    let canvas = _viewer.scene.canvas;
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    let link = document.createElement("a");
    let blob = dataURLtoBlob(image);
    let objurl = URL.createObjectURL(blob);
    link.download = "scene.png";
    link.href = objurl;
    link.click();
}
 
export function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}


 

