import { ScopeType } from './ScopeType';

interface ListenItem {
    listenType: number,
    callback: Function,
    scope: ScopeType
}

export { ListenItem };
