/****************************************************************************
 名称：初始化坐标与高度的监听

 最后修改日期：2022-03-25
 ****************************************************************************/
import { Cesium } from '../../Impl/Declare';
import { getMainViewer } from './getMainViewer';
import { getTerrainMostDetailedHeight } from '../../../Utils/SceneUtils/getTerrainMostDetailedHeight';
import { getCameraHeight } from '../../../Utils/CameraUtils/getCameraHeight';
import { getCameraInfo } from '../../../Utils/CameraUtils/getCameraInfo';
function initMonitorCoordinates(viewer, moveFun) {
    !viewer && (viewer = getMainViewer());
    let canvas = viewer.scene.canvas;
    // 具体事件的实现
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let handler = new Cesium.ScreenSpaceEventHandler(canvas);
    let lon = 0;
    let lat = 0;
    let height = 0;
    let cameraHeight = 0; // 相机高程
    let onEarth = true;
    let isLoaded = true;
    let orientation = {};
    handler.setInputAction((movement) => {
        // 捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        // 读取经纬度
        if (cartesian) {
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            // 将地图坐标（弧度）转为十进制的度数
            lon = Cesium.Math.toDegrees(cartographic.longitude); // 经度
            lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
            onEarth = true;
        }
        else {
            onEarth = false;
        }
        // 存在地形数据，读取高程
        // 查询地表上的三维 xyz 坐标，用于查询三维坐标
        if (!(viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider)) {
            if (isLoaded) {
                isLoaded = false;
                getTerrainMostDetailedHeight(lon, lat).then(function (h) {
                    isLoaded = true;
                    height = h;
                });
            }
        }
        // 存在模型，读取高程
        // ...待实现
        cameraHeight = getCameraHeight(viewer) || 3000000;
        orientation = getCameraInfo().orientation;
        if (onEarth) {
            if (typeof moveFun === 'function') {
                moveFun(lon, lat, height, cameraHeight, orientation);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function () {
        cameraHeight = getCameraHeight(viewer) || 3000000; // 高程
        if (onEarth) {
            if (typeof moveFun === 'function') {
                moveFun(lon, lat, height, cameraHeight, orientation);
            }
        }
    }, Cesium.ScreenSpaceEventType.WHEEL);
}
export { initMonitorCoordinates };
