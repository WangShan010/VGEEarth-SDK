/****************************************************************************
 名称：Cesium的制图坐标系：经纬度高对象

 最后修改日期：2022-04-12
 ****************************************************************************/
import { Cesium } from '../../Core/Impl/Declare';
import { CartographicArrTool } from './CartographicArrTool';
const CartographicTool = {
    // 【笛卡尔坐标对象】数组 转 【经纬度对象】数组
    // 输入格式：
    // let points = { x: -1708218.500471409, y: 5211816.659704349, z: 3247022.1648146017 }
    // 输出格式：
    // let coordinates = {longitude: 108.14700948231935, latitude: 30.795471733827313, height: 1145.012060885598};
    formCartesian3(p) {
        let [lon, lat, alt] = CartographicArrTool.formCartesian3(p);
        return new Cesium.Cartographic(lon, lat, alt);
    },
    // 【笛卡尔坐标对象】数组 转 【经纬度对象】数组
    // 输入格式：
    // let points = [
    //    { x: -1708218.500471409, y: 5211816.659704349, z: 3247022.1648146017 },
    //    { x: -1708476.6222892085, y: 5216851.541701467, z: 3237797.206687023 }
    // ];
    // 输出格式：
    // let coordinates = [
    //   {longitude: 108.14700948231935, latitude: 30.795471733827313, height: 1145.012060885598},
    //   {longitude: 108.1332022783138, latitude: 30.701537734447513, height: 609.6407666736469}
    // ];
    formCartesian3S(ps) {
        let cts = [];
        for (let i = 0; i < ps.length; i++) {
            cts.push(this.formCartesian3(ps[i]));
        }
        return cts;
    }
};
export { CartographicTool };
