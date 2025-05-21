
import {
    Geokey3DTileset,
    Geokey3DTileStyle,
    Primitive,
    Model,
    Entity,
    Color,
    ScreenSpaceEventHandler,
    SceneTransforms,
    Transforms,
    Matrix4,
    Cartesian3,
    Cartesian2,
    Cartographic,
    ScreenSpaceEventType,
    CMath,
    HeadingPitchRoll,
    Ellipsoid
} from 'geokey-gis';
export async function load3dtiles() {
    // window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
    const tile = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/hsl/tileset.json?serviceName=hsl_B3dm')
    window.viewer.scene.primitives.add(tile);
    window.viewer.zoomTo(tile)
}
/**
 * 模型编辑助手，包含tileset以及graphic模型
 */
export class ModelEditHelper {
    constructor(model, opt) {
        if (!model) return;
        this.opt = opt || {};
        this.model = model;
        this.boundingSphere = this.boundingSphere = this.getBoundingSphere(this.model);
        if (!this.boundingSphere) return;
        this.center = this.boundingSphere.center.clone();
        this.handler = undefined;
        this.helperModel = this.createHelperModel(this.center, (this.opt.helperModel.scale || 1) * this.boundingSphere.radius / 2); // 辅助模型
        this.helperModel.show = true; // 默认初始化时 不展示模型  start开始展示
        this.axisType = undefined; // 标识当前操作的轴对象
        this.startPX = undefined; // 起始点坐标
        this.centerPX = undefined;
        this.startDirection = undefined;
        // 记录原始值
        this.origin = {
            headingAngle: this.opt.helperModel.headingAngle,
            pitchAngle: this.opt.helperModel.pitchAngle,
            rollAngle: this.opt.helperModel.rollAngle
        };
        this.heading = 90;
        this.pitch = 0;
        this.roll = 0;
        this.nowAngle = 0;
        this.lerp = 10;

        this.directionc2 = new Cartesian2(0, 1); // 屏幕正方向

        this.axis = opt.axis;

    }

    // 获取模型包围盒
    getBoundingSphere(model) {
        if (!model) return;
        let boundingSphere = undefined;
        if (model instanceof Geokey3DTileset || model instanceof Model) {
            boundingSphere = model.boundingSphere.clone();
        } else if (model instanceof Entity) {
            const index = viewer.scene.primitives._primitives.findIndex(e => e.id && e.id.id === model.id);
            if (index < 0) return;
            boundingSphere = viewer.scene.primitives.get(index).boundingSphere.clone();
            boundingSphere.center = model.position.getValue(viewer.clock.currentTime);
        }
        return boundingSphere;
    }

    // 构建辅助编辑模型
    createHelperModel(position, scale) {
        return viewer.entities.add({
            position: position.clone(),
            model: {
                uri: this.opt.helperModel.url || "model/axis_2.gltf",
                scale: scale || 1,
                color: Color.WHITE.withAlpha(this.opt.helperModel.opacity || 1)
            },
            type: "modelEditHelper"
        })

    }

    // 绑定编辑时间
    bindHandler() {
        if (!this.handler) this.handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        this.handler.setInputAction(evt => {
            if (this.startPosition) return;
            //单击开始绘制
            let pick = viewer.scene.pick(evt.position);
            if (pick && pick.id && pick.id.type == 'modelEditHelper') {
                this.axisType = pick.detail.node._name;
                this.forbidControl(true);
                this.centerPX = SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, this.center);
                this.startPX = evt.position;
                if (this.axisType.indexOf('Arrow') != -1) {
                    // 重置模型中心及局部坐标系
                    this.localMatrix = Transforms.eastNorthUpToFixedFrame(this.center.clone());
                    this.localMatrixInverse = Matrix4.inverse(this.localMatrix, new Matrix4());
                    this.localCenter = Matrix4.multiplyByPoint(this.localMatrixInverse, this.center.clone(), new Cartesian3());
                    // 转换比例
                    let position = viewer.scene.pickPosition(evt.position);
                    const disc3 = Cartesian3.distance(this.center, position);
                    const disc2 = Cartesian2.distance(this.centerPX, this.startPX);

                    this.directionc2 = Cartesian2.subtract(this.startPX, this.centerPX, new Cartesian2())
                    this.directionc2 = Cartesian2.normalize(this.directionc2.clone(), this.directionc2.clone())

                    const lnglat_center = Cartographic.fromCartesian(this.center.clone());
                    const start_lnglat = Cartographic.fromCartesian(position.clone());
                    // 根据轴来判断正负方向
                    let ng = 1;
                    if (this.axisType == 'YArrow_1') {
                        ng = start_lnglat.latitude - lnglat_center.latitude;
                    } else if (this.axisType == 'XArrow_1') {
                        ng = start_lnglat.longitude - lnglat_center.longitude;
                    } else {
                        ng = start_lnglat.height - lnglat_center.height;
                    }
                    ng = ng < 0 ? -1 : 1;
                    this.lerp = ng * disc3 / disc2;

                }
            } else {
                // 表示未拾取到轴模型
            }


        }, ScreenSpaceEventType.LEFT_DOWN);
        this.handler.setInputAction(evt => {
            if (!this.startPX || !this.axisType) return;
            const endPX = evt.endPosition;
            console.log('name：this.axisType', this.axisType);
            if (this.axisType.indexOf('Axis') != -1) { // 旋转
                let angle = this.computeAngle(this.centerPX, this.startPX, endPX);
                let fh = 1;
                if (this.axisType == 'ZAxis_1') {
                    fh = -1;
                    this.heading = (this.origin.headingAngle + fh * angle) % 360
                }
                if (this.axisType == 'XAxis_1') {
                    this.pitch = (this.origin.pitchAngle + angle) % 360
                }
                if (this.axisType == 'YAxis_1') {
                    this.roll = (this.origin.rollAngle + angle) % 360
                }

                this.nowAngle = fh * angle;
                this.setAxisHpr(this.heading, this.pitch, this.roll);
            } else { // 平移
                let dir = Cartesian2.subtract(endPX, this.startPX, new Cartesian2())
                // 判断方向和起始正方向是否一致
                let dot = Cartesian2.dot(dir.clone(), this.directionc2.clone());
                dot = dot < 0 ? -1 : 1;
                // 计算相对于鼠标按下的移动距离
                const disc2 = Cartesian2.distance(endPX, this.startPX);
                // 实际经纬度下 移动的距离
                let disc3 = disc2 * this.lerp * dot;
                let position = this.computeDistancePosition(disc3, this.axisType);
                this.setAxisPosition({ position: position, heading: this.heading, pitch: this.pitch, roll: this.roll });
                this.center = position.clone();
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        this.handler.setInputAction(evt => {
            // 保存上次修改的值
            if (this.axisType == 'ZAxis_1') this.origin.headingAngle += this.nowAngle;
            if (this.axisType == 'XAxis_1') this.origin.pitchAngle += this.nowAngle;
            if (this.axisType == 'YAxis_1') this.origin.rollAngle += this.nowAngle;

            this.startPX = undefined;
            this.axisType = undefined;
            this.forbidControl(false);
        }, ScreenSpaceEventType.LEFT_UP);
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = undefined;
        }
        if (this.helperModel) {
            viewer.entities.remove(this.helperModel);
            this.helperModel = undefined;
        }
    }

    /**
     * 开始编辑
     */
    start() {
        if (this.helperModel) {
            this.helperModel.position.setValue(this.center.clone());
            console.log('name：this.helperModel.position', this.helperModel.position);
            this.helperModel.show = true;
        }
        this.bindHandler();
    }
    /**
     * 结束编辑
     */
    end() {
        this.helperModel.show = false;
        if (this.handler) {
            this.handler.destroy();
            this.handler = undefined;
        }
    }

    // 由三点 计算夹角
    computeAngle(center, p1, p2) {
        const dir1 = Cartesian2.subtract(p1, center, new Cartesian2());
        const dir2 = Cartesian2.subtract(p2, center, new Cartesian2());
        let angle = Cartesian2.angleBetween(dir1, dir2);
        angle = CMath.toDegrees(angle);
        const cross = Cartesian2.cross(dir1, dir2);
        if (cross < 0) angle = 360 - angle;

        const camera_dir = Cartesian3.subtract(viewer.camera.position.clone(), this.center, new Cartesian3());
        // 计算是否是正对屏幕
        let ctgc = Cartographic.fromCartesian(this.center.clone());
        let fh = 1;
        if (this.axisType == 'YAxis_1') { // 经度
            let ctgc_y = ctgc.clone();
            ctgc_y.longitude += .01;
            let c3_y = Cartographic.toCartesian(ctgc_y);
            const normal_y = Cartesian3.subtract(c3_y, this.center.clone(), new Cartesian3());
            const normal_y_dot_camera = Cartesian3.dot(normal_y, camera_dir);
            if (normal_y_dot_camera > 0) { // 正面对屏幕
                fh = -1;
            } else { // 反面对屏幕
                fh = 1;
            }
        } else if (this.axisType == 'XAxis_1') { // 纬度
            let ctgc_x = ctgc.clone();
            ctgc_x.latitude += .01;
            let c3_x = Cartographic.toCartesian(ctgc_x);
            const normal_x = Cartesian3.subtract(c3_x, this.center.clone(), new Cartesian3());
            const normal_x_dot_camera = Cartesian3.dot(normal_x, camera_dir);
            if (normal_x_dot_camera > 0) { // 正面对屏幕
                fh = -1;
            } else { // 反面对屏幕
                fh = 1;
            }
        } else {

        }

        return fh * angle
    }

    forbidControl(isForbid) {
        viewer.scene.screenSpaceCameraController.enableRotate = !isForbid;
        viewer.scene.screenSpaceCameraController.enableTilt = !isForbid;
        viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid;
        viewer.scene.screenSpaceCameraController.enableInputs = !isForbid;
    }

    // 计算沿轴移动指定距离后的坐标值
    computeDistancePosition(dis, dirType) {
        let dir = undefined;
        if (dirType == 'XArrow_1') {
            dir = new Cartesian3(0, dis, 0);
        } else if (dirType == 'YArrow_1') {
            dir = new Cartesian3(dis, 0, 0);
        } else {
            dir = new Cartesian3(0, 0, dis);
        }
        let newCenter = Cartesian3.add(this.localCenter.clone(), dir, new Cartesian3());
        newCenter = Matrix4.multiplyByPoint(this.localMatrix, newCenter.clone(), newCenter.clone());
        return newCenter;
    }

    // 修改轴模型状态   
    setAxisHpr(heading, pitch, roll) {
        if (!this.helperModel) return;
        this.helperModel.orientation = Transforms.headingPitchRollQuaternion(
            this.helperModel.position.getValue(viewer.clock.currentTime), new HeadingPitchRoll(
                CMath.toRadians(heading || 0),
                CMath.toRadians(pitch || 0),
                CMath.toRadians(roll || 0)
            )
        )
        let modelMatrix = this.generateModelMatrix({ position: this.helperModel.position._value, heading: heading, pitch: roll, roll: pitch })
        this.model.root.transform = modelMatrix;
    }

    setAxisPosition(val) {
        let { position, heading, pitch, roll } = val;
        if (!this.helperModel || !position) return;
        this.helperModel.position.setValue(position);
        let modelMatrix = this.generateModelMatrix({ position: position, heading: heading, pitch: roll, roll: pitch })
        this.model.root.transform = modelMatrix;
    }
    /**
   * @description: 生成矩阵
   */
    generateModelMatrix(val) {
        let { position, heading, pitch, roll } = val;
        return Transforms.headingPitchRollToFixedFrame(
            position,
            {
                heading: CMath.toRadians(heading),
                pitch: CMath.toRadians(pitch),
                roll: CMath.toRadians(roll),
            },
            Ellipsoid.WGS84,
            Transforms.localFrameToFixedFrameGenerator("north", "west")
        );
    }


}

export default ModelEditHelper;