import { Cesium } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';
import { JPGExport } from './Export/JPGExport';
import { getMostDetailedHeight } from './getMostDetailedHeight';
import { getTerrainMostDetailedHeight } from './getTerrainMostDetailedHeight';
import { FlyToWorkspace } from './FlyToWorkspace/index';
import { WeatherEffect } from './WeatherEffect/index';
const SceneUtils = {
    // 全屏
    fullScreen() {
        Cesium.Fullscreen.requestFullscreen(document.body);
    },
    // 全球视图
    globalView() {
        const viewer = getMainViewer();
        viewer.camera.flyHome(1);
    },
    // 正北方向
    trueNorth() {
        const viewer = getMainViewer();
        // 相机的经纬度
        let camPos = Cesium.Cartographic.fromCartesian(viewer.camera.position, Cesium.Ellipsoid.WGS84, new Cesium.Cartographic());
        // 视野中心点
        let result = viewer.scene.pickPosition(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
        let newResult = Cesium.Cartographic.fromCartesian(result, Cesium.Ellipsoid.WGS84, new Cesium.Cartographic());
        // 相机高度更换为视野高度
        newResult.height = camPos.height;
        let dest = Cesium.Cartographic.toCartesian(newResult, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3());
        viewer.camera.setView({
            destination: dest,
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                pitch: viewer.camera.pitch, // default value (looking down) 上下倾斜角度
                roll: viewer.camera.roll // default value 左右倾斜角度
            }
        });
    },
    // 垂直视角
    verticalView() {
        const viewer = getMainViewer();
        // 相机的经纬度
        let camPos = Cesium.Cartographic.fromCartesian(viewer.camera.position, Cesium.Ellipsoid.WGS84, new Cesium.Cartographic());
        // 视野中心点
        let result = viewer.scene.pickPosition(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
        let newResult = Cesium.Cartographic.fromCartesian(result, Cesium.Ellipsoid.WGS84, new Cesium.Cartographic());
        // 相机高度更换为视野高度
        newResult.height = camPos.height;
        let dest = Cesium.Cartographic.toCartesian(newResult, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3());
        viewer.camera.setView({
            destination: dest,
            orientation: {
                // 指向
                heading: viewer.camera.heading,
                // 视角
                pitch: Cesium.Math.toRadians(-90),
                roll: viewer.camera.roll
            }
        });
    },
    // 锁定垂直视角
    lockVerticalView() {
        const viewer = getMainViewer();
        let flag = viewer.scene.screenSpaceCameraController.enableTilt;
        if (flag) {
            this.verticalView(); // 设置垂直视角
            viewer.scene.screenSpaceCameraController.enableTilt = false;
        }
        else {
            viewer.scene.screenSpaceCameraController.enableTilt = true; // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。
        }
    },
    // 帮助文档
    openPDF() {
        window.open('_blank').location.href = '用户手册.pdf';
    },
    // 屏幕截图
    viewerCapture(type = 'jpg', imgName = 'scene.png', waterMarkText = '') {
        if (type === 'jpg') {
            JPGExport('MapContainer', imgName, waterMarkText);
        }
        // console.log(type);
        //
        // const viewer = getMainViewer();
        // let canvas = viewer.scene.canvas;
        // let base64url = canvas.toDataURL('image/png');
        // let binStr = atob(base64url.split(',')[1]);
        // let len = binStr.length;
        // let arr = new Uint8Array(len);
        // for (let i = 0; i < len; i++) {
        //     arr[i] = binStr.charCodeAt(i);
        // }
        //
        // let triggerDownload = document.createElement('a');
        // triggerDownload.download = imgName;
        // triggerDownload.href = URL.createObjectURL(new Blob([arr]));
        // triggerDownload.click();
    },
    viewerFlyToLonLat(lon, lat, height = 200000) {
        return new Promise((resolve) => {
            getMainViewer().camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
                complete: () => {
                    resolve(true);
                }
            });
        });
    },
    runFunByName(funcName) {
        if (funcName === 'fullScreen') {
            this.fullScreen(); // 全屏
        }
        else if (funcName === 'trueNorth') {
            this.trueNorth(); // 正北方向
        }
        else if (funcName === 'verticalView') {
            this.verticalView(); // 垂直视角
        }
        else if (funcName === 'lockVerticalView') {
            this.lockVerticalView(); // 锁定垂直视角
        }
        else if (funcName === 'surroundBrowse') {
            // this.surroundBrowse(); // 环绕浏览
        }
        else if (funcName === 'surfaceTransparent') {
            // this.surfaceTransparent(); // 地表透明度
        }
        else if (funcName === 'openPDF') {
            this.openPDF(); // 帮助文档
        }
        else if (funcName === 'viewerCapture') {
            this.viewerCapture(''); // 屏幕截图
        }
        else if (funcName === 'resetMap') {
        }
        else {
            console.log('未识别的操作');
        }
    }
};
export { SceneUtils, FlyToWorkspace, WeatherEffect, getMostDetailedHeight, getTerrainMostDetailedHeight };
