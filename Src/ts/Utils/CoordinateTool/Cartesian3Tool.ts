import { Cesium, WorldDegree } from '../../Core/Impl/Declare';
import { Cartesian3 } from 'cesium';


const Cartesian3Tool = {
    formCartographicObj: function (ctg: WorldDegree) {
        return new Cesium.Cartesian3.fromDegrees(ctg.longitude, ctg.latitude, ctg.height);
    },
    formCartographicObjS: function (ctgArr: WorldDegree[]) {
        let cartesian3Arr: Cartesian3[] = [];
        for (let i = 0; i < ctgArr.length; i++) {
            cartesian3Arr.push(this.formCartographicObj(ctgArr[i]));
        }
        return cartesian3Arr;
    },
    formCartographicArr: function (ctgArr: number[]) {
        return Cesium.Cartesian3.fromDegrees(ctgArr[0], ctgArr[1], ctgArr[2]);
    },

    // 【经纬度对象】数组 转 【笛卡尔坐标对象】数组
    // 输入格式：
    // let coordinates = [
    //     [108.14700948231935, 30.795471733827313, 1145.012060885598],
    //     [108.1332022783138, 30.70153773444751, 609.6407666736469]
    // ];
    // 输出格式：
    // let points = [
    //    { x: -1708218.500471409, y: 5211816.659704349, z: 3247022.1648146017 },
    //    { x: -1708476.6222892085, y: 5216851.541701467, z: 3237797.206687023 }
    // ];
    formCartographicArrS: function (ctgArrS: number[][]) {
        let cartesian3s: Cartesian3[] = [];
        for (let i = 0; i < ctgArrS.length; i++) {
            cartesian3s.push(Cesium.Cartesian3.fromDegrees(ctgArrS[i][0], ctgArrS[i][1], ctgArrS[i][2]));
        }
        return cartesian3s;
    }
};

export { Cartesian3Tool };