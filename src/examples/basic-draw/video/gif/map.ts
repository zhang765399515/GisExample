import { 
    Cartesian3, 
    CustomDataSource, 
    PolylineGlowMaterialProperty,
    Color, 
    Entity, 
    Plane,
    Cartesian2,
    ImageMaterialProperty,
    VerticalOrigin,
    CallbackProperty
} from 'geokey-gis';
import SuperGif from 'libgif'
export function loadGif(options) {
  if (SuperGif && options && options.position) {
    var gif = [],
      url = options.url,
      i = 0,
      speed = 6

    // 遍历gif的每一帧
    const parseGifImages = function (url, imageArr) {

      var img = document.createElement('img')
      img.src = url
      img.setAttribute('rel:animated_src', url) // gif库需要img标签配置下面两个属性
      img.setAttribute('rel:auto_play', '0')
      var div = document.getElementById('gif-div');
      div.appendChild(img)
      // document.body.appendChild(img);
      // 新建gif实例
      var rub = new SuperGif({
        gif: img
      })
      return new Promise((resolve) => {
        rub.load(() => {
          for (let i = 1; i <= rub.get_length(); i++) {
            rub.move_to(i)
            imageArr.push(rub.get_canvas().toDataURL())
          }
          resolve(imageArr)
        })
      })
    }

    parseGifImages(url, gif)
    return window.viewer.entities.add({
      position: options.position,
      billboard: {
        verticalOrigin: VerticalOrigin.BASELINE,
        image: new CallbackProperty(function () {
          if (gif.length) { 
            if (i < speed * (gif.length - 1)) {
              i++
            } else {
              i = 0
            }
            return gif[Math.floor(i / speed)]
          } else {
            return url 
          }
        }, false),
        scale: 0.2
      }
    })
  }
  }