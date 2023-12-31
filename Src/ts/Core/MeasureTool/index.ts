import { Polygon } from 'GeoJSON';
import { Cartesian3, DataSource, Viewer } from 'cesium';

import { Cesium } from '../Impl/Declare';
import { CartographicTool } from '../../Utils/CoordinateTool/CartographicTool';
import { EntityFactory } from '../ExpandEntity/EntityFactory/index';
import { DrawShape } from '../DrawShape/index';
import { getMostDetailedHeight } from '../../Utils/SceneUtils/getMostDetailedHeight';
import { GISMathUtils } from '../../Utils/GISMathUtils/index';
import * as cesium from 'cesium';

/**
 * 测量工具类
 */
class MeasureTool {
    #viewer: Viewer;
    #dataSourceToo: DataSource;
    #drawShape: DrawShape;

    constructor(viewer: Viewer) {
        this.#viewer = viewer;
        this.#dataSourceToo = new Cesium.CustomDataSource('测量工具-实体集合');
        this.#viewer.dataSources.add(this.#dataSourceToo).then();

        this.#drawShape = new DrawShape(viewer);
    }

    /**
     * 测量 点高程
     */
    measureHeight() {
        let that = this;
        that.#drawShape.drawPoint({
            endCallback: async function (positions: Cartesian3[]) {
                let position = CartographicTool.formCartesian3(positions[0]);
                let heightStr = '计算中...';
                that.#dataSourceToo.entities.add(EntityFactory.createRedPoint(positions[0]));
                that.#dataSourceToo.entities.add(EntityFactory.buildLabel(positions[0],
                    new Cesium.CallbackProperty(() => heightStr, false))
                );

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
        that.#drawShape.drawHeightDistinct({
            endCallback: (positions: Cartesian3[]) => {
                if (positions.length === 2) {
                    that.#dataSourceToo.entities.add(EntityFactory.createHeightEllipse(positions));
                    const worldDegree = CartographicTool.formCartesian3(positions[0]);
                    const heightDifference = GISMathUtils.getHeight(positions);
                    that.#dataSourceToo.entities.add(
                        EntityFactory.PointLabelEntity(
                            Cesium.Cartesian3.fromDegrees(worldDegree.longitude, worldDegree.latitude, worldDegree.height + heightDifference),
                            GISMathUtils.getHeight(positions) + '米'
                        )
                    );
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
        that.#drawShape.drawTriangle({
            endCallback: function (positions: Cartesian3[]) {
                if (positions.length === 3) {
                    // 绘制点
                    for (let i in positions) {
                        that.#dataSourceToo.entities.add(EntityFactory.createRedPoint(positions[i]));
                    }

                    // 绘制线条
                    that.#dataSourceToo.entities.add(EntityFactory.createLightingLine(positions));

                    // 绘制最后的标注
                    let text = GISMathUtils.calculateTriangle(positions).toFixed(3) + '度';
                    let entityLabel = EntityFactory.buildLabel(positions[1], text);

                    that.#dataSourceToo.entities.add(entityLabel);
                }
            }
        });
    }

    /**
     * 测量空间距离
     */
    spaceDistance() {
        let that = this;
        this.#drawShape.drawPolyLine({
            endCallback: (positions: Cartesian3[]) => {
                if (positions.length >= 2) {
                    // 绘制点
                    for (let i in positions) {
                        that.#dataSourceToo.entities.add(EntityFactory.createRedPoint(positions[i]));
                    }

                    // 绘制线条
                    that.#dataSourceToo.entities.add(EntityFactory.createLightingLine(positions));

                    // 绘制最后的标注
                    for (let i = 0; i < positions.length - 1; i++) {
                        let startPoint = positions[i];
                        let endPoint = positions[i + 1];
                        that.#dataSourceToo.entities.add(EntityFactory.spaceDistanceLabel(startPoint, endPoint));
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
        this.#drawShape.drawPolygon({
            endCallback: async function (positions: Cartesian3[]) {
                if (positions.length > 3) {
                    positions.push(positions[0]);
                    that.#dataSourceToo.entities.add(EntityFactory.createLightingPolygon(positions));
                    let geoJson: Polygon = {
                        type: 'Polygon',
                        coordinates: [CartographicTool.formCartesian3S(positions).map(item => [item.longitude, item.latitude, item.height])]
                    };
                    that.#dataSourceToo.entities.add(await EntityFactory.polygonCenterLabel(geoJson, '面积'));
                } else {
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
        this.#drawShape.drawPolygon({
            endCallback: async (positions: Cartesian3[]) => {
                if (positions.length > 3) {
                    positions.push(positions[0]);
                    that.#dataSourceToo.entities.add(EntityFactory.createLightingPolygon(positions));
                    let geoJson: Polygon = {
                        type: 'Polygon',
                        coordinates: [CartographicTool.formCartesian3S(positions).map(item => [item.longitude, item.latitude, item.height])]
                    };
                    that.#dataSourceToo.entities.add(await EntityFactory.polygonCenterLabel(geoJson, '周长'));
                } else {
                    console.error('绘制失败');
                }
            }
        });
    }

    /**
     * 终止测量
     */
    stopMeasure() {
        this.#drawShape.callStop();
    }

    /**
     * 清除所有测量结果
     */
    removeAll() {
        this.#dataSourceToo.entities.removeAll();
    }
}


export { MeasureTool };



