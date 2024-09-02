var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MeasureTool_viewer, _MeasureTool_dataSourceToo, _MeasureTool_drawShape;
import { Cesium } from '../Impl/Declare';
import { CartographicTool } from '../../Utils/CoordinateTool/CartographicTool';
import { EntityFactory } from '../ExpandEntity/EntityFactory/index';
import { DrawShape } from '../DrawShape/index';
import { getMostDetailedHeight } from '../../Utils/SceneUtils/getMostDetailedHeight';
import { GISMathUtils } from '../../Utils/GISMathUtils/index';
/**
 * 测量工具类
 */
class MeasureTool {
    constructor(viewer) {
        _MeasureTool_viewer.set(this, void 0);
        _MeasureTool_dataSourceToo.set(this, void 0);
        _MeasureTool_drawShape.set(this, void 0);
        __classPrivateFieldSet(this, _MeasureTool_viewer, viewer, "f");
        __classPrivateFieldSet(this, _MeasureTool_dataSourceToo, new Cesium.CustomDataSource('测量工具-实体集合'), "f");
        __classPrivateFieldGet(this, _MeasureTool_viewer, "f").dataSources.add(__classPrivateFieldGet(this, _MeasureTool_dataSourceToo, "f")).then();
        __classPrivateFieldSet(this, _MeasureTool_drawShape, new DrawShape(viewer), "f");
    }
    /**
     * 测量 点高程
     */
    measureHeight() {
        let that = this;
        __classPrivateFieldGet(that, _MeasureTool_drawShape, "f").drawPoint({
            endCallback: async function (positions) {
                let position = CartographicTool.formCartesian3(positions[0]);
                let heightStr = '计算中...';
                __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createRedPoint(positions[0]));
                __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.buildLabel(positions[0], new Cesium.CallbackProperty(() => heightStr, false)));
                let [cartesianHasHeight] = await getMostDetailedHeight([{
                        longitude: position.longitude,
                        latitude: position.latitude,
                        height: 0
                    }]);
                let height = cartesianHasHeight.height;
                heightStr = height.toFixed(3) + ' m';
            }
        });
    }
    /**
     * 测高差
     */
    verticalDistance() {
        let that = this;
        __classPrivateFieldGet(that, _MeasureTool_drawShape, "f").drawHeightDistinct({
            endCallback: (positions) => {
                if (positions.length === 2) {
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createHeightEllipse(positions));
                    const worldDegree = CartographicTool.formCartesian3(positions[0]);
                    const heightDifference = GISMathUtils.getHeight(positions);
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.PointLabelEntity(Cesium.Cartesian3.fromDegrees(worldDegree.longitude, worldDegree.latitude, worldDegree.height + heightDifference), GISMathUtils.getHeight(positions) + '米'));
                }
            }
        });
    }
    /**
     * 三角量距
     */
    CesiumTriangle() {
    }
    /**
     * 测量角度
     */
    measureTriangle() {
        let that = this;
        __classPrivateFieldGet(that, _MeasureTool_drawShape, "f").drawTriangle({
            endCallback: function (positions) {
                if (positions.length === 3) {
                    // 绘制点
                    for (let i in positions) {
                        __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createRedPoint(positions[i]));
                    }
                    // 绘制线条
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createLightingLine(positions));
                    // 绘制最后的标注
                    let text = GISMathUtils.calculateTriangle(positions).toFixed(3) + '度';
                    let entityLabel = EntityFactory.buildLabel(positions[1], text);
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(entityLabel);
                }
            }
        });
    }
    /**
     * 测量空间距离
     */
    spaceDistance() {
        let that = this;
        __classPrivateFieldGet(this, _MeasureTool_drawShape, "f").drawPolyLine({
            endCallback: (positions) => {
                if (positions.length >= 2) {
                    // 绘制点
                    for (let i in positions) {
                        __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createRedPoint(positions[i]));
                    }
                    // 绘制线条
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createLightingLine(positions));
                    // 绘制最后的标注
                    for (let i = 0; i < positions.length - 1; i++) {
                        let startPoint = positions[i];
                        let endPoint = positions[i + 1];
                        __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.spaceDistanceLabel(startPoint, endPoint));
                    }
                }
            }
        });
    }
    /**
     * 测量面积
     */
    surfaceArea() {
        let that = this;
        __classPrivateFieldGet(this, _MeasureTool_drawShape, "f").drawPolygon({
            endCallback: async function (positions) {
                if (positions.length > 3) {
                    positions.push(positions[0]);
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createLightingPolygon(positions));
                    let geoJson = {
                        type: 'Polygon',
                        coordinates: [CartographicTool.formCartesian3S(positions).map(item => [item.longitude, item.latitude, item.height])]
                    };
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(await EntityFactory.polygonCenterLabel(geoJson, '面积'));
                }
                else {
                    console.error('绘制失败');
                }
            }
        });
    }
    /**
     * 测量周长
     */
    perimeter() {
        let that = this;
        __classPrivateFieldGet(this, _MeasureTool_drawShape, "f").drawPolygon({
            endCallback: async (positions) => {
                if (positions.length > 3) {
                    positions.push(positions[0]);
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(EntityFactory.createLightingPolygon(positions));
                    let geoJson = {
                        type: 'Polygon',
                        coordinates: [CartographicTool.formCartesian3S(positions).map(item => [item.longitude, item.latitude, item.height])]
                    };
                    __classPrivateFieldGet(that, _MeasureTool_dataSourceToo, "f").entities.add(await EntityFactory.polygonCenterLabel(geoJson, '周长'));
                }
                else {
                    console.error('绘制失败');
                }
            }
        });
    }
    /**
     * 终止测量
     */
    stopMeasure() {
        __classPrivateFieldGet(this, _MeasureTool_drawShape, "f").callStop();
    }
    /**
     * 清除所有测量结果
     */
    removeAll() {
        __classPrivateFieldGet(this, _MeasureTool_dataSourceToo, "f").entities.removeAll();
    }
}
_MeasureTool_viewer = new WeakMap(), _MeasureTool_dataSourceToo = new WeakMap(), _MeasureTool_drawShape = new WeakMap();
export { MeasureTool };
