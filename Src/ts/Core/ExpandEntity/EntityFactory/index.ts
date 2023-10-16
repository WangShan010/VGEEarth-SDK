import { CallbackProperty, Cartesian3, Entity } from 'cesium';
import { Cesium, WorldDegree } from '../../Impl/Declare';
import { CartographicTool } from '../../../Utils/CoordinateTool/CartographicTool';


import { PolylineLightingMaterial } from '../Material/Polyline/lib/PolylineLightingMaterial';
import { GeoJSON } from 'GeoJSON';
import { getMostDetailedHeight } from '../../../Utils/SceneUtils/getMostDetailedHeight';


/**
 * 名称：Entity 快捷创建库
 * 封装着一些常用的 Entity 创建方法
 *
 * @packageDocumentation
 */
const EntityFactory = {

    /**
     * 创建一个普通点
     * @param position
     */
    createPoint(position: Cartesian3): Entity { // 生成点
        return new Cesium.Entity({
            position: position,
            point: {
                color: Cesium.Color.CORNSILK,
                pixelSize: 8,
                heightReference: Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
    },


    /**
     * 创建一个：白边红心，明显的点（不贴地）
     * @param position
     */
    createRedPoint(position: Cartesian3) {
        return new Cesium.Entity({
            position: position,
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
    },


    /**
     * 绘制空间距离线上的标注
     * @param startPoint:Cesium.Cartesian3
     * @param endPoint:Cesium.Cartesian3
     */
    spaceDistanceLabel(startPoint: Cartesian3, endPoint: Cartesian3): Entity {

        let startPointCat = CartographicTool.formCartesian3(startPoint);
        let endPointCat = CartographicTool.formCartesian3(endPoint);

        let startPointGeoJson = window.turf.point([startPointCat.longitude, startPointCat.latitude]);
        let endPointGeoJson = window.turf.point([endPointCat.longitude, endPointCat.latitude]);
        let centerGeoJson = window.turf.midpoint(startPointGeoJson, endPointGeoJson);
        let distanceNum = window.turf.rhumbDistance(startPointGeoJson, endPointGeoJson, {units: 'meters'});

        let distance = distanceNum > 1000 ? (distanceNum / 1000).toFixed(3) + 'km' : distanceNum.toFixed(3) + 'm';

        let height = (startPointCat.height + endPointCat.height) / 2;

        return new Cesium.Entity({
            position: Cesium.Cartesian3.fromDegrees(centerGeoJson.geometry.coordinates[0], centerGeoJson.geometry.coordinates[1], height),
            label: {
                text: distance,
                font: '21px SimSun',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                fillColor: Cesium.Color.WHITE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelOffset: new Cesium.Cartesian2(30, -30)
            }
        });
    },

    /**
     * 绘制多边形上的标注，面积、周长的数值
     * @param geoJson
     * @param type
     */
    async polygonCenterLabel(geoJson: GeoJSON, type = '周长'): Promise<Entity> {
        let center = window.turf.center(geoJson);
        let label = '';
        switch (type) {
            case '周长': {
                let length = window.turf.length(geoJson, {units: 'kilometers'});
                if (length < 5000) {
                    label = '周长：' + (length * 1000).toFixed(3) + ' m';
                } else {
                    label = '周长：' + length.toFixed(3) + ' km';
                }
            }
                break;
            case '面积': {
                let area = window.turf.area(geoJson);
                if (area < 20_0000) {
                    label = '面积：' + area.toFixed(3) + ' m2';
                } else {
                    label = '面积：' + (area * 0.000001).toFixed(3) + ' km2';
                }
            }
                break;
        }

        let [cartesianHasHeight] = await getMostDetailedHeight([{
            longitude: center.geometry.coordinates[0],
            latitude: center.geometry.coordinates[1],
            height: 0
        }]);

        return new Cesium.Entity({
            position: Cesium.Cartesian3.fromDegrees(cartesianHasHeight.longitude, cartesianHasHeight.latitude, cartesianHasHeight.height),
            label: {
                text: label,
                font: '21px SimSun',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                fillColor: Cesium.Color.WHITE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelOffset: new Cesium.Cartesian2(30, -30)
            }
        });
    },


    /**
     * 绘制空间距离线
     * @param position
     * @param text
     * @param pro
     */
    buildLabelByDegrees(position: WorldDegree, text: string, pro = {}): Entity {
        let param = {
            position: Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude),
            label: {
                text: text,
                font: '12pt bold monospace',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 4,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        };
        for (const key in pro) {
            if (key === 'id') {
                // @ts-ignore
                param[key] = pro[key];
            } else {
                // @ts-ignore
                param.label[key] = pro[key];
            }
        }

        return new Cesium.Entity(param);
    },


    /**
     * 创建发光线
     * @param positions
     */
    createLightingLine(positions: Cartesian3[]) {
        return new Cesium.Entity({
            polyline: {
                positions: positions,
                width: 8,
                clampToGround: true,
                arcType: Cesium.ArcType.RHUMB,
                material: new PolylineLightingMaterial(Cesium.Color.GREEN)
            }
        });
    },

    /**
     * 创建发光面
     * @param positions
     */
    createLightingPolygon(positions: Cartesian3[]) {
        return new Cesium.Entity({
            polyline: {
                positions: new Cesium.CallbackProperty(() => positions, false),
                width: 12,
                loop: true,
                clampToGround: true,
                material: new PolylineLightingMaterial(Cesium.Color.GREEN)
            },
            polygon: {
                hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(positions), false),
                material: new Cesium.ColorMaterialProperty(
                    Cesium.Color.LIGHTSKYBLUE.withAlpha(0.3)),
                heightReference: Cesium.HeightReference.NONE
            }
        });
    },

    /**
     * 创建带标注的点
     * @param p
     * @param text
     * @constructor
     */
    PointLabelEntity(p: Cartesian3, text: string | CallbackProperty) {
        return new Cesium.Entity({
            position: p,
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.NONE
            },
            label: {
                showBackground: true,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                // pixelOffset : new Cesium.Cartesian2(50, -10),
                text: text,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                outlineWidth: 2,
                disableDepthTestDistance: 10000
            }
        });
    },

    /**
     * 创建标注
     * @param position
     * @param text
     */
    buildLabel(position: Cartesian3, text: string) {
        return new Cesium.Entity({
            position: position,
            label: {
                text: text,
                font: '14pt bold monospace',

                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 4,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                // @ts-ignore
                color: Cesium.Color.RED,
                backgroundColor: Cesium.Color.RED,
                heightReference: Cesium.HeightReference.NONE,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelOffset: new Cesium.Cartesian2(0, -30)
            }
        });
    },

    /**
     * 带高圆面
     * @param positions
     */
    createHeightEllipse(positions: Cartesian3[]) {
        // 计算半径
        let radius = function () {
            let point1cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
            let point2cartographic = Cesium.Cartographic.fromCartesian(positions[1]);
            let geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            return geodesic.surfaceDistance;
        };

        // 临时终点（垂直）
        let topPoint = function () {
            let temp_position = [];
            temp_position.push(positions[0]);
            let point1cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
            let point2cartographic = Cesium.Cartographic.fromCartesian(positions[1]);
            // 组合终点（起点的经纬度加上终点的高度）
            let point_temp = Cesium.Cartesian3.fromDegrees(
                Cesium.Math.toDegrees(point1cartographic.longitude),
                Cesium.Math.toDegrees(point1cartographic.latitude),
                point2cartographic.height);
            temp_position.push(point_temp);
            return temp_position;
        };


        let options = {
            position: new Cesium.CallbackProperty(() => positions[0], false),
            polyline: {
                positions: new Cesium.CallbackProperty(topPoint, false),
                material: Cesium.Color.AQUA,
                depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.RED
                }),
                width: 2
            },
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(radius, false),
                semiMajorAxis: new Cesium.CallbackProperty(radius, false),
                material: Cesium.Color.GREEN.withAlpha(0.7),
                depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.RED
                }),
                outline: true,
                height: new Cesium.CallbackProperty(() => Cesium.Cartographic.fromCartesian(positions[1]).height.toFixed(2), false)
            }
        };

        return new Cesium.Entity(options);
    }
};

export { EntityFactory };