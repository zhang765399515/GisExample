import {  Cartesian3,  ColorBlendMode, Color } from 'geokey-gis';
import menu from './menu.json';

export function loadGltf() {
  window.viewer.goTo({
    center: [114.0548501, 22.559447, 500]
  });

  const url = "http://gisserver.igeokey.com:12022/service/gis/3DModel/?serviceName=luse_1&uuid=1";
  window.viewer.entities.add({
    position: Cartesian3.fromDegrees(114.054801, 22.559947),
    model: {
      uri: url,
    }
  });
  let trackedEntity = window.viewer.entities.add({
    position: Cartesian3.fromDegrees(114.055301, 22.558947),
    model: {
      uri: url,
      colorBlendMode: ColorBlendMode.REPLACE
    }
  });

  let trackedEntity1 = window.viewer.entities.add({
    position: Cartesian3.fromDegrees(114.054301, 22.558947),
    model: {
      uri: url
    }
  });

  setTimeout(() => {
    trackedEntity.model.color = Color.RED.withAlpha(1.0);
    trackedEntity1.model.color = Color.RED.withAlpha(1.0);
  }, 1000);
}
