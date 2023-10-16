import { getMainViewer } from '../Earth/lib/getMainViewer';
import { Cesium } from '../Impl/Declare';
import { Cartesian3 } from 'cesium';

/**
 * 画正矩形的点位计算辅助函数，根据A、C两点，计算出 B、D两点
 * 假设一个矩形由 A-B-C-D-A 坐标连接成闭合矩形
 * @param start A点 笛卡尔直角坐标系
 * @param end   B点 笛卡尔直角坐标系
 */
function getRectanglePoint(start: Cartesian3, end: Cartesian3) {
    // start 的经纬度
    let cartographic1 = getMainViewer().scene.globe.ellipsoid.cartesianToCartographic(start);
    let lon1 = Cesium.Math.toDegrees(cartographic1.longitude); // 经度
    let lat1 = Cesium.Math.toDegrees(cartographic1.latitude); // 纬度

    // end 的经纬度
    let cartographic2 = getMainViewer().scene.globe.ellipsoid.cartesianToCartographic(
        end);
    let lon2 = Cesium.Math.toDegrees(cartographic2.longitude); // 经度
    let lat2 = Cesium.Math.toDegrees(cartographic2.latitude); // 纬度

    let minLon = Math.min(lon1, lon2),
        maxLon = Math.max(lon1, lon2),
        minLat = Math.min(lat1, lat2),
        maxLat = Math.max(lat1, lat2);

    let cartesianA = Cesium.Cartesian3.fromDegrees(minLon, maxLat);
    let cartesianB = Cesium.Cartesian3.fromDegrees(maxLon, maxLat);
    let cartesianC = Cesium.Cartesian3.fromDegrees(maxLon, minLat);
    let cartesianD = Cesium.Cartesian3.fromDegrees(minLon, minLat);

    // 四点连成的闭合图形 笛卡尔直角坐标系
    return [cartesianA, cartesianB, cartesianC, cartesianD, cartesianA];
}


export { getRectanglePoint };