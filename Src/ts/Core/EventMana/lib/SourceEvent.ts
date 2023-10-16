import { BaseEvent } from '../impl/BaseEvent';

/**
 *  名称：资源变化事件管理器
 *  描述：监听资源的 载入、移除、隐藏、更改 等
 *
 *  最后修改日期：2021-10-29
 */
class SourceEvent extends BaseEvent {
    constructor() {
        super();
    }
}

export { SourceEvent };
