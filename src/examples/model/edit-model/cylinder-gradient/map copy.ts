import {
  Color,
  Cartesian2,
  Cartesian3,
  ColorGeometryInstanceAttribute,
  Primitive,
  Entity,
  EllipseGeometry,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  PerInstanceColorAppearance,
  GeometryInstance,
  Material,
  defined,
  VertexFormat,
  HeightReference,
  MaterialAppearance,
  Ray
} from "geokey-gis";
import ColorMap from './ColorMap';
import drillData from './temperature.json';

const colorMap = new ColorMap({
  maxvalue: 40,
  minvalue: 23
});

function getColorRamp(colorMap: any[]) {
  const ramp = document.createElement('canvas');
  ramp.width = 100;
  ramp.height = 20;
  const ctx = ramp.getContext('2d');
  const len = colorMap.length;
  let values = [0.0, 1.0];
  for (let j = 0; j < len; j++) {
    values.push(colorMap[j].TIME);
  }
  values = values.sort();
  const grd = (ctx as CanvasRenderingContext2D).createLinearGradient(0, 0, 100, 0);
  for (let k = 0; k < values.length; ++k) {
    if (k == 0) {
      grd.addColorStop(values[k], '#ff0000'); //black
    } else if (k == values.length - 1) {
      grd.addColorStop(values[k], '#0000ff');
    } else {
      grd.addColorStop(values[k], `rgb(${colorMap[k - 1].CTEM})`);
    }
  }

  (ctx as CanvasRenderingContext2D).fillStyle = grd;
  (ctx as CanvasRenderingContext2D).fillRect(0, 0, 100, 20);

  document.body.appendChild(ramp);

  return ramp;
}

export function loadStereoscopicWall() {
  let celsiusLabel: any = undefined;
  drillData.forEach((items: any) => {
    for (let i = 0; i < items.TEM.length; i++) {
      const currentTemLayer = items.TEM[i];
      const lastTemLayer = items.TEM[i + 1] ? items.TEM[i + 1] : items.TEM[i];
      items.XQ.push({
        CCEL: currentTemLayer[1],
        CTEM: colorMap.fromValue(currentTemLayer[1]).color,
        LTEM: colorMap.fromValue(lastTemLayer[1]).color,
        TIME: colorMap.fromValue(currentTemLayer[1]).t,
        CDGC: currentTemLayer[0],
        TCHD: 145,
        NOTEM: false
      });
    }

    let primitive = undefined;
    for (const ng in items.XQ) {
      const res: any = items.XQ[ng];
      if (items.JD != 'null' && items.WD != 'null' && res.CDGC != 'null' && res.TCHD != 'null' && res.CDGC != null && res.TCHD != null && items.JD != null && items.WD != null) {
        var height = res.CDGC / 1;
        var extrudedHeight = (res.CDGC + res.TCHD) / 1;
        var center = Cartesian3.fromDegrees(items.JD / 1, items.WD / 1, height);
        var semiMinorAxis = 10;
        var semiMajorAxis = 10;

        const extrudedEllipse = new GeometryInstance({
          geometry: new EllipseGeometry({
            center: center,
            semiMinorAxis: semiMinorAxis,
            semiMajorAxis: semiMajorAxis,
            vertexFormat: VertexFormat.DEFAULT,
            rotation: 5.0,
            height: 100,
            stRotation: 45,
            extrudedHeight: 50
          }),
          attributes: {
            color: res.CTEM && ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(`rgb(${res.CTEM})`))
          }
        });

        extrudedEllipse.id = {
          id: items.ZKBH,
          tem: res.CCEL,
          name: 'drill'
        };
        const dynamicTextureMappingMaterial = new Material({
          fabric: {
            //材质类型
            type: 'dynamicTextureMappingMaterial',
            //参数传递
            uniforms: {
              image: '/image/3DModel/1-2.png',
              color: Color.AQUAMARINE,
              textureScaleX:1,
              textureScaleY:1,
            },
            //glsl源码
            source: `
              czm_material czm_getMaterial(czm_materialInput materialInput){
                czm_material material = czm_getDefaultMaterial(materialInput);
                // vec2 texCoords = vec2(materialInput.st.s, materialInput.st.t);
                vec2 texCoords = vec2(
                  mod(materialInput.st.s * textureScaleX, 1.0), // x方向上的平铺
                  mod(materialInput.st.t * textureScaleY, 1.0)  // y方向上的平铺
                );
                vec2 coords = materialInput.st;
                vec4 textureColor = texture2D(image, texCoords);
                material.diffuse = textureColor.rgb;
                
                return material;
              }`
          }
        });

        // const appearance = new MaterialAppearance({
        //   material: new Material({
        //     fabric: {
        //       type: 'Color',
        //       uniforms: {
        //         color: Color.GRAY
        //       }
        //     }
        //   }),
        //   vertexShaderSource: `
        //     attribute vec3 position3DHigh;  
        //     attribute vec3 position3DLow;
        //     attribute float batchId;
        //     attribute vec4 color;

        //     varying vec4 v_positionEC;
        //     varying vec4 v_color;

        //     void main(){
        //       v_color = color;
        //       vec4 p = czm_computePosition();
        //       vec4 eyePosition = czm_modelViewRelativeToEye * p;
        //       v_positionEC =  czm_inverseModelView * eyePosition;
        //       gl_Position = czm_modelViewProjectionRelativeToEye * p;
        //     }
        //   `,
        //   fragmentShaderSource: `           
        //     varying vec4 v_positionEC;
        //     varying vec3 v_normalEC;
        //     varying vec4 v_color;

        //     uniform vec4 color;

        //     void main() {
        //       float distance = sqrt(pow(v_positionEC.x, 2.0) + pow(v_positionEC.y, 2.0) + pow(v_positionEC.z, 2.0));
        //       float cy3 = fract(abs(distance - 145.0) / 300.0);
        //       // vec3 ccolor = vec3(${res.LTEM});
        //       vec3 cccolor = mix(v_color.rgb, color.rgb, cy3);
        //       gl_FragColor = vec4(v_color.rgb, 1.0);
        //     }`,
        //   flat: true
        // });
        primitive = new Primitive({
          geometryInstances: extrudedEllipse,
          appearance: new MaterialAppearance({
            material: dynamicTextureMappingMaterial,
            translucent:false,
            closed:true,
          }),
          asynchronous: false,
        });
      }
      window.viewer.scene.primitives.add(primitive);
    }
  });

  const handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  //鼠标点击事件
  handler.setInputAction((event: any) => {
    const ray = window.viewer.camera.getPickRay(event.endPosition) as Ray;
    const radiusCartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    const pickedObejct = window.viewer.scene.pick(event.endPosition);
    if (!defined(radiusCartesian)) {
      return;
    }
    celsiusLabel && window.viewer.entities.remove(celsiusLabel);
    if (pickedObejct && pickedObejct.id && pickedObejct.id.tem) {
      celsiusLabel = window.viewer.entities.add({
        name: 'Celsius',
        position: pickedObejct.primitive._instanceBoundingSpheres[0].center,
        label: {
          text: `${pickedObejct.id.tem}℃`,
          fillColor: Color.AQUA,
          outlineColor: Color.WHITE,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          outlineWidth: 1,
          scale: 0.5,
          pixelOffset: new Cartesian2(50, 0)
        }
      });
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);

  window.viewer.goTo({
    center: [114.41303861, 22.71387825, 1000]
  });
}
