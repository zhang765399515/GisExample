import {
  Color,
  Cartesian3,
  ColorGeometryInstanceAttribute,
  Primitive,
  Entity,
  EllipseGeometry,
  PerInstanceColorAppearance,
  GeometryInstance,
  Material,
  VertexFormat,
  WallGeometry,
  HeightReference,
  MaterialAppearance
} from "geokey-gis";
// import drillData from './temperature.json';
import drillData from './newDrill.json';

(Material as any).GradientDrillingMaterialType = 'GradientDrilling';
(Material as any)._materialCache.addMaterial((Material as any).GradientDrillingMaterialType, {
  fabric: {
    type: 'GradientDrilling',
    uniforms: {
      color1: Color.BLACK,
      color2: Color.RED,
      depth: 50
    },
    source: `uniform sampler2D image;
      czm_material czm_getMaterial(czm_materialInput materialInput){
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 coords = materialInput.st;
        vec3 position = materialInput.positionToEyeEC;
        float height = materialInput.height;
        vec3 normalEC = materialInput.normalEC;
        vec3 color = mix(color1.rgb, color2.rgb, 0.5);
        material.diffuse = color;
        material.normal = normalEC;
        material.alpha = 1.0;
        return material;
      }`
  },
  translucent: false
});

const drillColor: { [key: string]: string } = {
  '2': 'rgb(130,130,130)',
  '3': 'rgb(190,190,190)',
  '4': 'rgb(160,160,160)',
  '8': 'rgb(253,246,172)',
  '9': 'rgb(180,180,180)',
  '10': 'rgb(251,239,89)',
  '14': 'rgb(211,230,0)',
  '15': 'rgb(173,188,0)',
  '16': 'rgb(204,255,102)',
  '17': 'rgb(156,236,0)',
  '18': 'rgb(78,138,0)',
  '19': 'rgb(152,248,191)',
  '20': 'rgb(179,255,203)',
  '21': 'rgb(36,152,200)',
  '22': 'rgb(151,254,236)',
  '23': 'rgb(130,230,203)',
  '24': 'rgb(102,254,229)',
  '25': 'rgb(192,239,239)',
  '26': 'rgb(255,228,222)',
  '27': 'rgb(230,232,232)',
  '28': 'rgb(200,200,200)',
  '29': 'rgb(177,177,177)',
  '30': 'rgb(150,150,150)',
  '31': 'rgb(255,178,26)',
  '32': 'rgb(205,127,1)',
  '33': 'rgb(255,5,176)',
  '34': 'rgb(239,109,191)',
  '35': 'rgb(254,102,177)',
  '36': 'rgb(241,1,108)',
  '37': 'rgb(255,102,52)',
  '38': 'rgb(255,152,53)',
  '39': 'rgb(237,79,55)',
  '40': 'rgb(255,127,204)',
  '41': 'rgb(255,127,204)',
  '42': 'rgb(213,59,161)',
  '43': 'rgb(229,127,113)',
  '44': 'rgb(209,240,209)',
  '45': 'rgb(255,177,102)',
  '1-1': 'rgb(255,251,221)',
  '1-2': 'rgb(235,231,201)',
  '1-3': 'rgb(245,241,211)',
  '1-4': 'rgb(215,211,181)',
  '5-1': 'rgb(120,120,120)',
  '5-2': 'rgb(220,220,220)',
  '5-3': 'rgb(200,200,200)',
  '5-4': 'rgb(240,230,60)',
  '6-1': 'rgb(140,140,140)',
  '6-2': 'rgb(235,245,151)',
  '6-3': 'rgb(253,246,172)',
  '6-4': 'rgb(251,238,85)',
  '7-1': 'rgb(210,210,210)',
  '7-2': 'rgb(253,248,193)',
  '7-3': 'rgb(252,244,150)',
  '7-4': 'rgb(249,234,47)',
  '11-1': 'rgb(255,241,40)',
  '11-2': 'rgb(255,236,2)',
  '12-1': 'rgb(251,209,144)',
  '12-2': 'rgb(245,173,109)',
  '12-3': 'rgb(241,146,113)',
  '13-1': 'rgb(255,95,95)',
  '13-2': 'rgb(255,21,21)',
  '13-3': 'rgb(171,28,28)',
  '14-1': 'rgb(250,255,185)',
  '14-2': 'rgb(242,255,103)',
  '14-3': 'rgb(230,250,52)',
  '14-4': 'rgb(220,240,26)',
  '14-5': 'rgb(211,230,0)',
  '14-6': 'rgb(100,100,100)',
  '15-1': 'rgb(217,255,24)',
  '15-2': 'rgb(205,242,0)',
  '15-3': 'rgb(202,242,0)',
  '15-4': 'rgb(197,220,0)',
  '15-5': 'rgb(173,188,0)',
  '15-6': 'rgb(100,100,100)',
  '16-1': 'rgb(242,255,205)',
  '16-2': 'rgb(231,245,180)',
  '16-3': 'rgb(227,255,159)',
  '16-4': 'rgb(212,255,118)',
  '16-5': 'rgb(204,155,102)',
  '16-6': 'rgb(100,100,100)',
  '17-1': 'rgb(178,255,76)',
  '17-2': 'rgb(172,251,38)',
  '17-3': 'rgb(169,247,26)',
  '17-4': 'rgb(162,241,13)',
  '17-5': 'rgb(156,230,0)',
  '17-6': 'rgb(100,100,100)',
  '18-1': 'rgb(153,255,50)',
  '18-2': 'rgb(119,230,0)',
  '18-3': 'rgb(116,206,0)',
  '18-4': 'rgb(91,168,0)',
  '18-5': 'rgb(78,138,0)',
  '18-6': 'rgb(100,100,100)',
  '19-1': 'rgb(217,255,229)',
  '19-2': 'rgb(202,255,221)',
  '19-3': 'rgb(187,255,213)',
  '19-4': 'rgb(170,252,202)',
  '19-5': 'rgb(217,255,229)',
  '19-6': 'rgb(100,100,100)',
  '20-1': 'rgb(179,255,203)',
  '20-2': 'rgb(153,255,198)',
  '20-3': 'rgb(127,250,191)',
  '20-4': 'rgb(102,244,182)',
  '20-5': 'rgb(179,255,203)',
  '20-6': 'rgb(100,100,100)',
  '21-1': 'rgb(159,211,238)',
  '21-2': 'rgb(123,194,231)',
  '21-3': 'rgb(82,176,224)',
  '21-4': 'rgb(45,163,217)',
  '21-5': 'rgb(36,152,200)',
  '21-6': 'rgb(100,100,100)',
  '22-1': 'rgb(219,255,241)',
  '22-2': 'rgb(200,255,173)',
  '22-3': 'rgb(186,255,222)',
  '22-4': 'rgb(178,254,241)',
  '22-5': 'rgb(151,254,236)',
  '22-6': 'rgb(100,100,100)',
  '23-1': 'rgb(153,255,229)',
  '23-2': 'rgb(147,248,221)',
  '23-3': 'rgb(141,242,215)',
  '23-4': 'rgb(135,236,209)',
  '23-5': 'rgb(130,230,236)',
  '23-6': 'rgb(100,100,100)',
  '24-1': 'rgb(203,255,242)',
  '24-2': 'rgb(177,254,244)',
  '24-3': 'rgb(152,254,239)',
  '24-4': 'rgb(127,254,234)',
  '24-5': 'rgb(135,236,209)',
  '24-6': 'rgb(100,100,100)',
  '25-1': 'rgb(192,239,239)',
  '25-2': 'rgb(184,237,239)',
  '25-3': 'rgb(169,234,240)',
  '25-4': 'rgb(153,229,229)',
  '25-5': 'rgb(192,239,239)',
  '25-6': 'rgb(100,100,100)',
  '26-1': 'rgb(254,242,242)',
  '26-2': 'rgb(255,238,238)',
  '26-3': 'rgb(255,234,234)',
  '26-4': 'rgb(255,231,227)',
  '26-5': 'rgb(255,228,222)',
  '26-6': 'rgb(100,100,100)',
  '27-1': 'rgb(248,248,248)',
  '27-2': 'rgb(245,245,245)',
  '27-3': 'rgb(242,242,242)',
  '27-4': 'rgb(235,235,235)',
  '27-5': 'rgb(230,232,232)',
  '27-6': 'rgb(100,100,100)',
  '28-1': 'rgb(225,225,225)',
  '28-2': 'rgb(219,219,219)',
  '28-3': 'rgb(213,213,213)',
  '28-4': 'rgb(207,207,207)',
  '28-5': 'rgb(200,200,200)',
  '28-6': 'rgb(100,100,100)',
  '29-1': 'rgb(217,217,217)',
  '29-2': 'rgb(207,207,207)',
  '29-3': 'rgb(197,197,197)',
  '29-4': 'rgb(187,187,187)',
  '29-5': 'rgb(177,177,177)',
  '29-6': 'rgb(100,100,100)',
  '30-1': 'rgb(170,170,170)',
  '30-2': 'rgb(164,164,164)',
  '30-3': 'rgb(158,158,158)',
  '30-4': 'rgb(154,154,154)',
  '30-5': 'rgb(150,150,150)',
  '30-6': 'rgb(100,100,100)',
  '31-1': 'rgb(255,220,151)',
  '31-2': 'rgb(255,201,106)',
  '31-3': 'rgb(255,182,61)',
  '31-4': 'rgb(255,160,38)',
  '31-5': 'rgb(255,178,26)',
  '31-6': 'rgb(100,100,100)',
  '32-1': 'rgb(246,151,0)',
  '32-2': 'rgb(230,140,0)',
  '32-3': 'rgb(219,134,1)',
  '32-4': 'rgb(212,130,1)',
  '32-5': 'rgb(205,127,1)',
  '32-6': 'rgb(100,100,100)',
  '33-1': 'rgb(255,173,227)',
  '33-2': 'rgb(255,153,218)',
  '33-3': 'rgb(255,109,205)',
  '33-4': 'rgb(255,69,192)',
  '33-5': 'rgb(255,5,176)',
  '33-6': 'rgb(100,100,100)',
  '34-1': 'rgb(255,127,204)',
  '34-2': 'rgb(251,121,199)',
  '34-3': 'rgb(247,116,194)',
  '34-4': 'rgb(243,110,189)',
  '34-5': 'rgb(239,109,191)',
  '34-6': 'rgb(100,100,100)',
  '35-1': 'rgb(241,155,198)',
  '35-2': 'rgb(249,132,184)',
  '35-3': 'rgb(252,117,180)',
  '35-4': 'rgb(253,109,178)',
  '35-5': 'rgb(254,102,177)',
  '35-6': 'rgb(100,100,100)',
  '36-1': 'rgb(255,125,183)',
  '36-2': 'rgb(255,100,168)',
  '36-3': 'rgb(254,88,158)',
  '36-4': 'rgb(254,76,152)',
  '36-5': 'rgb(241,1,108)',
  '36-6': 'rgb(100,100,100)',
  '37-1': 'rgb(255,220,151)',
  '37-2': 'rgb(255,138,115)',
  '37-3': 'rgb(255,120,89)',
  '37-4': 'rgb(255,96,65)',
  '37-5': 'rgb(255,102,52)',
  '37-6': 'rgb(100,100,100)',
  '38-1': 'rgb(255,181,115)',
  '38-2': 'rgb(255,169,94)',
  '38-3': 'rgb(255,157,73)',
  '38-4': 'rgb(255,154,63)',
  '38-5': 'rgb(255,152,53)',
  '38-6': 'rgb(100,100,100)',
  '39-1': 'rgb(255,118,89)',
  '39-2': 'rgb(250,104,77)',
  '39-3': 'rgb(245,91,66)',
  '39-4': 'rgb(241,85,60)',
  '39-5': 'rgb(237,79,55)',
  '39-6': 'rgb(100,100,100)',
  '40-1': 'rgb(232,136,182)',
  '40-2': 'rgb(244,118,179)',
  '40-3': 'rgb(249,110,178)',
  '40-4': 'rgb(254,102,177)',
  '40-5': 'rgb(255,127,204)',
  '40-6': 'rgb(100,100,100)',
  '41-1': 'rgb(235,174,212)',
  '41-2': 'rgb(244,153,208)',
  '41-3': 'rgb(250,138,205)',
  '41-4': 'rgb(253,133,204)',
  '41-5': 'rgb(255,127,204)',
  '41-6': 'rgb(100,100,100)',
  '42-1': 'rgb(255,216,240)',
  '42-2': 'rgb(255,168,225)',
  '42-3': 'rgb(255,153,218)',
  '42-4': 'rgb(226,118,189)',
  '42-5': 'rgb(213,59,161)',
  '42-6': 'rgb(100,100,100)',
  '43-1': 'rgb(240,179,171)',
  '43-2': 'rgb(235,160,148)',
  '43-3': 'rgb(231,143,126)',
  '43-4': 'rgb(230,135,119)',
  '43-5': 'rgb(229,127,113)',
  '43-6': 'rgb(100,100,100)',
  '44-1': 'rgb(243,255,243)',
  '44-2': 'rgb(227,250,227)',
  '44-3': 'rgb(221,246,221)',
  '44-4': 'rgb(215,243,215)',
  '44-5': 'rgb(209,240,209)',
  '44-6': 'rgb(100,100,100)',
  '45-1': 'rgb(250,197,146)',
  '45-2': 'rgb(252,186,126)',
  '45-3': 'rgb(253,174,109)',
  '45-4': 'rgb(254,165,103)',
  '45-5': 'rgb(255,177,102)',
  '45-6': 'rgb(100,100,100)',
  F: 'rgb(255,255,255)',
  'F-F': 'rgb(255,255,255)',
  'F-3': 'rgb(255,255,255)',
  'F-2': 'rgb(255,255,255)',
  土洞: 'rgb(206,34,34)',
  Cave: 'rgb(255,255,255)',
  Karst: 'rgb(255,255,255)',
  sea: 'rgb(0,0,255)',
  seajy: 'rgb(120,120,120)',
  孤石: 'rgb(255,255,255)',
  '孤石-6': 'rgb(255,255,255)',
  空洞: 'rgb(206,34,34)',
  '空洞-3': 'rgb(206,34,34)',
  水: 'rgb(0,0,255)'
};

export function loadStereoscopicWall() {
  let a = 1;
  const ngData: any[] = [];
  const instances: any[] = [];
  drillData.forEach((items: any) => {
    let primitive = undefined;
    if (items.XMWJLJ == undefined && ngData.indexOf(items.GCMC) == -1) {
      ngData.push(items.GCMC);
    }
    let cylinder: Entity | null;

    for (const ng in items.XQ) {
      const res: any = items.XQ[ng];
      a++;
      if (items.JD != 'null' && items.WD != 'null' && res.CDGC != 'null' && res.TCHD != 'null' && res.CDGC != null && res.TCHD != null && items.JD != null && items.WD != null) {
        var height = res.CDGC / 1;
        var extrudedHeight = (res.CDGC + res.TCHD) / 1;
        var length = (res.TCHD / 1).toFixed(1);
        var center = Cartesian3.fromDegrees(items.JD / 1, items.WD / 1, height);
        var semiMinorAxis = 5;
        var semiMajorAxis = 5;
        const extrudedEllipse = new GeometryInstance({
          geometry: new EllipseGeometry({
            center: center,
            semiMinorAxis: semiMinorAxis,
            semiMajorAxis: semiMajorAxis,
            vertexFormat: VertexFormat.DEFAULT,
            rotation: 5.0,
            height: height,
            stRotation: 45,
            extrudedHeight: extrudedHeight
          }),
          attributes: {
            color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(drillColor[res.DCBH] || '#fff'))
          }
        });

        extrudedEllipse.id = {
          id: items.ZKBH + '&' + res.TCZCBH + a,
          ng: items.ZKBH,
          name: 'drill',
          p_key: items.key,
          showName: res.TCZCBH
        };

        const appearance = new MaterialAppearance({
          vertexShaderSource: `
            attribute vec3 position3DHigh;  
            attribute vec3 position3DLow;
            attribute float batchId;
            attribute vec4 color;
            
            varying vec4 v_positionEC;
            varying vec4 v_color;
      
            void main(){
              v_color = color;
              vec4 p = czm_computePosition();
              vec4 eyePosition = czm_modelViewRelativeToEye * p;
              v_positionEC =  czm_inverseModelView * eyePosition;
              gl_Position = czm_modelViewProjectionRelativeToEye * p;
            }
          `,
          fragmentShaderSource: `           
            varying vec4 v_positionEC;
            varying vec3 v_normalEC;
            varying vec4 v_color;
            
            void main() {
              float distance = sqrt(pow(v_positionEC.x, 2.0) + pow(v_positionEC.y, 2.0) + pow(v_positionEC.z, 2.0)); // 距离模型坐标系原点的距离
              float cy3 = fract(abs(distance - 5.0) / 10.0);
              vec3 ccolor = vec3(255.0, 255.0, 255.0);
              ccolor = vec3(0.0, 0.0, 255.0);
              vec3 cccolor = mix(ccolor, v_color.rgb, cy3);
              gl_FragColor = vec4(cccolor, 1.0);
            }`,
          flat: true
        });

        primitive = new Primitive({
          geometryInstances: extrudedEllipse,
          appearance: !res.NOTEM
            ? appearance
            : new MaterialAppearance({
                material: Material.fromType('GradientDrilling')
              })
        });
      }
      window.viewer.scene.primitives.add(primitive);
    }
  });

  window.viewer.goTo({
    // center: [114.41303861, 22.71387825, 1000],
    center: [114.491946899531, 22.6533736967405, 1000]
  });
}
