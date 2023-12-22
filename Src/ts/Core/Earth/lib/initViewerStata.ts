/****************************************************************************
 名称：初始化 Viewer视图 的状态，去除商标，设置初始相机姿态等

 最后修改日期：2022-03-25
 ****************************************************************************/


import { Cesium } from '../../Impl/Declare';
import { ConfigTool } from '../../Config/ConfigTool';
import { Viewer } from 'cesium';


// 隐藏 Cesium icon商标，飞到初始位置
function initViewerStata(viewer: Viewer) {
    let APPConfig = ConfigTool.config;

    viewer.scene.skyAtmosphere.show = false;
    viewer.scene.globe.show = false;

    viewer.scene.globe.baseColor = Cesium.Color.BLACK; // 没有影像图层时地球的底色

    // viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测

    // 去除Cesium版权信息
    // @ts-ignore
    viewer._cesiumWidget._creditContainer.style.display = 'none';

    // home定位到中国范围
    // @ts-ignore
    viewer.camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Cartographic(
        APPConfig.homeView.longitude,
        APPConfig.homeView.latitude,
        APPConfig.homeView.height
    );

    // 设置相机位置在中国位置
    viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            APPConfig.homeView.longitude,
            APPConfig.homeView.latitude,
            APPConfig.homeView.height
        ),
        orientation: {
            heading: APPConfig.homeView.headingRadians,
            pitch: APPConfig.homeView.pitchRadians,
            roll: APPConfig.homeView.rollRadians
        }
    });

    // 是否开启抗锯齿，开启抗锯齿会导致文字模糊
    // @ts-ignore
    viewer.scene.postProcessStages.fxaa.enabled = false;

    // setTimeout(function () {
    //   // 打开系统页面三秒后，视角飞到初始位置
    //   viewer.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(
    //       APPConfig.homeView.lon,
    //       APPConfig.homeView.lat,
    //       APPConfig.homeView.height
    //     )
    //   });
    // }, 3500);
}

export { initViewerStata };
