import { Cesium, WorldDegree } from '../../Impl/Declare';
import * as  Polyline from '../../ExpandEntity/Material/Polyline/index';

let pathCore_GH = {
    navigation: async function (startingPoint: WorldDegree, endPoint: WorldDegree, passPoints: WorldDegree[] = [], avoidPolygons: WorldDegree[][] = []) {

        let origin = startingPoint || {longitude: 108.46385538126562, latitude: 30.7851146657642};
        let pointList = 'point=' + origin.latitude + ',' + origin.longitude;
        passPoints.forEach(p => {
            pointList += '&point=' + p.latitude + ',' + p.longitude;
        });
        let destination = endPoint || {longitude: 108.47119096640783, latitude: 30.78348048735882};
        pointList += '&point=' + destination.latitude + ',' + destination.longitude;

        // 避让区
        let avoidpolygons = '';
        // 构造避让区多边形的格式
        avoidPolygons.forEach((Polygon: WorldDegree[]) => {
            if (avoidpolygons != '')
                avoidpolygons += ';';
            let avoidpolygon = '';
            Polygon.forEach((p) => {
                if (avoidpolygon != '')
                    avoidpolygon += ',';
                avoidpolygon += `${p.latitude},${p.longitude}`;
            });
            avoidpolygons += avoidpolygon;
        });
        // http://localhost:8989/maps/?point=39.801784%2C116.182617&point=32.545887%2C114.113892
        // &locale=zh-CN&profile=car&use_miles=false&layer=Omniscale
        // &ch.disable=true&points_encoded=false
        let baseUrl = 'http://122.227.134.126:98/route?';
        let url = `${baseUrl}${pointList}&locale=zh-CN&profile=car&points_encoded=false&ch.disable=true&block_area=${avoidpolygons}`;

        let route;
        let resData: any;
        try {
            resData = await fetch(url).then(res => res.json());
            route = resData.paths;
        } catch (err) {
            console.error('GraphHopper服务出现了错误，可能是您的URL出错了。您可以检查是否输入了不存在的点或者两个点相距太远。');
        }

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


export { pathCore_GH };
