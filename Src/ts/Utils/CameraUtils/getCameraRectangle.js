/****************************************************************************
 名称：获取相机的范围矩形，以一个 Rectangle 对象返回

 最后修改日期：2022-03-19
 ****************************************************************************/
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';
function getCameraRectangle(type = 'Radian') {
    let r0 = getMainViewer().scene.camera.computeViewRectangle();
    let r1 = { west: 0, south: 0, east: 0, north: 0 };
    if (r0) {
        if (type === 'Degree') {
            r1.west = (180 / Math.PI) * r0.west;
            r1.south = (180 / Math.PI) * r0.south;
            r1.east = (180 / Math.PI) * r0.east;
            r1.north = (180 / Math.PI) * r0.north;
        }
        else {
            r1 = JSON.parse(JSON.stringify(r0));
        }
    }
    return r1;
}
export { getCameraRectangle };
