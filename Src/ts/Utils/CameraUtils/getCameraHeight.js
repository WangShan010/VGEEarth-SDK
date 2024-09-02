import { Cesium } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';
// 获取镜头距离地面的高度
function getCameraHeight(viewer) {
    viewer = viewer || getMainViewer();
    let scene = viewer.scene;
    let width = scene.canvas.clientWidth;
    let height = scene.canvas.clientHeight;
    let left = scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
    let right = scene.camera.getPickRay(new Cesium.Cartesian2(1 + (width / 2) | 0, height - 1));
    let globe = scene.globe;
    let leftPosition;
    let rightPosition;
    if (left && right && Cesium.defined(left) && Cesium.defined(right)) {
        leftPosition = globe.pick(left, scene);
        rightPosition = globe.pick(right, scene);
    }
    if (!Cesium.defined(leftPosition) || !Cesium.defined(rightPosition)) {
        return NaN;
    }
    let leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
    let rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);
    let geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(leftCartographic, rightCartographic);
    let pixelDistance = geodesic.surfaceDistance;
    return pixelDistance * 100;
}
export { getCameraHeight };
