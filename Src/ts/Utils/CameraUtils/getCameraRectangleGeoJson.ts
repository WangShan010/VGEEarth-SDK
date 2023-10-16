import { getCameraRectanglePoint } from './getCameraRectanglePoint';
import { Viewer } from 'cesium';
import { getScreenCenterPoint } from './getScreenCenterPoint';

/****************************************************************************
 名称：获取当前屏幕的下【可见场景】的【矩形范围】，并以 GeoJson 格式返回
 【多边形矩形】、【面积】

 最后修改日期：2022-03-19
 ****************************************************************************/
function getCameraRectangleGeoJson(viewer: Viewer) {
    const turf = window.turf;
    let points = getCameraRectanglePoint(viewer);
    let geoJson;
    if (points.length < 4) {
        let b = getScreenCenterPoint();
        geoJson = turf.buffer(turf.point([b.longitude, b.latitude]), 2500);
    } else {
        geoJson = turf.polygon([points]);
    }

    // 矩形的 geoJson
    let rectGeoJson = turf.bboxPolygon(turf.bbox(geoJson));
    // 矩形的面积
    let area = turf.area(geoJson) / 100_0000 + '平方千米';

    return {rectGeoJson, geoJson, area};
}


export { getCameraRectangleGeoJson };
