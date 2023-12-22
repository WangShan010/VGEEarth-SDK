import { EventImpl } from './EventImpl';
import { ListenItem } from './ListenItem';
import { ScopeType } from './ScopeType';

import { CameraEventType, ConfigEventType, DataEventType, ScreenSpaceEventType, ViewerEventType } from './ListenType';

class BaseEvent implements EventImpl {
    listenCallbacks: ListenItem[];

    constructor() {
        this.listenCallbacks = [];
    }

    addEventListener(
        listenType: ConfigEventType | ViewerEventType | ScreenSpaceEventType | CameraEventType | DataEventType,
        scope: ScopeType, callback: Function): boolean {
        let item = this.listenCallbacks.find(item => {
            return item.listenType === listenType && item.scope === scope && item.callback === callback;
        });

        if (!item) {
            this.listenCallbacks.push({listenType, callback, scope});
            return true;
        } else {
            return false;
        }
    }

    raiseEvent(listenType: number, scope: ScopeType, funcParam: any): void {
        this.listenCallbacks.forEach(item => {
            if (item.listenType === listenType && item.scope === scope && typeof item.callback === 'function') {
                item.callback(funcParam);
            }
        });
    }

    removeEventListener(callback: Function): boolean {
        let func = this.listenCallbacks.find(item => item.callback === callback);
        if (func) {
            this.listenCallbacks = this.listenCallbacks.filter(item => item.callback !== callback);
            return true;
        } else {
            return false;
        }
    }


    removeAllListener(){
        this.listenCallbacks = [];
    }
}

export { BaseEvent };
