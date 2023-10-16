// 将 百度坐标 解密为WGS84
import { WorldDegree } from '../../Impl/Declare';
import { CoordinateOffset } from './CoordinateOffset';

function bd_decrypt(c: WorldDegree) {
    let poi = CoordinateOffset.bd_decrypt(c.latitude, c.longitude);
    return {longitude: poi.lon, latitude: poi.lat};
}


export { bd_decrypt };
