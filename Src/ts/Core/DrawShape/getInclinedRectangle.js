import { Cesium } from '../Impl/Declare';
import { GISMathUtils } from '../../Utils/GISMathUtils/index';
/**
 * 画斜矩形的点位计算辅助函数，根据A、B两点和 E（C-D线的中心点）偏移点，计算出 C、D两点
 * 假设一个矩形由 A-B-C-D-A 坐标连接成闭合矩形
 * @param start A点
 * @param end   B点
 * @param offset E点
 * @param cartesian1 C点
 * @param cartesian2 D点
 */
function getInclinedRectangle(start, end, offset, cartesian1, cartesian2) {
    let cartographicStart = Cesium.Cartographic.fromCartesian(start);
    let cartographicEnd = Cesium.Cartographic.fromCartesian(end);
    let cartographicOffset = Cesium.Cartographic.fromCartesian(offset);
    let cx = (cartographicStart.longitude + cartographicEnd.longitude) / 2.0;
    let cy = (cartographicStart.latitude + cartographicEnd.latitude) / 2.0;
    let startX = GISMathUtils.lon_to_meter(cartographicStart.longitude - cx, cartographicStart.latitude);
    let startY = GISMathUtils.lat_to_meter(cartographicStart.latitude - cy);
    let endX = GISMathUtils.lon_to_meter(cartographicEnd.longitude - cx, cartographicEnd.latitude);
    let endY = GISMathUtils.lat_to_meter(cartographicEnd.latitude - cy);
    let offsetX = GISMathUtils.lon_to_meter(cartographicOffset.longitude - cx, cartographicOffset.latitude);
    let offsetY = GISMathUtils.lat_to_meter(cartographicOffset.latitude - cy);
    let linePoint = [];
    GISMathUtils.pointProjectLine(offsetX, offsetY, startX, startY, endX, endY, linePoint);
    // 求垂足和偏移点之间的距离
    let distance = GISMathUtils.TwoPointsDistance(offsetX, offsetY, linePoint[0], linePoint[1]);
    let angle = GISMathUtils.vecAngle(linePoint[0], linePoint[1], offsetX, offsetY);
    // console.log(angle * 180 /Math.PI);
    let point1 = GISMathUtils.polarPoint(startX, startY, angle, distance);
    let point2 = GISMathUtils.polarPoint(endX, endY, angle, distance);
    // console.log("=============================");
    // console.log([startX,startY] );
    // console.log([endX,endY]);
    // console.log(point2);
    // console.log(point1);
    let point1Lat = GISMathUtils.meter_to_lat(point1[1]) + cy;
    let point1Lon = GISMathUtils.meter_to_long(point1[0], point1Lat) + cx;
    let point2Lat = GISMathUtils.meter_to_lat(point2[1]) + cy;
    let point2Lon = GISMathUtils.meter_to_long(point2[0], point2Lat) + cx;
    // console.log("**************");
    // console.log([cartographicStart.longitude * 180 /Math.PI,cartographicStart.latitude * 180 /Math.PI] );
    // console.log([cartographicEnd.longitude * 180 /Math.PI,cartographicEnd.latitude * 180 /Math.PI]);
    // console.log([point2Lon* 180 /Math.PI,point2Lat* 180 /Math.PI]);
    // console.log([point1Lon* 180 /Math.PI,point1Lat* 180 /Math.PI]);
    cartographicStart.longitude = point1Lon;
    cartographicStart.latitude = point1Lat;
    cartographicEnd.longitude = point2Lon;
    cartographicEnd.latitude = point2Lat;
    Cesium.Cartographic.toCartesian(cartographicStart, Cesium.Ellipsoid.WGS84, cartesian2);
    Cesium.Cartographic.toCartesian(cartographicEnd, Cesium.Ellipsoid.WGS84, cartesian1);
}
export { getInclinedRectangle };
