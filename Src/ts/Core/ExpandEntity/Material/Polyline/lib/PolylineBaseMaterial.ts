import { Cesium } from '../../../../Impl/Declare';

/**
 * 线材质基类
 */
abstract class PolylineBaseMaterial {
    protected _definitionChanged = new Cesium.Event();

    get definitionChanged() {
        return this._definitionChanged;
    }

    get isConstant() {
        return false;
    }

    abstract getType(): string;

    abstract getValue(time: number, result: any): any;

    abstract equals(other: any): boolean;

    abstract init(): void;
}


export { PolylineBaseMaterial };