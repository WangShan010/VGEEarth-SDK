import { Cartesian3 } from 'cesium';

interface IDomPoint {
    init(): void;

    remove(): void;

    getPosition(): Cartesian3;

    _addDom(): void;

    _addPostRender(): void;

    _postRender(): void;
}

type FloatMarkerStyleType = {
    image: string; //图标
    lineHeight: number; //线高
    bounceHeight: number; //高度
    increment: number;//增量
}

export { IDomPoint, FloatMarkerStyleType };