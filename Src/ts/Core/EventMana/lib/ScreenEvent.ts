/****************************************************************************
 名称：屏幕事件管理器
 描述：这是一个高级的封装，用于统一管理 鼠标点击、鼠标移动 等事件

 最后修改日期：2021-10-29
 ****************************************************************************/


import { BaseEvent } from '../impl/BaseEvent';

/**
 *  名称：屏幕事件管理器
 *  描述：这是一个高级的封装，用于统一管理 鼠标点击、鼠标移动 等事件
 *
 *  最后修改日期：2021-10-29
 */
class ScreenEvent extends BaseEvent {
    constructor() {
        super();
    }
}

export { ScreenEvent };
