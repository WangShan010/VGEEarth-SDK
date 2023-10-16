import { ListenItem } from './ListenItem';
import { ScopeType } from './ScopeType';

interface EventImpl {
    /**
     * 监听的回调函数集合
     */
    listenCallbacks: ListenItem[],

    /**
     * 添加事件
     * @param listenType    事件触发类型
     * @param callback      事件回调
     * @param scope         事件触发范围
     */
    addEventListener(listenType: number, scope: ScopeType, callback: Function): boolean


    /**
     * 触发事件
     * @param listenType    事件触发类型
     * @param scope         触发范围
     * @param funcParam
     */
    raiseEvent(listenType: number, scope: ScopeType, funcParam: any): void


    /**
     * 移除事件
     * @param funcParam
     */
    removeEventListener(funcParam: any): boolean
}


export { EventImpl };
