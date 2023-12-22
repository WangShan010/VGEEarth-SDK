import { CoordinateType } from './CoordinateType';

interface DrawShapeOptions {
    position?: any,
    normal?: any,
    dimensions?: any,
    coordinateType?: CoordinateType | null | undefined,
    endCallback?: Function | null,
    moveCallback?: Function | null,
    errCallback?: Function | null
}

export { DrawShapeOptions };
