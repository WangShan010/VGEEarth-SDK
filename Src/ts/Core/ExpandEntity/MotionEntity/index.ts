import { Cesium } from '../../Impl/Declare';
import { Entity } from 'cesium';

/**
 * 实体运动框架
 * @param entity    实体（模型）
 * @param geoLine   运动路线的 GeoJson
 * @param speed     运动速度
 * @constructor
 */
function MotionEntity(entity: Entity, geoLine: number, speed: number) {
    // 设定模拟时间的界限
    let start = Cesium.JulianDate.fromDate(new Date());

    let length = window.turf.length(geoLine, {units: 'meters'});  // 本条路线总长度
    let completionTime = length / speed;                        // 跑完全程需要，多少秒

    // 让实体循环运动（计算实体位置属性），使用我们计算的位置，实现物体进行动态展示功能
    entity.position = new Cesium.CallbackProperty(function (time: any) {
        // 沿着路径，相对于起点的行程距离
        let passTime = time.secondsOfDay - start.secondsOfDay;
        if (passTime < 0) return;
        let progressLine = speed * (passTime % completionTime);
        // 当前位置
        let along = window.turf.along(geoLine, progressLine, {units: 'meters'});
        let LonLat = along.geometry.coordinates;
        return Cesium.Cartesian3.fromDegrees(LonLat[0], LonLat[1], 400);
    });
}


export { MotionEntity };
