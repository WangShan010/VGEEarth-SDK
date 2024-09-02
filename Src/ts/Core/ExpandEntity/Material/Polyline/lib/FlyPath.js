import { Cesium } from '../../../../Impl/Declare';
import { FlyCylinder } from './FlyCylinder';
import { SafeTool } from '../../../../../Utils/YaoDo/Source/SafeTool';
/**
 * 动态轨迹中的实体模型
 * @example
 * //创建一个动态实体模型类
 *     let property = new Cesium.SampledPositionProperty();
 *     let flyPath = new VGEEarth.Material.Polyline.FlyPath(viewer, {
 *         orientation: new Cesium.VelocityOrientationProperty(property),
 *         model: {
 *             uri: "./wrj.glb",
 *             colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
 *             color: Cesium.Color.WHITE,
 *             scale: 0.1,
 *             minimumPixelSize: 50,
 *         },
 *         label: {
 *             text: '侦查无人机',
 *             color: Cesium.Color.AZURE,
 *             outline: true,
 *             outlineColor: Cesium.Color.BLACK,
 *             outlineWidth: 2,
 *             horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
 *             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
 *             pixelOffset: new Cesium.Cartesian2(10, -25),
 *             scaleByDistance: new Cesium.NearFarScalar(500, 1, 1500, 0.4),
 *         },
 *     });
 *
 * //将该动态模型添加到实体集合中
 * addPath();
 *
 * //移除动态模型
 * remove();
 */
class FlyPath {
    /**
     * 创建动态模型
     * @param {Viewer} _viewer The base Cesium widget for building applications.
     * @param pathPositions
     * @param {FlyPathParams} _params 动态模型配置参数
     */
    constructor(_viewer, pathPositions = [], _params) {
        this.uid = SafeTool.uuid();
        this.flyCylinder = null;
        this.flyPathBuffer = null;
        this.pathPositionsWithJulianDate = [];
        this.viewer = _viewer;
        this.pathEntity = null;
        this.pathPointsDataSource = new Cesium.CustomDataSource('pathPoints-' + this.uid);
        this.viewer.dataSources.add(this.pathPointsDataSource);
        this.pathPositionsWithJulianDate = pathPositions.map((item) => {
            return {
                longitude: item.longitude,
                latitude: item.latitude,
                height: item.height,
                julianDate: Cesium.JulianDate.fromIso8601(item.isoTime)
            };
        });
        this.params = {
            style: _params.style || {},
            model: {
                uri: _params.model?.uri || 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/Model/wrj.glb',
                colorBlendMode: _params.model?.colorBlendMode || Cesium.ColorBlendMode.HIGHLIGHT,
                color: _params.model?.color || Cesium.Color.WHITE,
                scale: _params.model?.scale || 0.1,
                minimumPixelSize: _params.model?.minimumPixelSize || 50
            },
            label: {
                text: _params.label?.text || '侦查无人机',
                color: _params.label?.color || Cesium.Color.AZURE,
                outline: _params.label?.outline || true,
                outlineColor: _params.label?.outlineColor || Cesium.Color.BLACK,
                outlineWidth: _params.label?.outlineWidth || 2,
                horizontalOrigin: _params.label?.horizontalOrigin || Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: _params.label?.verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: _params.label?.pixelOffset || new Cesium.Cartesian2(10, -25),
                scaleByDistance: _params.label?.scaleByDistance || new Cesium.NearFarScalar(500, 1, 1500, 0.4)
            }
        };
        this.addPath();
    }
    addPathPoints() {
        this.pathPointsDataSource.entities.removeAll();
        this.pathPositionsWithJulianDate.forEach((item) => {
            const position = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height);
            this.pathPointsDataSource.entities.add({
                position: position,
                point: { pixelSize: 4, color: Cesium.Color.WHITE.withAlpha(0.8) }
            });
        });
    }
    addPathBuffer() {
        this.flyPathBuffer = this.viewer.entities.add({
            name: '飞行路线缓冲区',
            corridor: {
                positions: new Cesium.CallbackProperty((time, result) => {
                    const allPoint = this.pathPositionsWithJulianDate;
                    let passPoint = [];
                    allPoint.find(item => {
                        const juliaDate = item.julianDate;
                        if (juliaDate <= time) {
                            passPoint.push(item.longitude);
                            passPoint.push(item.latitude);
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                    return Cesium.Cartesian3.fromDegreesArray(passPoint);
                }, false),
                width: 700.0,
                material: Cesium.Color.GREEN.withAlpha(0.5)
            }
        });
    }
    /**
     * 将该动态模型添加到实体集合中
     */
    addPath() {
        let start = Cesium.JulianDate.fromIso8601('');
        let stop = Cesium.JulianDate.fromIso8601('');
        // 坐标差值回调函数
        const positionProperty = new Cesium.SampledPositionProperty();
        this.pathPositionsWithJulianDate.forEach((item, index) => {
            const position = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height);
            const juliaDate = item.julianDate;
            positionProperty.addSample(juliaDate, position);
            start = index === 0 ? juliaDate : start;
            stop = index === this.pathPositionsWithJulianDate.length - 1 ? juliaDate : stop;
        });
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.shouldAnimate = true;
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this.viewer.clock.multiplier = 100;
        if (this.viewer.timeline) {
            this.viewer.timeline.zoomTo(start, stop);
        }
        this.pathEntity = this.viewer.entities.add({
            position: positionProperty,
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
            model: this.params.model,
            label: this.params.label,
            path: new Cesium.PathGraphics({
                show: true,
                width: 3,
                leadTime: 0,
                trailTime: 3600,
                material: Cesium.Color.fromRandom(),
                ...this.params.style
            })
        });
        this.flyCylinder = new FlyCylinder(this.viewer, positionProperty);
    }
    /**
     * 移除动态模型
     */
    remove() {
        this.pathPointsDataSource.entities.removeAll();
        this.viewer.dataSources.remove(this.pathPointsDataSource);
        this.pathEntity && this.viewer.entities.remove(this.pathEntity);
        this.flyCylinder && this.flyCylinder.remove();
        this.flyPathBuffer && this.viewer.entities.remove(this.flyPathBuffer);
    }
}
export { FlyPath };
