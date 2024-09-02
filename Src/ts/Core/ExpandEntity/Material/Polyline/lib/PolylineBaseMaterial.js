import { Cesium } from '../../../../Impl/Declare';
/**
 * 线材质基类
 */
class PolylineBaseMaterial {
    constructor() {
        this._definitionChanged = new Cesium.Event();
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    get isConstant() {
        return false;
    }
}
export { PolylineBaseMaterial };
