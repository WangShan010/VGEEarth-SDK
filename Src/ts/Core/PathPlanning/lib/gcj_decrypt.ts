// 将 高德坐标 解密为WGS84
import { WorldDegree } from '../../Impl/Declare';
import { CoordinateOffset } from './CoordinateOffset';

function gcj_decrypt(c: WorldDegree) {
    let poi = CoordinateOffset.gcj_decrypt(c.latitude, c.longitude);
    return {longitude: poi.lon, latitude: poi.lat};
}


export { gcj_decrypt };
