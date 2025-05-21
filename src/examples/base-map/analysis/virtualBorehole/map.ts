import {
    Geokey3DTileset,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Color,
    Cartographic,
    CMath,
    Cartesian3,
    Ray,
    GeoUtils,
    Transforms,
    HeadingPitchRoll,
    Geokey3DTileStyle,
    GeometryInstance,
    EllipseGeometry,
    PerInstanceColorAppearance,
    ColorGeometryInstanceAttribute,
    Primitive,
} from 'geokey-gis';
let geoUtils = new GeoUtils();
export async function load3dtiles() {
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
    try {
        const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/hsl/tileset.json?serviceName=hsl_B3dm')
        window.viewer.scene.primitives.add(tileset);
        window.viewer.zoomTo(tileset)
    } catch {
        console.log('加载3DTile失败');
    }
}
export class addVirtualBorehole {
    constructor(option) {
        this._point = null;
        this.colorData = option.colorData;//钻孔颜色
        this.virtualBoreholeName = option.name || 'virtualBorehole';//钻孔名称
        this.pointColor = option.pointColor || '#ffff00';//点颜色
        this.pointSize = option.pointSize || 10; //点大小
        this.modelData = option.modelData || ["/model/drilling/1.gltf", "/model/drilling/2.gltf"] //钻孔模型
        this.SmModelData = []; //存放钻孔模型Entity 
        this._entities = []; //存放Entity集合
        this._primitives = []; //存放Primitive 集合
        this.radius = option.radius || 1; //钻孔半径
        this.isFlyTo = option.isFlyTo; //默认是否定位
        this.virtualDrillingData = [];//存放钻孔数据集合
    }
    getPoint() {
        return this._point;
    }
    getData() {
        return this.virtualDrillingData;
    }
    //开始绘制
    startCreate() {
        window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
        window.viewer.scene.postProcessStages.fxaa.enabled = true;//开启抗锯齿
        var $this = this;
        this.handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
        this.handler.setInputAction(evt => {
            var cartesian = window.viewer.scene.pickPosition(evt.position);
            let point = this.getCatesian3To84(cartesian);
            this._point = point;
            if (!cartesian) return;
            $this.createPoint(point, $this.pointColor, $this.pointSize);
            this.addAnimation(point, this.modelData);
            let instancesData = [];
            let data = this.drawRay(point);
            data.forEach(e => {
                let extrudedEllipse = this.loadExtrudedEllipse(e, this.radius)
                instancesData.push(extrudedEllipse)
            });
            this.drawVirtualDrilling(instancesData)

        }, ScreenSpaceEventType.LEFT_CLICK);
    }

    //创建点
    createPoint(e, color, pointSize) {
        var $this = this;
        var point = window.viewer.entities.add({
            position: Cartesian3.fromDegrees(e.longitude * 1, e.latitude * 1, e.height * 1),
            point: {
                pixelSize: pointSize,
                color: Color.fromCssColorString(color),
                disableDepthTestDistance: 5000000, //栽点塌陷问题
            }
        });
        $this._entities.push(point); //加载脏数据
        return point;
    }
    /**
     * 
     * @param e 点
     * @returns 返回射线获取到的所有信息
     */
    drawRay(e) {
        window.viewer.scene.globe.show = false;
        this.isFlyTo ? this.flyTo() : false;
        let TwoPoint = this.getRayByTwoPoint(
            Cartesian3.fromDegrees(e.longitude, e.latitude, e.height + 10000),
            Cartesian3.fromDegrees(e.longitude, e.latitude, e.height - 10000)
        );
        let TwoPoint_2 = this.getRayByTwoPoint(
            Cartesian3.fromDegrees(e.longitude, e.latitude, e.height - 10000),
            Cartesian3.fromDegrees(e.longitude, e.latitude, e.height + 10000)
        );
        let drillingData = this.drillPickFromRay(TwoPoint, Number.MAX_VALUE, [], 0.1);
        let drillingData_2 = this.drillPickFromRay(TwoPoint_2, Number.MAX_VALUE, [], 0.1);
        drillingData.push(drillingData_2[0])
        drillingData.forEach((e, index) => {
            if (e.object) {
                e.height = geoUtils.cartesian2Degrees(e.position).height;
                let _properties = e.object.content.batchTable._propertyTable._jsonMetadataTable._properties;
                e.properties = _properties;
            }
        });
        drillingData[0].height += 0.1;
        drillingData.forEach((e, index) => {
            if (index < drillingData.length - 1) {
                e.thickness = drillingData[index + 1].height;//厚度
            }
        });
        drillingData.pop();
        this.virtualDrillingData = drillingData;
        return drillingData
    }

    /**
     * 创建一条射线
     * @param {*} positionA 点a
     * @param {*} positionB 点b
     * @return {*} 
     */
    getRayByTwoPoint(positionA, positionB) {
        let result = new Cartesian3();
        let direction = Cartesian3.normalize(Cartesian3.subtract(positionB, positionA, result), result);
        return new Ray(positionA, direction);
    };
    /**
     * 获取到射线穿过的值
     * @param ray 射线
     * @param limit 
     * @param objectsToExclude 
     * @param width 
     * @returns 
     */
    drillPickFromRay(ray, limit, objectsToExclude, width) {
        return window.viewer.scene.drillPickFromRay(ray, limit, objectsToExclude, width);
    }
    addAnimation(e, modelData) {
        for (let i = 0; i < modelData.length; i++) {
            let modelList = window.viewer.entities.add({
                name: "drilling",
                position: Cartesian3.fromDegrees(e.longitude * 1, e.latitude * 1, i == 0 ? e.height : (e.height -= 5.5)),
                model: {
                    scale: 2,
                    uri: modelData[i]
                }
            });
            this.SmModelData.push(modelList);
            if (i == 0) {
                this.SmCartoon(modelList, e);
            }
        }

    }
    /**
     * 
     * @param cartesian Cartesian3
     * @returns 
     */
    getCatesian3To84(cartesian) {
        var cartographicPosition = Cartographic.fromCartesian(cartesian);
        var longitude = CMath.toDegrees(cartographicPosition.longitude);
        var latitude = CMath.toDegrees(cartographicPosition.latitude);
        var height = cartographicPosition.height;
        return { longitude: longitude, latitude: latitude, height: height }
    }
    /**
 *
 * @name SmCartoon
 * @msg 旋转钻孔模型
 * @param {*} modelList 模型
 * @param {*} gltfPoint 位置
 */
    SmCartoon(modelList, gltfPoint) {
        let s = gltfPoint.height + 2,
            v = 0;
        let times = setInterval(() => {
            if (s < gltfPoint.height) {
                clearInterval(times);
                this.SmModelData.forEach((rs, index) => {
                    window.viewer.entities.remove(rs);
                });
                this.SmModelData = [];
            }
            modelList.position = new Cartesian3.fromDegrees(gltfPoint.longitude, gltfPoint.latitude, (s -= 0.15));
            modelList.orientation = Transforms.headingPitchRollQuaternion(
                modelList.position._value,
                new HeadingPitchRoll(CMath.toRadians((v -= 40)), 0, 0)
            );
        }, 60);
    }
    loadExtrudedEllipse(data, radius) {
        var extrudedEllipse = new GeometryInstance({
            geometry: new EllipseGeometry({
                center: data.position,
                semiMinorAxis: radius,
                semiMajorAxis: radius,
                vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
                height: data.thickness,
                extrudedHeight: data.height
            }),
            attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(
                    this.colorData[data.properties.name[0]] ? Color.fromCssColorString(this.colorData[data.properties.name[0]]) : Color.fromRandom({ alpha: 0.5 })
                )
            }
        });
        extrudedEllipse.id = data.properties;
        return extrudedEllipse
    }
    drawVirtualDrilling(instances) {
        let drill = new Primitive({
            geometryInstances: instances,
            appearance: new PerInstanceColorAppearance({
                flat: false,
                faceForward: true,
                translucent: false //是否半透明
            })
        });
        drill.name = this.virtualBoreholeName;
        let one_primitive = window.viewer.scene.primitives.add(drill);
        this._primitives.push(one_primitive)
        window.viewer.scene.globe.show = true;
    }

    /**
     * 定位点
     */
    flyTo() {
        window.viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(this._point.longitude, this._point.latitude, this._point.height + 100),
            duration: 1
        });

    }
    //销毁鼠标事件
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }
    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities.length; i++) {
            window.viewer.entities.remove(this._entities[i]);
        }
        for (let j = 0; j < this._primitives.length; j++) {
            window.viewer.scene.primitives.remove(this._primitives[j])
        }
        this._entities = [];
        this._primitives = [];
        this.destroy();
    }
}

