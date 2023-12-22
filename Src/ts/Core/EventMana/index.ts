/**
 * Cesium 原生API 提供的事件管理机制，但是这个机制不够灵活，所以 VGEarth SDK 拓展了一个事件管理器。
 *
 * 例如：我想监听何时有新数据被添加到了配置文件控制器中，原生API提供的事件管理机制是无法实现的，但 VGEarth SDK 提供的事件管理器可以实现。
 *
 * 提供了以下四类全局的事件类型
 *
 * ① 屏幕事件：【左键单击】、【左键双击】、【左键按下】、【左键抬起】、【右键单击】、【右键双击】、【右键按下】、【右键抬起】、【鼠标移动】、【鼠标移入】、【鼠标移出】、【鼠标滚轮】
 *
 * ② 相机事件：【左拖动】、【右拖动】、【滚轮缩放】、【视角调整】
 *
 * ③ 配置事件：【向配置文件控制器添加数据资源】
 *
 * ④ 视图事件：【创建】、【隐藏】、【显示】、【销毁】
 *
 * ⑤ 数据事件：【添加】、【更新】、【移除】
 *
 *
 * @remarks
 * 命名空间：window.VGEEarth.EventMana
 *
 *
 * @packageDocumentation
 */


export {
    ConfigEventType,
    ViewerEventType,
    ScreenSpaceEventType,
    CameraEventType,
    DataEventType
} from './impl/ListenType';

export { BaseEvent } from './impl/BaseEvent';
export { EventImpl } from './impl/EventImpl';
export { ListenItem } from './impl/ListenItem';
export * as ListenType from './impl/ListenType';
export { ScopeType } from './impl/ScopeType';
export { ConfigEvent } from './lib/ConfigEvent';
export { ScreenEvent } from './lib/ScreenEvent';
export { SourceEvent } from './lib/SourceEvent';
export { ViewerEvent } from './lib/ViewerEvent';
export { EventMana } from './EventMana';


