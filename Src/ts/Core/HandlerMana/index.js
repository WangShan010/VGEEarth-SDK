import { Cesium } from '../Impl/Declare';
import { getMainViewer } from '../Earth/lib/getMainViewer';
/**
 *  名称：事件句柄控制器
 *  设想：设计思路，运行时每个viewer对象存在两个handle，一个是一直运行的 runningHandle,一个是运行时的 runtimeHandle，
 *  运行时 runtimeHandle 执行时会让一直运行的 runningHandle 暂时停止运行，当检测到运行时 runtimeHandle 销毁后，
 *  一直运行的 runningHandle 继续运行。一个运行时 runtimeHandle 会把前一个正在运行的运行时 runtimeHandler 销毁，销毁时会
 *  执行提前绑定好的errCallback函数，并返回绑定好的errCallbackScope回调参数
 *  这个场景主要试用于系统全局的默认功能，注册事件后一定要主动销毁，没有被动销毁，不然程序会报错
 *
 *  当前进度：还未实现
 *
 *
 *  最后修改日期：2022-03-10
 */
const HandlerMana = {
    getHandle(viewer, errorCallback) {
        viewer = viewer || getMainViewer();
        return {
            handler: new Cesium.ScreenSpaceEventHandler(viewer.canvas),
            errCallback: errorCallback || function () {
                console.log('默认事件监听器，被重置！');
            }
        };
    }
};
export { HandlerMana };
