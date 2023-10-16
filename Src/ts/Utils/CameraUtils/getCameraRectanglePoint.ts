/****************************************************************************
 名称：获取当前屏幕的下【可见场景】的【矩形范围】

 最后修改日期：2022-03-19
 ****************************************************************************/

import { Viewer } from 'cesium';
import { Cesium } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';

function getCameraRectanglePoint(viewer: Viewer) {
    if (!viewer) viewer = getMainViewer();
    // 取屏幕的点，左上角为 x：0，y：0，左下角为：x：0，y：viewer.scene.canvas.height
    let width = viewer.scene.canvas.width;
    let height = viewer.scene.canvas.height;
    let screenPoint = [
        {x: 10, y: 10},
        {x: 10, y: height / 10},
        {x: 10, y: height / 10 * 2},
        {x: 10, y: height / 10 * 3},
        {x: 10, y: height / 10 * 4},
        {x: 10, y: height / 10 * 5},
        {x: 10, y: height / 10 * 6},
        {x: 10, y: height / 10 * 7},
        {x: 10, y: height / 10 * 8},
        {x: 10, y: height / 10 * 9},
        {x: 10, y: height - 10},
        {x: width / 10, y: height - 10},
        {x: width / 10 * 2, y: height - 10},
        {x: width / 10 * 3, y: height - 10},
        {x: width / 10 * 4, y: height - 10},
        {x: width / 10 * 5, y: height - 10},
        {x: width / 10 * 6, y: height - 10},
        {x: width / 10 * 7, y: height - 10},
        {x: width / 10 * 8, y: height - 10},
        {x: width / 10 * 9, y: height - 10},
        {x: width - 10, y: height - 10},
        {x: width - 10, y: height / 10 * 9},
        {x: width - 10, y: height / 10 * 8},
        {x: width - 10, y: height / 10 * 7},
        {x: width - 10, y: height / 10 * 6},
        {x: width - 10, y: height / 10 * 5},
        {x: width - 10, y: height / 10 * 4},
        {x: width - 10, y: height / 10 * 3},
        {x: width - 10, y: height / 10 * 2},
        {x: width - 10, y: height / 10},
        {x: width - 10, y: 10},
        {x: width / 10 * 9, y: 10},
        {x: width / 10 * 8, y: 10},
        {x: width / 10 * 7, y: 10},
        {x: width / 10 * 6, y: 10},
        {x: width / 10 * 5, y: 10},
        {x: width / 10 * 4, y: 10},
        {x: width / 10 * 3, y: 10},
        {x: width / 10 * 2, y: 10},
        {x: width / 10, y: 10}
    ];

    let points: number[][] = [];
    screenPoint.forEach(p => {
        let pick = new Cesium.Cartesian2(p.x, p.y);
        let ray = viewer.camera.getPickRay(pick);
        if (ray) {
            let cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                points.push(point);
            }
        }
    });

    points.length > 0 && points.push(points[0]);

    return points;
}


export { getCameraRectanglePoint };
