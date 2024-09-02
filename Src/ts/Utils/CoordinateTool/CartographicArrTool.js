/****************************************************************************
 名称：Cesium的制图坐标系：经纬度高对象

 最后修改日期：2022-04-12
 ****************************************************************************/
import { Cesium } from '../../Core/Impl/Declare';
const CartographicArrTool = {
    // 【笛卡尔坐标对象】数组 转 【经纬度】数组
    // 输入格式：
    // let points = { x: -1708218.500471409, y: 5211816.659704349, z: 3247022.1648146017 };
    // 输出格式：
    // let coordinates = [108.14700948231935, 30.795471733827313, 1145.012060885598];
    formCartesian3(p) {
        let ellipsoid = Cesium.Ellipsoid.WGS84;
        let cartesian3 = new Cesium.Cartesian3(p.x, p.y, p.z);
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let lon = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let alt = cartographic.height;
        return [lon, lat, alt];
    },
    // 【笛卡尔坐标对象】数组 转 【经纬度】数组
    // 输入格式：
    // let points = [
    //    { x: -1708218.500471409, y: 5211816.659704349, z: 3247022.1648146017 },
    //    { x: -1708476.6222892085, y: 5216851.541701467, z: 3237797.206687023 }
    // ];
    // 输出格式：
    // let coordinates = [
    //     [108.14700948231935, 30.795471733827313, 1145.012060885598],
    //     [108.1332022783138, 30.70153773444751, 609.6407666736469]
    // ];
    formCartesian3S(ps) {
        let arr = [];
        for (let i = 0; i < ps.length; i++) {
            let p = ps[i];
            arr.push(this.formCartesian3(p));
        }
        return arr;
    }
};
export { CartographicArrTool };
