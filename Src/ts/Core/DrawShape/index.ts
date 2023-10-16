import { Cesium } from '../Impl/Declare';
import {
    CallbackProperty,
    Cartesian3,
    Color,
    CustomDataSource,
    Entity,
    Material,
    ScreenSpaceEventHandler,
    Viewer
} from 'cesium';
import { getInclinedRectangle } from './getInclinedRectangle';
import { getRectanglePoint } from './getRectanglePoint';
import { coordinateTransform } from './coordinateTransform';
import { HandlerMana } from '../HandlerMana/index';
import { PolylineLightingMaterial } from '../ExpandEntity/Material/Polyline/lib/PolylineLightingMaterial';
import { GISMathUtils } from '../../Utils/GISMathUtils/index';
import { EntityFactory } from '../ExpandEntity/EntityFactory/index';
import { CoordinateType } from './CoordinateType';


const commitEndCallBack = (coordinateType: CoordinateType | null | undefined, endCallback: Function | null | undefined, ps: Cartesian3[]) => {
    if (typeof endCallback === 'function') {
        let type = coordinateType || CoordinateType.cartesian3;
        endCallback(coordinateTransform(type, ps));
    }
};

interface DrawShapeOptions {
    position?: any,
    normal?: any,
    dimensions?: any,
    coordinateType?: CoordinateType | null | undefined,
    endCallback?: Function | null,
    moveCallback?: Function | null,
    errCallback?: Function | null
}


/**
 *  名称：坐标采集工具
 *  描述：支持：【画点】、【画线】、【画多折线】、【画角度】、【画多边形】、【画圆】、【画矩形】、【画斜矩形】，返回坐标
 *
 *  默认返回的数据格式是笛卡尔坐标系：
 *
 * positions = [
 *   {"x":-2170133.6691256277,"y":4662743.784446367,"z":3759613.917915065},
 *   {"x":-2170143.223638534,"y":4663097.568298324,"z":3759172.906975031},
 *   {"x":-2170616.8730793963,"y":4662536.019548276,"z":3759592.791057056},
 *   {"x":-2170133.6691256277,"y":4662743.784446367,"z":3759613.917915065}
 * ]
 *
 * 支持的输出格式：cartesian（默认）、cartographicObj、cartographicArr
 *
 *  最后修改日期：2022-02-28
 */
class DrawShape {
    public viewer!: Viewer;
    public dataSourceToo!: CustomDataSource;

    // 绘制图形的坐标串
    private coordinates: Cartesian3[] = [];
    // 已经确定位置的几何形节点
    private dynamicNodesPoint: Entity[] = [];
    // 绘图过程中生成的实体，如点和图形
    private drawEntities: Entity | null | undefined = null;

    private endCallback: Function | null | undefined = null;
    private moveCallback: Function | null | undefined = null;
    private errCallback: Function | null | undefined = null;
    private returnPositions: Cartesian3[] = [];


    private isDepthTest: boolean;

    private handler: ScreenSpaceEventHandler;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.handler = HandlerMana.getHandle(viewer, null).handler;

        this.dataSourceToo = new Cesium.CustomDataSource('坐标采集工具-实体集合');
        viewer.dataSources.add(this.dataSourceToo).then();


        // 查询当前视图是否开启了深度探测
        this.isDepthTest = viewer.scene.globe.depthTestAgainstTerrain;
    }

    // 画点函数
    public drawPoint({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        // 设置左键单击拾取坐标事件，结束画点函数
        handler.setInputAction(function (event: any) {
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.drawShapeEnd();
                commitEndCallBack(coordinateType, endCallback, [earthPosition]);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction(function (event: any) {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);
            if (typeof moveCallback === 'function') {
                moveCallback(newPosition);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件，以异常结束的方式终止画点函数
        handler.setInputAction(() => {
            that.drawShapeErrorCallback(null);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 画线函数
    public drawLine({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;


        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(EntityFactory.createPoint(earthPosition)); // 生成点

                that.returnPositions = coordinateTransform(coordinateType, that.coordinates);

                // 生成点和图形
                if (!that.drawEntities) {
                    that.drawEntities = that.dataSourceToo.entities.add({
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return that.coordinates;
                            }, false),
                            width: 12,
                            clampToGround: true,
                            arcType: Cesium.ArcType.RHUMB,
                            // @ts-ignore
                            material: new PolylineLightingMaterial(Cesium.Color.GREEN)
                        }
                    });
                }

                if (that.coordinates.length >= 2) {
                    commitEndCallBack(coordinateType, endCallback, that.coordinates);
                    that.drawShapeEnd();
                } else {
                    that.coordinates.push(earthPosition);
                }


            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);
            // 移动点跟着光标动
            if (Cesium.defined(newPosition)) {

                if (that.coordinates.length === 1) {
                    that.coordinates.push(newPosition);
                }

                if (that.coordinates.length >= 2) {
                    // 更新最新鼠标点
                    that.coordinates.pop();
                    that.coordinates.push(newPosition);
                }

                if (typeof moveCallback === 'function') {
                    moveCallback(that.coordinates);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件
        handler.setInputAction(() => {
            that.coordinates.pop();
            if (that.coordinates.length >= 1) {
                commitEndCallBack(coordinateType, endCallback, that.coordinates);
            } else {
                that.drawShapeErrorCallback(null);
            }
            that.drawShapeEnd();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 画多折线
    public drawPolyLine({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;


        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(EntityFactory.createPoint(earthPosition)); // 生成点

                that.coordinates.push(earthPosition);
                that.returnPositions = coordinateTransform(coordinateType, that.coordinates);

                // 生成点和图形
                if (!that.drawEntities) {
                    that.drawEntities = that.dataSourceToo.entities.add({
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return that.coordinates;
                            }, false),
                            width: 12,
                            clampToGround: true,
                            arcType: Cesium.ArcType.RHUMB,
                            // @ts-ignore
                            material: new PolylineLightingMaterial(Cesium.Color.GREEN)
                        }
                    });
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);
            // 移动点跟着光标动
            if (Cesium.defined(newPosition)) {

                if (that.coordinates.length === 1) {
                    that.coordinates.push(newPosition);
                }

                if (that.coordinates.length >= 2) {
                    // 更新最新鼠标点
                    that.coordinates.pop();
                    that.coordinates.push(newPosition);
                }

                if (typeof moveCallback === 'function') {
                    moveCallback(that.coordinates);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件
        handler.setInputAction(() => {
            that.coordinates.pop();
            if (that.coordinates.length >= 1) {
                commitEndCallBack(coordinateType, endCallback, that.coordinates);
            } else {
                that.drawShapeErrorCallback(null);
            }
            that.drawShapeEnd();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 画角度
    public drawTriangle({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        let returnPositions: Cartesian3[] = [];// 多折线坐标数组

        let dynamicPositions;

        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(
                    EntityFactory.createPoint(earthPosition)); // 生成点

                returnPositions.push(earthPosition);
                that.coordinates.push(earthPosition);

                // 生成点和图形
                if (!that.drawEntities) {


                    dynamicPositions = new Cesium.CallbackProperty(function () {
                        return that.coordinates;
                    }, false);
                    that.drawEntities = that.dataSourceToo.entities.add({
                        polyline: {
                            positions: dynamicPositions,
                            width: 12,
                            clampToGround: true,
                            arcType: Cesium.ArcType.RHUMB,
                            // @ts-ignore
                            material: new PolylineLightingMaterial(Cesium.Color.GREEN)
                        }
                    });
                }


                if (returnPositions.length === 3) {
                    commitEndCallBack(coordinateType, endCallback, returnPositions);
                    that.drawShapeEnd();
                }

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);
            // 移动点跟着光标动
            if (Cesium.defined(newPosition)) {

                if (that.coordinates.length === 1) {
                    that.coordinates.push(newPosition);
                }

                if (that.coordinates.length >= 2) {
                    // 更新最新鼠标点
                    that.coordinates.pop();
                    that.coordinates.push(newPosition);
                    that.returnPositions = coordinateTransform(coordinateType, that.coordinates);
                }

                if (typeof moveCallback === 'function') {
                    moveCallback(that.coordinates);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件
        handler.setInputAction(() => {

            that.drawShapeEnd();

            if (returnPositions.length >= 2) {
                commitEndCallBack(coordinateType, endCallback, returnPositions);
            } else {
                that.drawShapeErrorCallback(null);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 画多边形
    public drawPolygon({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        let minPointsSize = 2; // 多边形最少点数
        let returnPosition: Cartesian3[] = []; // 诡异的bug，数组的值会发生跳动

        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(EntityFactory.createPoint(earthPosition)); // 生成点

                returnPosition.push(JSON.parse(JSON.stringify(earthPosition)));

                that.coordinates.push(earthPosition);
                that.returnPositions = coordinateTransform(coordinateType, that.coordinates);

                if (that.dynamicNodesPoint.length === minPointsSize) {
                    if (!that.drawEntities) {
                        that.drawEntities = that.dataSourceToo.entities.add(EntityFactory.createLightingPolygon(that.coordinates));
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);

            // 移动点跟着光标动
            if (Cesium.defined(newPosition)) {

                that.coordinates.pop();
                that.coordinates.push(newPosition);

                if (typeof moveCallback === 'function') {
                    let moveReturn = JSON.parse(JSON.stringify(returnPosition));
                    moveReturn.push(JSON.parse(JSON.stringify(newPosition)));
                    moveCallback(moveReturn);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // 右键结束
        handler.setInputAction(function () {
            that.drawShapeEnd();

            // 如果绘制的点数少于最小点数，返回绘制失败
            if (returnPosition.length >= minPointsSize) {
                returnPosition.push(returnPosition[0]);
                commitEndCallBack(coordinateType, endCallback, returnPosition);
            } else {
                that.drawShapeErrorCallback(null);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 画圆
    public drawCircle({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        let dynamicPositions: CallbackProperty | null = null;
        let circleCenter: Cartesian3 | null = null; // 圆心
        let distance = 0; // 半径

        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(
                    EntityFactory.createPoint(earthPosition)); // 生成点

                if (!circleCenter) {
                    circleCenter = earthPosition;
                } else {
                    if (typeof endCallback === 'function') {
                        endCallback({
                            'Center': circleCenter,
                            'EndPoint': earthPosition,
                            'Radius': distance
                        });
                    }
                    that.drawShapeEnd();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);
            // 移动点跟着光标动
            if (Cesium.defined(newPosition)) {

                if (circleCenter) {
                    let cartographic0 = that.viewer.scene.globe.ellipsoid.cartesianToCartographic(
                        circleCenter);
                    let cartographic1 = that.viewer.scene.globe.ellipsoid.cartesianToCartographic(
                        newPosition);
                    let geodesic = new Cesium.EllipsoidGeodesic(cartographic0,
                        cartographic1);
                    distance = geodesic.surfaceDistance;

                    if (typeof moveCallback === 'function') {
                        moveCallback({
                            'Center': circleCenter,
                            'EndPoint': newPosition,
                            'Radius': distance
                        });
                    }
                    if (!dynamicPositions) {
                        dynamicPositions = new Cesium.CallbackProperty(function () {
                            return distance;
                        }, false);
                    }
                    if (!that.drawEntities) {
                        // @ts-ignore
                        that.drawEntities = that.dataSourceToo.entities.add({
                            position: circleCenter,
                            name: 'Red ellipse on surface',
                            ellipse: {
                                // @ts-ignore
                                semiMinorAxis: dynamicPositions,
                                // @ts-ignore
                                semiMajorAxis: dynamicPositions,
                                material: Cesium.Color.RED.withAlpha(0.5)
                            }
                        });
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件，表示结束取消
        handler.setInputAction((event: any) => {
            that.drawShapeErrorCallback(null);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    /**
     * 画矩形
     * @param coordinateType
     * @param endCallback
     * @param moveCallback
     * @param errCallback
     */
    public drawRectangle({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        // 用于表示正矩形的两个坐标的，分别为矩形【左上角和右上角坐标】
        let RectanglePoint: Cartesian3[] = [];

        let positions: Cartesian3[] = []; // 多边形坐标数组
        let dynamicPositions; // 异步地址调用 positions 的数组

        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(
                    EntityFactory.createPoint(earthPosition)); // 生成点
                RectanglePoint.push(earthPosition);

                if (RectanglePoint.length === 1) {
                    // 当只有一个点的时候，生成矩形实体
                    if (!that.drawEntities) {
                        dynamicPositions = new Cesium.CallbackProperty(function () {
                            return new Cesium.PolygonHierarchy(positions);
                        }, false);
                        that.drawEntities = that.dataSourceToo.entities.add({
                            polygon: {
                                hierarchy: dynamicPositions,
                                material: new Cesium.ColorMaterialProperty(
                                    Cesium.Color.LIGHTSKYBLUE.withAlpha(0.3)),
                                heightReference: Cesium.HeightReference.NONE
                            }
                        });
                    }
                }

                if (RectanglePoint.length === 2) {
                    RectanglePoint[1] = earthPosition;


                    positions = getRectanglePoint(RectanglePoint[0], RectanglePoint[1]);

                    commitEndCallBack(coordinateType, endCallback, positions);
                    that.drawShapeEnd();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);

            if (RectanglePoint.length === 1 && newPosition) {
                // @ts-ignore
                positions = positions = getRectanglePoint(RectanglePoint[0], newPosition);
                if (typeof moveCallback === 'function') {
                    moveCallback(that.coordinates);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 右键结束,但是不返回结果
        handler.setInputAction(function () {
            that.drawShapeErrorCallback(null);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    /**
     * 画斜距形
     * @param coordinateType
     * @param endCallback
     * @param moveCallback
     * @param errCallback
     */
    public drawInclinedRectangle({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        let minPointsSize = 2; // 斜距形最少点数
        let dynamicPositions;

        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            // 获得鼠标点击位置的坐标

            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                that.dynamicNodesPoint.push(
                    EntityFactory.createPoint(earthPosition)); // 生成点
                if (that.coordinates.length < minPointsSize) {
                    that.coordinates.push(earthPosition);
                }
                // 生成点和图形
                if (that.dynamicNodesPoint.length === minPointsSize) {
                    if (!that.drawEntities) {
                        dynamicPositions = new Cesium.CallbackProperty(function () {
                            return new Cesium.PolygonHierarchy(that.coordinates);
                        }, false);
                        that.drawEntities = that.dataSourceToo.entities.add({
                            polygon: {
                                hierarchy: dynamicPositions,
                                material: new Cesium.ColorMaterialProperty(
                                    Cesium.Color.LIGHTSKYBLUE.withAlpha(0.3)),
                                heightReference: Cesium.HeightReference.NONE
                            }
                        });
                    }
                }
                // 第三个点的时候停止
                if (that.dynamicNodesPoint.length === 3) {
                    commitEndCallBack(coordinateType, endCallback, that.coordinates);
                    that.drawShapeEnd();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);

            if (Cesium.defined(newPosition)) {
                // 当position的点数是两个的时候，自动计算出第三第四个点，并且添加到
                if (that.coordinates.length === minPointsSize) {
                    let cartesian1 = new Cesium.Cartesian3();
                    let cartesian2 = new Cesium.Cartesian3();
                    getInclinedRectangle(that.coordinates[0], that.coordinates[1], newPosition, cartesian1, cartesian2);
                    that.coordinates.push(cartesian1, cartesian2);
                } else if (that.coordinates.length > minPointsSize) {
                    that.coordinates.pop();
                    that.coordinates.pop();
                    let cartesian1 = new Cesium.Cartesian3();
                    let cartesian2 = new Cesium.Cartesian3();
                    getInclinedRectangle(that.coordinates[0], that.coordinates[1], newPosition, cartesian1, cartesian2);
                    that.coordinates.push(cartesian1);
                    that.coordinates.push(cartesian2);

                    if (typeof moveCallback === 'function') {
                        moveCallback(that.coordinates);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 右键结束,但是不返回结果
        handler.setInputAction(function () {
            that.drawShapeErrorCallback(null);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 画高差
    public drawHeightDistinct({coordinateType, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        // 设置左键单击拾取坐标事件
        handler.setInputAction((event: any) => {
            let earthPosition = that.viewer.scene.pickPosition(event.position);

            if (Cesium.defined(earthPosition)) {
                if (that.coordinates.length == 0) {
                    that.dynamicNodesPoint.push(EntityFactory.createPoint(earthPosition));

                    that.coordinates.push(earthPosition);
                    that.coordinates.push(earthPosition);
                    that.dataSourceToo.entities.add(EntityFactory.createHeightEllipse(that.coordinates));
                    that.dataSourceToo.entities.add(
                        EntityFactory.PointLabelEntity(
                            that.coordinates[0],
                            new Cesium.CallbackProperty(() => GISMathUtils.getHeight(that.coordinates) + '米', false)
                        )
                    );
                } else {
                    commitEndCallBack(coordinateType, endCallback, that.coordinates);
                    that.drawShapeEnd();
                    handler.destroy();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction((event: any) => {
            let newPosition = that.viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
                if (that.coordinates.length === 2) {
                    that.coordinates[1] = newPosition;
                }
            }
            if (typeof moveCallback === 'function') {
                moveCallback(that.coordinates);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件，表示结束取消
        handler.setInputAction(() => {
            if (that.coordinates.length === 0) {
                commitEndCallBack(coordinateType, endCallback, that.coordinates);
            }
            that.drawShapeEnd();
            handler.destroy();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }


    /**
     * 画在Y方向上移动的plane
     * @param position   plane的初始位置
     * @param normal    距离
     * @param dimensions   面的大小
     * @param callback   返回值
     */
    public drawYPlan({position, normal, dimensions, endCallback, moveCallback, errCallback}: DrawShapeOptions) {
        let that = this;
        let handler = that.drawShapeStart();
        that.endCallback = endCallback;
        that.moveCallback = moveCallback;
        that.errCallback = errCallback;

        function createPlaneUpdateFunction(plane: { distance: number; }) {
            return function () {
                plane.distance = targetY;
                return plane;
            };
        }

        let selectedPlane: { material: Material; outlineColor: Color } | undefined;
        let targetY = 0.0;

        let plane = new Cesium.ClippingPlane(normal, 0.0);

        that.drawEntities = that.dataSourceToo.entities.add({
            position: position,
            plane: {
                // dimensions : new Cesium.Cartesian2(10000.0, 10000.0),
                dimensions: dimensions,
                material: Cesium.Color.BLUE.withAlpha(0.5),
                plane: new Cesium.CallbackProperty(createPlaneUpdateFunction(plane),
                    false),
                outline: true,
                outlineColor: Cesium.Color.BLUE
            }
        });
        // @ts-ignore
        that.drawEntities.drawYPlan = 'drawYPlan';

        handler.setInputAction((movement: { position: Cartesian3 | any; }) => {
            let pickedObject = that.viewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject) &&
                Cesium.defined(pickedObject.id) &&
                Cesium.defined(pickedObject.id.plane) &&
                pickedObject.id.drawYPlan == 'drawYPlan') {
                selectedPlane = pickedObject.id.plane;
                // @ts-ignore
                selectedPlane.material = Cesium.Color.RED.withAlpha(0.5);
                // @ts-ignore
                selectedPlane.outlineColor = Cesium.Color.RED;
                that.viewer.scene.screenSpaceCameraController.enableInputs = false;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(() => {
            if (Cesium.defined(selectedPlane)) {
                // @ts-ignore
                selectedPlane.material = Cesium.Color.BLUE.withAlpha(0.5);
                // @ts-ignore
                selectedPlane.outlineColor = Cesium.Color.BLUE;
                selectedPlane = undefined;
            }
            if (typeof endCallback === 'function') {
                endCallback(targetY);
            }

            that.viewer.scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction((movement: { startPosition: Cartesian3 | any; endPosition: Cartesian3 | any; }) => {
            if (Cesium.defined(selectedPlane)) {
                let deltaY = movement.startPosition.y - movement.endPosition.y;
                targetY += deltaY;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标右击事件，表示结束取消
        handler.setInputAction(() => {
            that.drawShapeErrorCallback(null);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    // 在绘图过程中，可能需要由外部调用函数的方式，终止当前的绘图动作，并返回现有的结果
    public callStop() {
        if (this.returnPositions.length && this.endCallback) {
            this.returnPositions.pop();
            this.endCallback(this.returnPositions);
        }
        this.drawShapeEnd();
    }

    /**
     * 正在执行的绘制任务被其他绘制任务挤掉之后执行的回调
     * @param err
     */
    private drawShapeErrorCallback(err: any) {
        let that = this;
        that.drawShapeEnd();
        typeof that.errCallback === 'function' && that.errCallback(err);
    }

    // 画图前的一些准备工作
    private drawShapeStart() {
        let that = this;
        that.drawShapeEnd();
        // 改变鼠标样式
        window.document.body.style.cursor = 'crosshair';
        // 获取事件句柄
        that.handler = HandlerMana.getHandle(that.viewer, that.drawShapeErrorCallback).handler;
        // 保存当前视图深度探测状态
        that.isDepthTest = that.viewer.scene.globe.depthTestAgainstTerrain;

        // 开启深度探测
        if (!that.isDepthTest) {
            that.viewer.scene.globe.depthTestAgainstTerrain = true;
            console.log('%c自动开启深度检测！', 'color: #43bb88;');
        }

        return that.handler;
    }

    // 执行画图完成后的一些工作
    private drawShapeEnd() {
        let that = this;
        // 恢复鼠标样式
        window.document.body.style.cursor = 'auto';
        // 清除已经绘制的 entity
        that.clearDrawEntity();
        // 恢复深度探测的状态
        that.viewer.scene.globe.depthTestAgainstTerrain = that.isDepthTest;
        // 销毁事件句柄
        if (!that.handler.isDestroyed()) {
            that.handler.destroy();
        }

        that.endCallback = Function;
        that.moveCallback = Function;
        that.errCallback = Function;
    }

    /**
     * 清除已经绘制的 entity
     */
    private clearDrawEntity() {
        let that = this;
        that.coordinates = [];

        that.dataSourceToo.entities.removeAll();

        // 已经确定位置的几何形节点
        that.dynamicNodesPoint = [];

        // 绘制的实体
        that.drawEntities = null;
    }
}


export { DrawShape };
