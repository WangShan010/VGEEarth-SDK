/****************************************************************************
 名称：创建指北针

 最后修改日期：2022-03-10
 ****************************************************************************/
import { ConfigTool } from '../../Config/ConfigTool';
import { Cesium } from '../../Impl/Declare';
import { getMainViewer } from './getMainViewer';
function createNavigation(viewer) {
    !viewer && (viewer = getMainViewer());
    let APPConfig = ConfigTool.config;
    let options = {
        // 默认视角位置
        defaultResetView: new Cesium.Cartographic(Cesium.Math.toRadians(APPConfig.homeView.longitude || 110), Cesium.Math.toRadians(APPConfig.homeView.latitude || 40), APPConfig.homeView.height || 0),
        defaultHeadingPitchRoll: null,
        enableCompass: true, // 启用指南针
        enableZoomControls: true, // 启用缩放控件
        enableDistanceLegend: true, // 启用距离图例
        enableCompassOuterRing: true // 启用指南针外环
    };
    // 默认视角方向
    if (APPConfig.homeView.headingRadians || APPConfig.homeView.pitchRadians || APPConfig.homeView.rollRadians) {
        options.defaultHeadingPitchRoll = new Cesium.HeadingPitchRoll(APPConfig.homeView.headingRadians || 0, APPConfig.homeView.pitchRadians || 0, APPConfig.homeView.rollRadians || 0);
    }
    viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
}
export { createNavigation };
