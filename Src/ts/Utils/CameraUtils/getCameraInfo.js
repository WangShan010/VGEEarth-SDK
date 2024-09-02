/****************************************************************************
 名称：获取摄像机的信息，【xyz坐标】、【俯仰角、偏航角、翻滚角】

 最后修改日期：2022-03-19
 ****************************************************************************/
import { Cesium } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';
// 获取镜头高度
function getCameraInfo() {
    const viewer = getMainViewer();
    let { position, heading, pitch, roll } = viewer.camera;
    let cartographic = Cesium.Cartographic.fromCartesian(position);
    cartographic = {
        longitude: Math.floor(Cesium.Math.toDegrees(cartographic.longitude) * 100000) / 100000,
        latitude: Math.floor(Cesium.Math.toDegrees(cartographic.latitude) * 100000) / 100000,
        height: Math.floor(cartographic.height * 100000) / 100000
    };
    return { destination: position, cartographic, orientation: { heading, pitch, roll } };
}
export { getCameraInfo };
