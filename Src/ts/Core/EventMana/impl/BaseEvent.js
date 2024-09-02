class BaseEvent {
    constructor() {
        this.listenCallbacks = [];
    }
    addEventListener(listenType, scope, callback) {
        let item = this.listenCallbacks.find(item => {
            return item.listenType === listenType && item.scope === scope && item.callback === callback;
        });
        if (!item) {
            this.listenCallbacks.push({ listenType, callback, scope });
            return true;
        }
        else {
            return false;
        }
    }
    raiseEvent(listenType, scope, funcParam) {
        this.listenCallbacks.forEach(item => {
            if (item.listenType === listenType && item.scope === scope && typeof item.callback === 'function') {
                item.callback(funcParam);
            }
        });
    }
    removeEventListener(callback) {
        let func = this.listenCallbacks.find(item => item.callback === callback);
        if (func) {
            this.listenCallbacks = this.listenCallbacks.filter(item => item.callback !== callback);
            return true;
        }
        else {
            return false;
        }
    }
}
export { BaseEvent };
