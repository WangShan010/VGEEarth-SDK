/****************************************************************************
 名称：路径规划模块

 最后修改日期：2021-09-09
 ****************************************************************************/

import { CoordinateOffset } from './CoordinateOffset';
import { Cesium, WorldDegree } from '../../Impl/Declare';
import * as  Polyline from '../../ExpandEntity/Material/Polyline/index';
import { gcj_decrypt } from './gcj_decrypt';
import { gcj_encrypt } from './gcj_encrypt';

let pathCore = {
    // 高德地图服务 应急救援-路径规划 Web服务，这个 ToKen 是 fgy 的个人账户
    key: '745ba982f4eb68c773bd0cb3a2e51358',

    /**
     * 进行路径导航
     *     [[
     *        {"longitude": 108.46928509853599, "latitude": 30.78374889101675},
     *        {"longitude": 108.46699359705705, "latitude": 30.78043411072027},
     *        {"longitude": 108.47377497448264, "latitude": 30.780091325713542},
     *        {"longitude": 108.4729601507432, "latitude": 30.782498006154803},
     *        {"longitude": 108.46928509853599, "latitude": 30.78374889101675}
     *    ]]
     */
    navigation: async function (startingPoint: WorldDegree, endPoint: WorldDegree, passPoints: WorldDegree[] = [], avoidPolygons: WorldDegree[][] = []) {
        let type = 'driving';

        let origin = gcj_encrypt(startingPoint || {longitude: 108.46385538126562, latitude: 30.7851146657642});
        let originStr = origin.longitude + ',' + origin.latitude;
        let destination = gcj_encrypt(endPoint || {longitude: 108.47119096640783, latitude: 30.78348048735882});
        let destinationStr = destination.longitude + ',' + destination.latitude;


        // 途经点
        let waypoints = '';
        passPoints = passPoints || [{longitude: 108.46359783343034, latitude: 30.783531080888885}];
        passPoints.forEach(p => {
            let e = gcj_encrypt(p);
            waypoints += `${e.longitude},${e.latitude}` + ';';
        });

        // 避让区
        let avoidpolygons = '';
        // 构造避让区多边形的格式
        avoidPolygons.forEach((Polygon: WorldDegree[]) => {
            Polygon.forEach((p) => {
                let e = gcj_encrypt(p);
                avoidpolygons += `${e.longitude},${e.latitude}` + ';';
            });
            avoidpolygons += '|';
        });

        let baseUrl = 'https://restapi.amap.com/v3/direction';
        let url = `${baseUrl}/${type}?key=${this.key}&output=json&extensions=all&strategy=11&origin=${originStr}&destination=${destinationStr}&waypoints=${waypoints};&avoidpolygons=${avoidpolygons}`;

        let resData: any = await fetch(url).then(res => res.json());
        let route = resData.route;


        // 解密坐标系
        route.origin = gcj_decrypt({
            longitude: route.origin.split(',')[0],
            latitude: route.origin.split(',')[0],
            height: 0
        });
        route.destination = gcj_decrypt({
            longitude: route.destination.split(',')[0],
            latitude: route.destination.split(',')[0],
            height: 0
        });


        // 遍历路径数组
        route.paths.forEach((p: { steps: any }) => {
            // 遍历该路径的步骤
            p.steps.forEach((step: any) => {
                let polyLine = [];
                polyLine.push(...step.polyline.split(';'));
                polyLine = polyLine.map(i => {
                    let fixPoint = CoordinateOffset.gcj_decrypt(i.split(',')[1] * 1, i.split(',')[0] * 1);
                    return {longitude: fixPoint.lon, latitude: fixPoint.lat};
                });
                step.polyline = polyLine;
            });
        });

        return route;
    },

    // 构造最终路线效果的
    entityNaviLine: function (points: WorldDegree[] = [], id = '') {
        const DegreesArray: number[] = [];
        points.forEach(item => {
            DegreesArray.push(item.longitude, item.latitude);
        });

        return new Cesium.Entity({
            id: '路径规划-方案-' + id,
            name: '路径规划-方案-' + id,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(DegreesArray),
                width: 15,
                material: new Polyline.PolylineLinkPulseMaterial({
                    color: Cesium.Color.fromRandom().withAlpha(0.7),
                    duration: 5000 //时间 控制速度
                }),
                clampToGround: true
            }
        });
    },

    // 构造避让区的多边形 Entity
    entityAvoidRange: function (points: WorldDegree[] = []) {
        const DegreesArray: number[] = [];
        points.forEach(item => {
            DegreesArray.push(item.longitude, item.latitude);
        });
        return new Cesium.Entity({
            name: '避让区',
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(DegreesArray),
                material: Cesium.Color.CRIMSON.withAlpha(0.4)
            },
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(DegreesArray),
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.WHITE
                }),
                clampToGround: true
            }
        });
    }
};


export { pathCore };
