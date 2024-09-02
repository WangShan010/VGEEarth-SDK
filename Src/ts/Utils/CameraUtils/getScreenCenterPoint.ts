/****************************************************************************
 名称：获取 Viewer 的视图中心点的经纬度坐标
 【多边形矩形】、【面积】

 最后修改日期：2022-03-19
 ****************************************************************************/

import { Cesium } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';

function getScreenCenterPoint() {
    const viewer = getMainViewer();
    let pick = new Cesium.Cartesian2(viewer.scene.canvas.width / 2, viewer.scene.canvas.height / 2);
    let cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);

    if (cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
        return { longitude: point[0], latitude: point[1] };
    } else {
        return null;
    }
}

export { getScreenCenterPoint };