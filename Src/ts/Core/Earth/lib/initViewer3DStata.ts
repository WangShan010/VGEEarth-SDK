/****************************************************************************
 名称：初始化 3D视图 的状态，还未想好实现方式

 最后修改日期：2022-03-25
 ****************************************************************************/
import { Viewer } from 'cesium';

function initViewer3DStata(viewer: Viewer) {
    // @ts-ignore
    viewer.scene.msaaSamples = 8;
}

export { initViewer3DStata };
