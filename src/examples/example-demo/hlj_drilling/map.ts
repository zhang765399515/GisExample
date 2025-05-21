import {
    Color,
    Cartesian2,
    Cartesian3,
    Primitive,
    GeometryInstance,
    Material,
    MaterialAppearance,
    Ray,
    CylinderGeometry,
    EllipsoidSurfaceAppearance,
    CircleGeometry,
    Matrix4,
    Transforms,
    PolygonGeometry,
    PolygonHierarchy,
    VertexFormat,
    WallGeometry,
    Draw,
    BoxGeometry,
    PerInstanceColorAppearance,
    ColorGeometryInstanceAttribute,
    Cartographic,
    CMath,
    EventDriven,
    BlendingState,
    Cartesian4,
    DistanceDisplayCondition,
    NearFarScalar,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    GeometryAttribute,
    ComponentDatatype,
    Geokey3DTileset,
    SceneTransforms,
    GeokeyTerrainProvider,
    Geometry,
    PrimitiveType,
    BoundingSphere,
} from "geokey-gis";
import * as turf from '@turf/turf'
import drillData from "./drill.json"
import { ImageMaterialProperty } from "geokey-gis";
import colorsData from "./color.json"
import { ElMessage } from 'element-plus'
let draw, moveEvent, handler
export async function loadDrill() {
    window.viewer.goTo({
        center: [127.09020498164307, 46.45634318320476, 1000]
    });
    let drillAll: any[] = [], drillGroup = [], center: any[];
    for (const key in drillData) {
        let drillListData = drillData[key].XQ;
        center = [drillListData[0].WGSX, drillListData[0].WGSY]
        drillListData.forEach((e, index) => {
            e.WGSX = drillData[key].WGSX;
            e.WGSY = drillData[key].WGSY;
            e.ID = key;
            drillAll.push(e)
            if (index == 0 || index == drillListData.length - 1) {
                let positions = addCircle(0.001, [e.WGSX, e.WGSY], 36)
                let height = index == 0 ? (e.CDGC + e.TCHD).toFixed(2) : (e.CDGC).toFixed(2)
                drawCircular('circular', positions, height, e.TCMC, new Cartesian2(-2, 2), center)
            }

        });
    }
    drillGroup = groupByField(drillAll, 'TCMC')//根据TCMC分组
    for (const e of drillGroup) {
        let instances: GeometryInstance[] = [], heightData: number[] = [];
        e.forEach(child => {
            let positions = addCircle(0.001, [child.WGSX, child.WGSY], 36)
            var height = child.CDGC / 1;
            var extrudedHeight = (child.CDGC + child.TCHD) / 1;
            heightData.push(child.TCHD * 1)
            var sideGeometry = createWallGeometry(positions, height, extrudedHeight);
            var sideGeometryInstance = new GeometryInstance({
                geometry: sideGeometry
            });
            sideGeometryInstance.id = child;
            instances.push(sideGeometryInstance)
        });
        let h = Math.max(...heightData) - Math.min(...heightData)
        let img_h = -3.14 * 2
        var sideAppearance = await createAppearence(e[0].TCMC, new Cartesian2(img_h, e[0].TCHD), center);
        var oneDrill = new Primitive({
            geometryInstances: instances,
            appearance: sideAppearance
        });
        let sidePrimitive = window.viewer.scene.primitives.add(oneDrill);
        sidePrimitive.name = 'drill'
    }
}
export function getRayByTwoPoint(positionA, positionB) {
    let result = new Cartesian3();
    let direction = Cartesian3.normalize(
        Cartesian3.subtract(positionB, positionA, result),
        result
    );
    return new Ray(positionA, direction);

}
export function drillPickFromRay(ray, limit, objectsToExclude, width) {
    return window.viewer.scene.drillPickFromRay(
        ray,
        limit,
        objectsToExclude,
        width
    );
};
export function load3dtiles() {
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
    const tile = window.viewer.scene.primitives.add(
        new Geokey3DTileset({
            url: 'http://14.22.86.227:12022/service/gis/3DModel/HRF010/tileset.json?serviceName=HRF010_P1_b3dm',
        })
    );
    tile.readyPromise.then(r => {
        window.viewer.zoomTo(r)

        // const elevationLayer = new GeokeyTerrainProvider({
        //     url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=HLJ_demL15&uuid=1'
        // });
        // window.viewer.terrainProvider = elevationLayer;
        setTimeout(() => {
            let TwoPoint = getRayByTwoPoint(Cartesian3.fromDegrees(127.08994, 46.45621, 10000), Cartesian3.fromDegrees(127.08994, 46.45621, -100))
            let ray = drillPickFromRay(TwoPoint, Number.MAX_VALUE, [], 0.1)
            window.viewer.entities.add({
                position: ray[0].position,
                model: {
                    uri: "glb/DHY-jlszy.gltf",
                    scale: 0.01,
                    color: Color.RED
                }
            })
        }, 1000)
    })
}
/**
 * 
 * @param name 顶部和底部的圆名称
 * @param position 范围
 * @param height 离地面的高度
 * @param tcmc 图层名称
 * @param repeat 重复次数
 */
export function drawCircular(name, position, height, tcmc, repeat, center) {
    const circular = new Primitive({
        geometryInstances: new GeometryInstance({
            geometry: new PolygonGeometry({
                polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(position)),
                height: height,
            })
        }),
        appearance: createAppearence(tcmc, repeat, center)
    });
    let gradientPrimitive = window.viewer.scene.primitives.add(circular);
    gradientPrimitive.name = name;
    gradientPrimitive.id = {
        repeatUV: new Cartesian2(repeat.x, repeat.y)
    };
    // let entities = window.viewer.entities.add({
    //     polygon: {
    //         hierarchy: Cartesian3.fromDegreesArrayHeights(position),
    //         material: new ImageMaterialProperty({
    //             image: `image/hlj/${tcmc}.png`,
    //             repeat:repeat
    //         }),
    //         height:height,
    //     }
    // });


}
/**
 * 
 * @param radius 半径
 * @param point 中心点
 * @param steps 步长
 * @returns 根据半径和中心点以及步长生成圆
 */
export function addCircle(radius = 0.001, point, steps) {
    var radius = 0.001;
    let center = [point[0], point[1]];
    var options = { steps: steps, units: "kilometers", properties: {} };
    let circle = turf.circle(center, radius, options);
    let coordinates = circle.geometry.coordinates[0];
    let positions: number[] = [];
    coordinates.forEach(_coord => {
        positions.push(_coord[0], _coord[1], 0)
    })
    return positions;
}
/**
 * 将数组中相同值的归为一个数组
 * @param array 数据
 * @param fieldName 根据什么字段名称来判断
 * @returns 
 */
export function groupByField(array, fieldName) {
    return array.reduce((acc, obj) => {
        const fieldValue = obj[fieldName];
        const group = acc.find(group => group[0][fieldName] === fieldValue);
        if (group) {
            group.push(obj);
        } else {
            acc.push([obj]);
        }
        return acc;
    }, []);
}
function createWallGeometry(positions, minimumHeights, maximumHeights) {
    console.log('name：positions', positions);
    return new WallGeometry({
        positions: Cartesian3.fromDegreesArrayHeights(positions),
        maximumHeights: new Array(Cartesian3.fromDegreesArrayHeights(positions).length).fill(maximumHeights), // 侧面的高度
        minimumHeights: new Array(Cartesian3.fromDegreesArrayHeights(positions).length).fill(minimumHeights) // 底部高度
    });
}
function getImgSize(DCBH) {
    return new Promise(function (resolve, reject) {
        let img = new Image()
        img.src = `image/hlj/${DCBH}.png`
        img.onload = function () {
            resolve({
                width: img.width,
                height: img.height
            })
        }
    })
}
// async function createAppearence(DCBH, height) {
//     let repeatY = 1, repeatX = 1
//     if (DCBH) {
//         let h = await getImgSize(DCBH)
//         repeatY = ((height / h.height) * 100).toFixed(4);
//         repeatX = ((height / h.width) * 50).toFixed(4);
//         console.log('name：repeatX',repeatX,repeatY);
//         if (repeatY >= 1 && repeatY < 10) {
//             repeatY = repeatY * 0.1
//             repeatX = repeatX * 0.1
//         }
//         if (repeatY >= 10 && repeatY < 100) {
//             repeatY = repeatY * 0.01
//             repeatX = repeatX * 0.01
//         }
//     }
//     return new Promise((resolve) => {
//         resolve(new MaterialAppearance({
//             material: new Material({
//                 fabric: {
//                     type: 'DiffuseMap',
//                     uniforms: {
//                         image: `image/hlj/${DCBH}.png`,
//                         repeat: new Cartesian2(repeatX * 10, repeatY * 10)
//                     },
//                 }
//             }),
//             faceForward: true
//         }))
//     })
// }

function createAppearence(tcmc, repeat, point) {
    //获取depth深度，t0是指讲深度按距离（10-5000）让取值范围在（0,4）,取（0,4）是为了做4次梯度（实际应为1/4=0.25<0.3,z只做了3次），t控制在（0.3,1.0）是为了控制纹理的缩放比例不能太大。
    //t1是为了让纹理坐标偏移取平均值，ij从负号开始，即取的周围8个像素，具体看高斯模糊介绍
    let fs = `czm_material czm_getMaterial(czm_materialInput materialInput)\
      {
                // vec4 eyePosition = czm_view * pEC;\
                // float depth=-eyePosition.z / eyePosition.w; \
                // float startDistance = fogByDistance.x; \
                // float startValue = fogByDistance.y; \
                // float endDistance = fogByDistance.z; \
                // float endValue = fogByDistance.w; \
                // float t0 = floor(4.0*(depth - startDistance) / (endDistance - startDistance)); \
                // float t= 1.3-clamp(t0/4.0, 0.3, 1.0); \
                // float t1= clamp(t0+1.0, 1.0,2.0); \
                // vec4 color = vec4(0.0);
                // float seg = 5.0;
                // float f = 0.0;
                // float dv = 2.0/512.0;
                // float tot = 0.0;
                // for(float i = -5.0; i <= 5.0; ++i)
                // {
                //     for(float j = -5.0; j <= 5.0; ++j)
                //     {
                //         f = (1.1 - sqrt(i*i + j*j)/8.0);
                //         f *= f;
                //         tot += f;
                //         color += texture2D( image, fract(vec2(repeat.x*t,repeat.y*t) * materialInput.st)+vec2(j*dv*t1,i*dv*t1)).rgba * f;
                //     }
                // }
                // color /= tot;
                // czm_material material = czm_getDefaultMaterial(materialInput);
                // vec3 normalEC = materialInput.normalEC;
                // material.diffuse=color.rgb;
                // material.normal = normalEC;
                // material.alpha = 1.0;
                // return material;

            }`;
    let center = Cartesian3.fromDegrees(point[0], point[1], 10)
    const _Cartesian4Center = new Cartesian4(center.x, center.y, center.z, 1);
    let alphaShow = true
    let components = alphaShow == true ? {
        alpha:0.5,
    }:{}
    return new MaterialAppearance({
        material: new Material({
            fabric: {
                type: 'DiffuseMap',
                uniforms: {
                    image: `image/hlj/${tcmc}.png`,
                    repeat: repeat,
                    pEC: _Cartesian4Center,
                    fogByDistance: new Cartesian4(100, 0.0, 5000, 1.0),
                },
                components:components,
                // source: fs
            },
        }),
        flat: true,
    });
}
function createAppearence2(color0, color1) {
    return new MaterialAppearance({
        material: new Material({
            fabric: {
                type: 'wallMap',
                uniforms: {
                    color0: Color.fromCssColorString(color0),
                    color1: Color.fromCssColorString(color1 || "#fff"),
                    // maxHeight: [40, 80, 120, 160],
                    // minHeight: [0, 40, 80, 120],
                    // color: [Color.fromCssColorString("#ff0000"), Color.fromCssColorString("#ff00ff"), Color.fromCssColorString("#ffff00"), Color.fromCssColorString("#00ff00")]
                },
                source: `czm_material czm_getMaterial(czm_materialInput materialInput) {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    // 获取纹理坐标
                    vec2 coords = materialInput.st;
                    float gradientMix = coords.t;
                    vec3 position = materialInput.positionToEyeEC;
                    float height = position.z; 
                    vec3 colorA = color0.rgb;
                    vec3 colorB = color1.rgb;

                    material.diffuse = mix(colorA, colorB, gradientMix);
                    material.alpha = 1.0;
                    return material;
                  }`
            }
        }),
        faceForward: true,
        flat: true,
        closed: true
    });
}
export function createLine(data) {
    window.viewer.scene.globe.depthTestAgainstTerrain = true;
    draw = new Draw(window.viewer, '_drawLine')
    draw.drawLineGraphics({
        callback: (val: any) => {
            drawOnePolygon(1, val)
        }
    })
}
/**
 * 
 * @param val 数据组
 * @returns 返回两两拆分，首尾相连的新数组
 */
export function splitPosition(val) {
    let positions = [];
    for (let i = 0; i < val.length; i++) {
        if (i < val.length - 1) {
            positions.push([val[i], val[i + 1]])
        }
    }
    positions.push([val[val.length - 1], val[0]]);
    return positions;
}
export function getMaxBounds(coordinates) {
    let maxLat = -Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let minLng = Infinity;
    let maxHeight = -Infinity;
    let minHeight = Infinity;
    let point0, point1;
    let point2, point3;
    for (let i = 0; i < coordinates.length; i++) {
        if (coordinates[i][1] > maxLat) {
            maxLat = coordinates[i][1];
            point1 = [coordinates[i][0], coordinates[i][1], coordinates[i][2]];
        }
        if (coordinates[i][1] < minLat) {
            minLat = coordinates[i][1];
            point0 = [coordinates[i][0], coordinates[i][1], coordinates[i][2]];
        }
        if (coordinates[i][0] > maxLng) {
            maxLng = coordinates[i][0];
            point3 = [coordinates[i][0], coordinates[i][1], coordinates[i][2]];
        }
        if (coordinates[i][0] < minLng) {
            minLng = coordinates[i][0];
            point2 = [coordinates[i][0], coordinates[i][1], coordinates[i][2]];
        }
        if (coordinates[i][2] > maxHeight) {
            maxHeight = coordinates[i][2];
        }
        if (coordinates[i][2] < minHeight) {
            minHeight = coordinates[i][2];
        }
    };
    if (maxLng > minLng) {
        let a0 = Cartesian3.fromDegrees(point0[0], point0[1], 0);
        let a1 = Cartesian3.fromDegrees(point1[0], point1[1], 0);
        let a3 = Cartesian3.fromDegrees(point0[0], point1[1], 0);
        let dis0 = Cartesian3.distance(a3, a0);
        let dis1 = Cartesian3.distance(a3, a1);
        let value0 = dis0 - dis1;
        let value1 = point1[1] - point0[1];
        if ((value0 <= 0 && value1 >= 0) || (value0 >= 0 && value1 <= 0)) {
            return [point2, point3, minHeight, maxHeight, false]
        }
        if ((value0 <= 0 && value1 < 0) || (value0 >= 0 && value1 >= 0)) {
            return [point2, point3, minHeight, maxHeight, true]
        }
    } else {
        return [point2, point3, minHeight, maxHeight, false]
    }
}
export function positionToUV(positionList, min, max) {
    var line = turf.lineString(positionList);
    var bbox = turf.bbox(line);
    let pointA = Cartesian3.fromDegrees(bbox[0], bbox[1], max)
    let pointB = Cartesian3.fromDegrees(bbox[2], bbox[3], max)
    let repeatu = Cartesian3.distance(pointA, pointB);
    let repeatv = max - min;
    let positionListuv = [0, 0, 0, 1, 1, 1, 1, 0], indexs = [0, 1, 2, 2, 3, 0], onePolygon = [];
    onePolygon.push(positionList[1][0], positionList[1][1], min);
    onePolygon.push(positionList[1][0], positionList[1][1], max);
    onePolygon.push(positionList[0][0], positionList[0][1], max);
    onePolygon.push(positionList[0][0], positionList[0][1], min);
    return {
        "vs": onePolygon,
        "uvs": positionListuv,
        "fs": indexs,
        "repeat": [repeatu, repeatv]
    }
}

export async function drawOnePolygon(type, val: any[]) {
    let positions = splitPosition(val);
    let top_bottomData = []
    for (let _i = 0; _i < val.length; _i++) {
        top_bottomData.push(val[_i][0], val[_i][1], 0)
    }
    let center = [top_bottomData[0], top_bottomData[1]];
    for (const key in drillData) {
        const XQ = drillData[key].XQ;
        for (const [index, child] of XQ.entries()) {
            let maxDistance = 0, minDistance = 0;
            for (let i = 0; i < positions.length; i++) {
                let lastPoint = Cartesian3.fromDegrees(positions[i][0][0], positions[i][0][1]);
                let firstPoint = Cartesian3.fromDegrees(positions[i][1][0], positions[i][1][1]);
                if (minDistance == 0) {
                    minDistance = Cartesian3.distance(firstPoint, lastPoint);
                } else {
                    minDistance = Cartesian3.distance(firstPoint, lastPoint) < minDistance ? Cartesian3.distance(firstPoint, lastPoint) : minDistance;
                }
                maxDistance = Cartesian3.distance(firstPoint, lastPoint) > maxDistance ? Cartesian3.distance(firstPoint, lastPoint) : maxDistance;
                if (index == 0 || index == XQ.length - 1) {
                    drawCircular('drillPictures', top_bottomData, child.CDGC + child.TCHD, child.TCMC, new Cartesian2(maxDistance, minDistance * 0.5), center)
                }
                let data = positionToUV(positions[i], child.CDGC, child.CDGC + child.TCHD);
                drawOneLayer(data, child.TCMC, center);
            }
        }
    }

    addEventListener();
}
export function normalize(value, min, max) {
    return (value - min) / (max - min);
}
/**
 * 
 * @param num 当前值
 * @param minInput 最小范围
 * @param maxInput 最大范围
 * @param minOutput 输出的最小值
 * @param maxOutput 输出的最大值
 * @returns 
 */
export function normalizeToRange(num, minInput, maxInput, minOutput, maxOutput) {
    // 确保输入在指定范围内  
    if (num < minInput) return minOutput;
    if (num > maxInput) return maxOutput;

    // 计算归一化值  
    const normalizedValue = ((num - minInput) / (maxInput - minInput)) * (maxOutput - minOutput) + minOutput;
    return normalizedValue;
}
/**
 * 监听相机高度，根据高度动态修改纹理比例
 */
export function addEventListener() {
    moveEvent = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    moveEvent.setInputAction((event) => {
        // setTimeout(() => {
        let primitive = window.viewer.scene.primitives._primitives;
        for (let i = 0; i < primitive.length; i++) {
            if (primitive[i].name == "drillPictures" || primitive[i].name == "circular") {
                let repeat = primitive[i]._material.uniforms.repeat;
                if (primitive[i].id) {
                    let repeatUV = primitive[i].id.repeatUV;
                    var height = window.viewer.camera.positionCartographic.height;
                    if (height < 230) {
                        primitive[i]._material.uniforms.repeat = new Cartesian2(repeatUV.x, repeatUV.y)

                    } else if (height >= 230 && height <= 1000) {
                        let normalizedData = normalizeToRange(height, 230, 1000, 0.01, 0.19);
                        let scale = 0.2 - normalizedData
                        primitive[i]._material.uniforms.repeat = new Cartesian2(repeatUV.x * scale, repeatUV.y * scale)
                    } else {
                        primitive[i]._material.uniforms.repeat = new Cartesian2(repeatUV.x * 0.02, repeatUV.y * 0.02)
                    }
                }
            }

        }
        // }, 500);
    }, ScreenSpaceEventType.MOUSE_MOVE);
}
export function drawOneLayer(data, tcmc, center) {
    let geo_ins = createGeometryInstance(data.vs, data.uvs, data.fs);
    let appear = createAppearence(tcmc, new Cartesian2(data.repeat[0], data.repeat[1]), center);

    let layer = new Primitive({
        geometryInstances: geo_ins,
        appearance: appear,
        asynchronous: false
    });
    let primitive = window.viewer.scene.primitives.add(layer)
    primitive.name = 'drillPictures';
    primitive.id = {
        repeatUV: new Cartesian2(data.repeat[0], data.repeat[1])
    };
}
export function createGeometryInstance(positions, uvs, indices) {
    let newArray = [];
    for (let i = 0; i < positions.length; i += 3) {
        let newCartesian = Cartesian3.fromDegrees(positions[i], positions[i + 1], positions[i + 2]);
        newArray.push(newCartesian.x, newCartesian.y, newCartesian.z);
    }
    let geometry = new Geometry({
        attributes: {
            position: new GeometryAttribute({
                componentDatatype: ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: newArray
            }),
            st: new GeometryAttribute({
                componentDatatype: ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: uvs
            })
        },
        indices: indices, //索引指标，指示创建三角形的顺序
        primitiveType: PrimitiveType.TRIANGLES,
        boundingSphere: BoundingSphere.fromVertices(newArray)
    });
    return new GeometryInstance({
        geometry: geometry
    });
}
export function distancePoint(points: any[], positions: any[], distance) {
    const features = turf.points(points);
    const featuresCenter = turf.center(features).geometry.coordinates;
    const centerCartesian3 = Cartesian3.fromDegrees(featuresCenter[0], featuresCenter[1])
    var scaledPositions = [];
    for (var i = 0; i < positions.length; i++) {
        var originalPosition = positions[i];
        var offset = Cartesian3.subtract(originalPosition, centerCartesian3, new Cartesian3());
        var scaledOffset = Cartesian3.multiplyByScalar(offset, distance, new Cartesian3());
        var scaledPosition = Cartesian3.add(centerCartesian3, scaledOffset, new Cartesian3());
        scaledPositions.push(scaledPosition);
    }
    return scaledPositions;
}
export function loadPolygon(name, data, height, color) {
    let entities = window.viewer.entities.add({
        polygon: {
            show: true,
            hierarchy: Cartesian3.fromDegreesArrayHeights(data),
            material: Color.fromCssColorString(color),
            height: height,
        }
    });
    entities.name = name;
    let polygonHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    let position = [];

    window.viewer.surfacePierce.enable = true;
    window.viewer.surfacePierce.alpha = 0
    polygonHandler.setInputAction((event) => {
        let picks = window.viewer.scene.pick(event.endPosition)
        if (picks) {
            console.log('name：picks', picks);
            // let cartesian = window.viewer.scene.pickPosition(event.position);
            // let point = getCartesian3To84(cartesian);
        }
    }, ScreenSpaceEventType.MOUSE_MOVE);

}
export function removePolygon(name: string | undefined) {
    let primitives = window.viewer.scene.primitives._primitives;
    let entities = window.viewer.entities.values;
    for (let i = primitives.length - 1; i >= 0; i--) {
        if (primitives[i].name == name) {
            window.viewer.scene.primitives.remove(primitives[i])
        }
    }
    for (let i = entities.length - 1; i >= 0; i--) {
        if (entities[i].name == name) {
            window.viewer.entities.remove(entities[i])
        }
    }
}
export function normalizeArray(arr) {
    if (arr.length === 0) return []; // 如果数组为空，则返回空数组

    let minValue = Math.min(...arr);
    let maxValue = Math.max(...arr);

    // 如果最大值和最小值相同，则所有值都应该映射到0或1，这里选择1
    if (maxValue === minValue) return arr.map(() => 1);

    return arr.map(value => (((value - minValue) / (maxValue - minValue)).toFixed(5)) * 1);
}

export function drawPolygon(name, pointData, polygonData) {
    let heightData = polygonData.heightData;
    let colorsData = polygonData.colorData;
    let max = Math.max(...heightData);
    let min = Math.min(...heightData);
    let normalizedArray = normalizeArray(heightData);
    const getColorRamp = () => {
        const ramp = document.createElement('canvas');
        ramp.width = 1;
        ramp.height = max;
        ramp.style.backgroundColor = 'transparent';
        const ctx = ramp.getContext('2d');
        const grd = ctx.createLinearGradient(0, max, 0, 0);
        for (let i = 0; i < normalizedArray.length; i++) {
            grd.addColorStop(normalizedArray[i], colorsData[i]);
        }
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1, max)
        return ramp;
    }
    let gradientWall = window.viewer.entities.add({
        wall: {
            positions: Cartesian3.fromDegreesArrayHeights(pointData),
            minimumHeights: new Array(pointData.length / 3).fill(min),
            maximumHeights: new Array(pointData.length / 3).fill(max),
            material: getColorRamp(),
        }
    })
    gradientWall.name = name;
    return
    const colorData = {
        0: Color.RED,
        1: Color.YELLOW,
        2: Color.GREEN
    };
    const colorStops = {
        0: 0.0,
        1: 0.5,
        2: 1.0
    };
    const colorsAll = [
        new Color(1.0, 0.0, 0.0, 1.0), // 红色
        new Color(0.0, 1.0, 0.0, 1.0), // 绿色
        new Color(0.0, 0.0, 1.0, 1.0)  // 蓝色
    ]
    const gradientMaterial = new Material({
        fabric: {
            type: 'CenterGradual',
            uniforms: {
                colorA: Color.RED,
                colorB: Color.YELLOW,
            },
            source: `
                czm_material czm_getMaterial(czm_materialInput materialInput){
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 coords = materialInput.st;
                material.diffuse = mix(colorA.rgb, colorB.rgb, coords.t);
                return material;
            }`
        }
    });
    const gradientPrimitive = new Primitive({
        geometryInstances: new GeometryInstance({
            geometry: new PolygonGeometry({
                polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(data)),
                extrudedHeight: 200,
            })
        }),
        appearance: new MaterialAppearance({
            material: gradientMaterial,
            faceForward: true,
            flat: true,
            closed: true
        })
    });
    window.viewer.scene.primitives.add(gradientPrimitive);

}
export function drawRod(point, data, distance, isRodLine) {
    let XQ = data.XQ;
    let minHeight = XQ[XQ.length - 1].CDGC;
    let maxHeight = XQ[0].CDGC + XQ[0].TCHD;
    let positions = [point[0], point[1], minHeight, point[0], point[1], maxHeight];
    let lastPoint = pointTranslation(point);
    if (isRodLine == false) {
        drawLine('rodLine', positions, '#f00');
        isRodLine = true;
    }
    let heightData = batchPoint(XQ[0], XQ[XQ.length - 1], distance);
    let scale = 0
    heightData.forEach((e, index) => {
        if (index == 0) {
            scale = 0
        } else if (index < heightData.length - 1) {
            scale = scale + e - heightData[index + 1]
        } else {
            scale = heightData[0] - heightData[index]
        }
        drawLine('rodScale', [point[0], point[1], e, lastPoint[0], lastPoint[1], e], '#f00');
        drawLabel('rodLabel', [point[0], point[1], e], Math.ceil(scale), "#f00")
    })
    moveListener(point, data, distance)
}
export function moveListener(point, data, distance) {
    handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    handler.setInputAction((event) => {
        var height = window.viewer.camera.positionCartographic.height;
        removeRod('rodScale')
        removeRod('rodLabel')
        let scale = Math.floor(Math.floor(height) / 100)
        if (scale <= 8) {
            drawRod(point, data, distance, true)
        } else {
            drawRod(point, data, scale * 3, true)
        }

    }, ScreenSpaceEventType.MOUSE_MOVE);
}
export function removeRod(name) {
    let entities = window.viewer.entities.values;
    for (let i = entities.length - 1; i >= 0; i--) {
        if (entities[i].name == name) {
            window.viewer.entities.remove(entities[i]);
        }
    }
    handler && handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
    moveEvent && moveEvent.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
}
export function batchPoint(data1, data2, VerticalLength) {
    let pointA = Cartesian3.fromDegrees(data1.WGSX, data1.WGSY, data1.CDGC + data1.TCHD)
    let pointB = Cartesian3.fromDegrees(data2.WGSX, data2.WGSY, data2.CDGC)
    let distance = Math.floor(Cartesian3.distance(pointA, pointB));
    let numPoints = Math.floor(distance / VerticalLength);
    let new_distance = data2.CDGC, scale = 0, heightData = [], scaleData = [];
    let start = 0, end = data2.CDSD;
    let increment = Math.floor((end - start) / (numPoints));
    scaleData.push(start);
    heightData.push(new_distance)
    for (let j = 0; j <= numPoints; j++) {
        new_distance += VerticalLength;
        if (new_distance >= data1.CDGC + data1.TCHD) {
            new_distance = data1.CDGC + data1.TCHD;
        } else if (new_distance <= data2.CDGC) {
            new_distance = data2.CDGC;
        }
        heightData.push(new_distance)
    }
    // for (let i = 1; i < numPoints; i++) {
    //     scaleData.push(start + i * increment);
    //     heightData.push(new_distance + i * increment)
    // }
    // scaleData.push(end);
    // heightData.push(data1.CDGC + data1.TCHD);
    // console.log('name：heightData',heightData,scaleData);
    // return [heightData.reverse(),scaleData];
    return heightData.reverse();
}
export function drawLine(name, data, color) {
    let line = window.viewer.entities.add({
        polyline: {
            positions: Cartesian3.fromDegreesArrayHeights(data),
            material: Color.fromCssColorString(color),
            width: 3,
            distanceDisplayCondition: new DistanceDisplayCondition(1, 6000),
        }
    })
    line.name = name;
}
export function drawLabel(name, point, val, color) {
    let label = window.viewer.entities.add({
        position: Cartesian3.fromDegrees(point[0], point[1], point[2]),
        label: {
            text: val + 'm',
            font: "12px sans-serif",
            fillColor: Color.fromCssColorString(color),
            outlineColor: Color.fromCssColorString(color),
            pixelOffset: new Cartesian2(30, 0),
            scaleByDistance: new NearFarScalar(700, 1, 5000, 0.6),
            distanceDisplayCondition: new DistanceDisplayCondition(1, 6000),
        }
    })
    label.name = name;
}
export function pointTranslation(p) {
    var enuPoint = Cartesian3.fromDegrees(p[0], p[1], 0);
    var translation = new Cartesian3(5, 0, 0); // 平移1米
    var translatedPoint = Cartesian3.add(enuPoint, translation, new Cartesian3());
    var translatedGeographic = Cartographic.fromCartesian(translatedPoint);
    var translatedLongitude = CMath.toDegrees(translatedGeographic.longitude);
    var translatedLatitude = CMath.toDegrees(translatedGeographic.latitude);
    // var translatedHeight = translatedGeographic.height;
    return [translatedLongitude, translatedLatitude]
}
export function addPoint(name, position, color) {
    console.log('name：position', position);
    window.viewer.entities.add({
        name: name,
        position: position,
        point: {
            pixelSize: 10,
            color: Color.fromCssColorString(color),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    })
}
export function addPolyline(position, color, id) {
    window.viewer.entities.add({
        id: id,
        polyline: {
            positions: position,
            width: 2, // 线宽
            // clampToGround:true,
            material: Color.fromCssColorString(color) // 线颜色
        }
    });
}
/**
 * 
 * @param p1 第一个点
 * @param p2 第二个点
 * @param distance 延长距离
 * @returns 第一个点到第二个点的延长点
 */
export function extendedLine(p1, p2, distance = 10000) {
    let A = Cartesian3.fromDegrees(p1[0], p1[1], 0);
    let B = Cartesian3.fromDegrees(p2[0], p2[1], 0);
    let direction = Cartesian3.subtract(B, A, new Cartesian3());
    let extensionDistance = distance; // 默认延长10000米
    let normalizedDirection = Cartesian3.normalize(direction, new Cartesian3());
    let extensionVector = Cartesian3.multiplyByScalar(normalizedDirection, extensionDistance, new Cartesian3());
    // 计算延长点
    let extendedPoint = Cartesian3.add(B, extensionVector, new Cartesian3());
    var cartographicPosition = Cartographic.fromCartesian(extendedPoint);
    var longitude = CMath.toDegrees(cartographicPosition.longitude);
    var latitude = CMath.toDegrees(cartographicPosition.latitude);
    return [longitude, latitude]
}
/**
 * 
 * @param polygonA 第一个面
 * @param polygonB 第二个面
 * @returns 返回两个面的交集和差集
 */
export function polygonIntersection(polygonA, polygonB) {
    let poly1 = turf.polygon([polygonA])
    let poly2 = turf.polygon([polygonB])
    let intersection = turf.intersect(poly1, poly2);//交集
    var difference = turf.difference(poly1, poly2);//差集
    return [intersection, difference]
}
export function pointGraphics(callback) {
    let PointHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    let position = [];
    PointHandler.setInputAction((event) => {
        let picks = window.viewer.scene.pick(event.position)
        if (picks) {//获取模型高
            let cartesian = window.viewer.scene.pickPosition(event.position);
            addPoint('point', cartesian, "#f00")
            let point = getCartesian3To84(cartesian);
            position.push(point);
        }
        // else{//获取地形高
        //     const ray = window.viewer.camera.getPickRay(event.position);
        //     const cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
        //     const cartographic = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        //     longitude = CMath.toDegrees(cartographic.longitude);
        //     latitude = CMath.toDegrees(cartographic.latitude);
        //     height = window.viewer.scene.globe.getHeight(cartographic);
        // }
        if (position.length >= 2) {
            window.viewer.entities.removeById("polyLine")
            addPolyline(Cartesian3.fromDegreesArrayHeights(position.flat()), '#f00', "polyLine")
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
    PointHandler.setInputAction((event) => {
        if (position.length >= 2) {
            PointHandler && PointHandler.destroy();
            if (typeof callback === 'function') {
                callback(position);
                removeRod("point");
                window.viewer.entities.removeById("polyLine");
            }
        } else {
            ElMessage.error("至少绘制两个点！")
        }
    }, ScreenSpaceEventType.RIGHT_CLICK)
}
/**
 * 
 * @param cartesian 笛卡尔转经纬度
 * @returns [longitude,latitude,height]
 */
export function getCartesian3To84(cartesian) {
    let longitude, latitude, height
    let cartographic = Cartographic.fromCartesian(cartesian);
    longitude = CMath.toDegrees(cartographic.longitude);
    latitude = CMath.toDegrees(cartographic.latitude);
    height = cartographic.height + 0.1;
    return [longitude, latitude, height]
}



