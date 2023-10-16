// 将 WGS84 加密为 高德坐标
import { WorldDegree } from '../../Impl/Declare';
import { CoordinateOffset } from './CoordinateOffset';

function gcj_encrypt(c: WorldDegree) {
    let poi = CoordinateOffset.gcj_encrypt(c.latitude, c.longitude);
    return {longitude: poi.lon, latitude: poi.lat};
}

export { gcj_encrypt };
