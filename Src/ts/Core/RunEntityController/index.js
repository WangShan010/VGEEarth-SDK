import { Cesium } from '../Impl/Declare';
import * as Polyline from '../ExpandEntity/Material/Polyline/index';
class RunEntityController {
    /**
     * 运动中的实体对象
     * @param viewer 视图对象
     * @param {Object} entity 实体对象
     * @param lineGeoJson 路径线的 geoJson
     * @param speed   物体运动速度，米/秒
     * @param loop    是否循环
     * @param clampToGround
     */
    constructor(viewer, entity, lineGeoJson, speed, loop = true, clampToGround = true) {
        this.playEndFunc = null;
        this.viewer = viewer;
        this.entity = entity;
        this.lineGeoJson = lineGeoJson;
        this.speed = speed;
        this.loop = loop;
        this.clampToGround = clampToGround;
        this.rawPosition = entity.position;
        this.pathDataSources = new Cesium.CustomDataSource();
        this.playing = true;
        this.playEndFunc = null;
    }
    play(playEndFunc = null) {
        if (typeof playEndFunc === 'function') {
            this.playEndFunc = playEndFunc;
        }
        // 设定模拟时间的界限
        const start = Cesium.JulianDate.fromDate(new Date());
        const length = window.turf.length(this.lineGeoJson, { units: 'meters' }); // 本条路线总长度
        let previousPosition = [];
        // 让实体循环运动（计算实体位置属性），使用我们计算的位置，实现物体进行动态展示功能
        // @ts-ignore
        this.entity.position = new Cesium.CallbackProperty((time, result) => {
            if (!this.playing && previousPosition.length >= 2) {
                return Cesium.Cartesian3.fromDegrees(...previousPosition);
            }
            const completionTime = length / this.speed; // 跑完全程需要，多少秒
            // 沿着路径，相对于起点的行程距离
            let formStartDistance = 0;
            if (this.loop) {
                formStartDistance = this.speed * ((time.secondsOfDay - start.secondsOfDay) % completionTime);
            }
            else {
                formStartDistance = this.speed * ((time.secondsOfDay - start.secondsOfDay));
                if (formStartDistance > length) {
                    formStartDistance = length;
                    this.playing = false;
                }
            }
            if (formStartDistance >= length) {
                if (this.playEndFunc) {
                    this.playEndFunc();
                }
            }
            formStartDistance = formStartDistance < 0 ? 0 : formStartDistance;
            // 通过行程距离，计算当前位置
            const along = window.turf.along(this.lineGeoJson, formStartDistance, { units: 'meters' });
            let lastPosition = [];
            let passDistance = 0;
            let startPointFromPass = 0;
            let endPointFromPass = 0;
            let height = 0;
            for (let i = 0; i < this.lineGeoJson.geometry.coordinates.length; i++) {
                let endCoordinates = this.lineGeoJson.geometry.coordinates[i];
                if (i === 0) {
                    lastPosition = endCoordinates;
                    passDistance = 0;
                    startPointFromPass = 0;
                    endPointFromPass = 0;
                    height = 0;
                    continue;
                }
                let currentLineLength = window.turf.distance(window.turf.point(lastPosition), window.turf.point(endCoordinates), { units: 'meters' });
                startPointFromPass = passDistance;
                endPointFromPass = passDistance + currentLineLength;
                if (passDistance > formStartDistance) {
                    height = endCoordinates[2] + (endCoordinates[2] - lastPosition[2]) / currentLineLength * (formStartDistance - startPointFromPass);
                    height = height ? height : 0;
                    break;
                }
                passDistance += currentLineLength;
                lastPosition = endCoordinates;
            }
            // 当前位置的高程
            // const height = along.geometry.coordinates[2];
            const LonLat = along.geometry.coordinates;
            const position = Cesium.Cartesian3.fromDegrees(LonLat[0], LonLat[1], height || 0);
            if (previousPosition.length > 0 && (LonLat[0] !== previousPosition[0] || LonLat[1] !== previousPosition[1])) {
                let point1 = window.turf.point([LonLat[0], LonLat[1]]);
                let point2 = window.turf.point([previousPosition[0], previousPosition[1]]);
                let bearing = window.turf.bearing(point2, point1);
                if (bearing < 0) {
                    bearing = bearing + 360;
                }
                let h = Cesium.Math.toRadians(-90 + bearing);
                this.entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(h, 0, 0));
            }
            previousPosition = [LonLat[0], LonLat[1], height];
            // console.log('position', position);
            if (this.clampToGround) {
                return this.viewer.scene.clampToHeight(position, [this.entity]);
            }
            else {
                return position;
            }
        });
    }
    addPath() {
        let pathEntity = new Cesium.Entity({
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(this.lineGeoJson.geometry.coordinates.map((item) => [item[0], item[1]]).flat()),
                width: 12,
                material: new Polyline.PolylineLinkPulseMaterial({
                    color: Cesium.Color.AQUA,
                    duration: 5000
                }),
                clampToGround: true
            }
        });
        this.pathDataSources.entities.add(pathEntity);
        this.viewer.dataSources.add(this.pathDataSources);
    }
    removePath() {
        this.pathDataSources.entities.removeAll();
        this.viewer.dataSources.remove(this.pathDataSources);
    }
    destroy() {
        this.entity.position = this.rawPosition;
        this.removePath();
        this.playEndFunc = null;
    }
}
export { RunEntityController };
