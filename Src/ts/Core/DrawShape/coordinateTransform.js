import { CartographicTool } from '../../Utils/CoordinateTool/CartographicTool';
import { CartographicArrTool } from '../../Utils/CoordinateTool/CartographicArrTool';
import { CoordinateType } from './CoordinateType';
const coordinateTransform = (coordinateType = CoordinateType.cartesian3, ps) => {
    let result;
    if (coordinateType === CoordinateType.cartographicObj) {
        result = CartographicTool.formCartesian3S(ps);
    }
    else if (coordinateType === CoordinateType.cartographicPoiArr) {
        result = CartographicArrTool.formCartesian3S(ps);
    }
    else {
        result = ps;
    }
    return result;
};
export { coordinateTransform };
