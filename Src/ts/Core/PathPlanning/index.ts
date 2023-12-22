/****************************************************************************
 名称：路径规划封装库

 最后修改日期：2022-04-07
 ****************************************************************************/

import { CustomDataSource, Entity, Viewer } from 'cesium';
import { Cesium, WorldDegree } from '../Impl/Declare';
import { pathCore } from './lib/pathCore';
import { pathCore_GH } from './lib/pathCore_GH';
import { MarkTool } from '../../Utils/MarkTool/index';
import { buildBillboard } from '../ExpandEntity/NormalEntity/buildBillboard';
import { DrawShape } from '../DrawShape/index';
import { CoordinateType } from '../DrawShape/CoordinateType';

let startingPointPng = require('../../../img/pathPlaning/start.png');
let endPointPng = require('../../../img/pathPlaning/end.png');
let tjdPng = require('../../../img/pathPlaning/tjd.png');

enum RoutingServiceType {
    'AMap' = 'AMap',
    'GraphHopper' = 'GraphHopper'
}

class PathPlanning {
    private viewer: Viewer;
    private dataSourceToo: CustomDataSource;
    private drawShape: DrawShape;

    private startingPointEntity: Entity | null;
    private endPointEntity: Entity | null;
    private passPointEntityArr: Entity[];
    private avoidRangeEntityArr: Entity[];
    private roadEntityArr: Entity[];

    private startingPoint: WorldDegree;
    private endPoint: WorldDegree;
    private passPointArr: WorldDegree[];
    private avoidRanges: WorldDegree[][] = [];
    private naviData: any;

    //路径导航服务类型，0：高德地图服务，1：开源GraphHopper服务。默认为高德地图服务。
    private routingServiceType: RoutingServiceType;

    constructor(viewer: Viewer, _routingServiceType: RoutingServiceType) {
        this.dataSourceToo = new Cesium.CustomDataSource('路径规划-实体集合');
        this.drawShape = new DrawShape(viewer);
        this.startingPointEntity = null;
        this.endPointEntity = null;
        this.passPointEntityArr = [];
        this.avoidRangeEntityArr = [];
        this.roadEntityArr = [];

        this.startingPoint = {longitude: 0, latitude: 0, height: 0};
        this.endPoint = {longitude: 0, latitude: 0, height: 0};
        this.passPointArr = [];
        this.avoidRanges = [];
        this.routingServiceType = _routingServiceType || RoutingServiceType.AMap;
        this.naviData = null;
        this.viewer = viewer;

        viewer.dataSources.add(this.dataSourceToo).then();
    }

    // 选取起始点
    async takeStartingPoint() {
        let markTool = new MarkTool(startingPointPng);
        this.clearRoads();
        if (this.startingPointEntity) {
            this.dataSourceToo.entities.remove(this.startingPointEntity);
        }
        let p = await this.takePoint();
        if (p) {
            this.startingPoint = p;
            this.startingPointEntity = this.addMarkEntity(p.longitude, p.latitude, startingPointPng);
        }
        markTool.remove();
    }

    // 选取终点
    async takeEndPoint() {
        let markTool = new MarkTool(endPointPng);
        this.clearRoads();
        if (this.endPointEntity) {
            this.dataSourceToo.entities.remove(this.endPointEntity);
        }
        let p = await this.takePoint();
        if (p) {
            this.endPoint = p;
            this.endPointEntity = this.addMarkEntity(p.longitude, p.latitude, endPointPng);
        }
        markTool.remove();
    }

    // 选取途径点
    async takePassPoint() {
        let markTool = new MarkTool(tjdPng);
        this.clearRoads();
        let p = await this.takePoint();
        if (p) {
            this.passPointArr.push(p);
            this.passPointEntityArr.push(this.addMarkEntity(p.longitude, p.latitude, tjdPng));
        }
        markTool.remove();
    }

    // 选取避让区
    async takeAvoidRange() {
        this.clearRoads();
        return new Promise((resolve, reject) => {
            this.drawShape.drawPolygon({
                coordinateType: CoordinateType.cartographicObj,
                endCallback: (ps: WorldDegree[]) => {
                    this.avoidRanges.push(ps);
                    let r = this.dataSourceToo.entities.add(pathCore.entityAvoidRange(ps));
                    this.avoidRangeEntityArr.push(r);
                    resolve(this.avoidRangeEntityArr);
                },
                errCallback: () => {
                    reject([]);
                }
            });
        });

    }

    // 清除途径点
    clearPassPoint() {
        this.passPointArr = [];
        this.passPointEntityArr.forEach((e) => {
            this.dataSourceToo.entities.remove(e);
        });
    }

    // 清除避让区
    clearAvoidRanges() {
        this.avoidRanges = [];
        this.avoidRangeEntityArr.forEach((e) => {
            this.dataSourceToo.entities.remove(e);
        });
    }

    // 清空规划路线结果
    clearRoads() {
        this.roadEntityArr.forEach((e) => {
            this.dataSourceToo.entities.remove(e);
        });
    }

    // 根据路径规划结果，生成路径实体
    buildPathEntity(pathIndex: number = 0) {
        if (!this.naviData) {
            return;
        }
        this.dataSourceToo.entities.removeAll();

        // 起点标识
        this.startingPointEntity = this.addMarkEntity(this.startingPoint.longitude, this.startingPoint.latitude, startingPointPng);

        // 起点标识
        this.endPointEntity = this.addMarkEntity(this.endPoint.longitude, this.endPoint.latitude, endPointPng);

        // 目的地点标识
        this.passPointArr.forEach(p => this.passPointEntityArr.push(this.addMarkEntity(p.longitude, p.latitude, tjdPng)));

        // 避让区
        this.avoidRanges.forEach(range => {
            this.avoidRangeEntityArr.push(this.dataSourceToo.entities.add(pathCore.entityAvoidRange(range)));
        });

        // 路线
        if (this.routingServiceType === RoutingServiceType.AMap) {
            console.log('使用高德地图服务');
            this.naviData.paths.forEach((path: any, index: number) => {
                if (index !== pathIndex) {
                    return;
                }
                let polyLine: WorldDegree[] = [];

                polyLine.push(this.startingPoint);
                path.steps.forEach((step: any) => {
                    polyLine.push(...step.polyline);
                });
                polyLine.push(this.endPoint);

                let road = this.dataSourceToo.entities.add(pathCore.entityNaviLine(polyLine, String(index + 1)));
                this.roadEntityArr.push(road);
            });
        } else {
            console.log('使用GraphHopper服务');
            this.naviData.forEach((path: any, index: number) => {
                if (index !== pathIndex) {
                    return;
                }
                let polyLine: WorldDegree[] = [];

                polyLine.push(this.startingPoint);
                path.points.coordinates.forEach((point: any) => {
                        polyLine.push({longitude: point[0], latitude: point[1], height: 0});
                    }
                )
                ;
                polyLine.push(this.endPoint);

                let road = this.dataSourceToo.entities.add(pathCore_GH.entityNaviLine(polyLine, String(index + 1)));
                this.roadEntityArr.push(road);
            });
        }
    }

    // 执行路径规划
    async runNavigation() {
        let naviData;
        if (this.routingServiceType === RoutingServiceType.AMap) {
            naviData = await pathCore.navigation(this.startingPoint, this.endPoint, this.passPointArr, this.avoidRanges);
        } else {
            naviData = await pathCore_GH.navigation(this.startingPoint, this.endPoint, this.passPointArr, this.avoidRanges);
        }
        if (naviData == null)
            return naviData;
        this.naviData = naviData;
        this.buildPathEntity();
        return naviData;
    }

    // 重置路径规划工具全部数据
    resetNavigation() {
        this.clearAvoidRanges();
        this.clearPassPoint();
        this.clearRoads();
        this.avoidRanges = [];
        this.dataSourceToo.entities.removeAll();
        this.startingPointEntity = null;
        this.endPointEntity = null;
        this.naviData = null;

        this.startingPoint = {longitude: 0, latitude: 0, height: 0};
        this.endPoint = {longitude: 0, latitude: 0, height: 0};
    }

    destroy() {
        this.resetNavigation();
        this.viewer.dataSources.remove(this.dataSourceToo);
    }

    // 在地图上选点，取五位小数位
    private takePoint(): Promise<WorldDegree | null> {
        return new Promise((resolve) => {
            this.drawShape.drawPoint({
                coordinateType: CoordinateType.cartographicObj,
                endCallback: (ps: WorldDegree[]) => {
                    let lon = Math.floor(ps[0].longitude * 100000) / 100000;
                    let lat = Math.floor(ps[0].latitude * 100000) / 100000;
                    resolve({longitude: lon, latitude: lat, height: 0});
                },
                errCallback: () => {
                    resolve(null);
                }
            });
        });
    }

    // 向地图添加一个图标
    private addMarkEntity(longitude: number, latitude: number, imgUrl: string) {
        return this.dataSourceToo.entities.add(buildBillboard(longitude, latitude, {
            imgUrl: imgUrl,
            width: 15,
            height: 21
        }));
    }
}


export { PathPlanning };
