import {
    CameraEventType,
    ConfigEventType,
    DataEventType,
    ScreenSpaceEventType,
    ViewerEventType
} from './impl/ListenType';
import { ScopeType } from './impl/ScopeType';
import { ConfigEvent } from './lib/ConfigEvent';
import { ScreenEvent } from './lib/ScreenEvent';
import { SourceEvent } from './lib/SourceEvent';
import { ViewerEvent } from './lib/ViewerEvent';

/**
 *  名称：封装了一个事件管理器
 *
 *  描述：
 *  ① VGEarth SDK 是在 Cesium 原生接口上做整合了一些常用的函数、工具箱，允许用户通过这些 API，
 *  操作地球，同时理论上用户完全可用越过 VGEarth API 对 Cesium 进行一些原生接口的操作。
 *  ② 所以就需要专门编写一个事件管理器，用于管理视图变化、鼠标事件、资源数据载入移除、配置参数发生更改等事件。
 *  ③ 例如：配置参数发生改变后，将更新资源树状图控件
 *
 *  最后修改日期：2022-1-29
 */
const EventMana = {
    ScopeType: ScopeType,
    ListenType: {
        ConfigEventType,
        ViewerEventType,
        ScreenSpaceEventType,
        CameraEventType,
        DataEventType
    },
    configEvent: new ConfigEvent(),
    screenEvent: new ScreenEvent(),
    sourceEvent: new SourceEvent(),
    viewerEvent: new ViewerEvent()
};

export { EventMana };