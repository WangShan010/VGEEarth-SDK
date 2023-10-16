/****************************************************************************
 名称：初始化 2D视图 的状态，默认情况下是关闭二三维联动的

 最后修改日期：2022-03-25
 ****************************************************************************/
import { Viewer } from 'cesium';

function initViewer2DStata(viewer2D: Viewer) {
    let dom = document.getElementById('viewer2DDom');
    if (dom) {
        dom.style.display = 'none';
    }
    // 由于二维视图跟随三维视图，因此我们禁用任何
    // 摄影机在二维视图上的移动
    viewer2D.scene.screenSpaceCameraController.enableRotate = false;
    viewer2D.scene.screenSpaceCameraController.enableTranslate = false;
    viewer2D.scene.screenSpaceCameraController.enableZoom = false;
    viewer2D.scene.screenSpaceCameraController.enableTilt = false;
    viewer2D.scene.screenSpaceCameraController.enableLook = false;
}

export { initViewer2DStata };
