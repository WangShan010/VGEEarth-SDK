/****************************************************************************
 名称：图上标绘功能
 描述：非常复杂。。。好累啊，不想加班了

 最后修改日期：2022-04-12
 ****************************************************************************/

import { Cartesian3, Viewer } from 'cesium';
import { GeoJSON } from 'GeoJSON';
import { DrawShape } from '../DrawShape/index';
import { inputVectorData } from './lib/inputVectorData';
import { BOMTool } from '../../Utils/index';
import { EventMana } from '../EventMana/EventMana';
import { getMainViewer } from '../Earth/lib/getMainViewer';
import { PlotDataSource } from './lib/PlotDataSource';
import { CoordinateType } from '../DrawShape/CoordinateType';
import { Feature } from 'geojson';
import { SafeTool } from '../../Utils/index';

let MoveEntityID: string = '';
let SelEntityID: string = '';


/**
 * 图上标绘功能
 */
class PlotTool {
    #MoveEntityID: string = '';
    #SelEntityID: string = '';
    private viewer: Viewer;
    private fileName: string;
    private clampToGround: boolean;
    private GeoJson;
    private GeoJsonBackups: GeoJSON[];
    private dataSourceToo: PlotDataSource;
    private drawShape: DrawShape;
    private DrawType;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.fileName = '';
        this.GeoJson = window.turf.featureCollection([]);
        this.GeoJsonBackups = [];
        this.clampToGround = true;
        this.dataSourceToo = new PlotDataSource('标绘工具-实体集合');
        this.drawShape = new DrawShape(viewer);
        this.DrawType = [
            {
                fillColor: 'rgb(238, 204, 204)',
                fillStyle: './icon/full.png',
                borderColor: 'rgb(252, 220, 113)',
                borderWidth: '5px',
                borderStyle: 'solid',
                opacity: '0.5'
            },
            {
                fillColor: 'rgb(2,0,255)',
                fillStyle: 'solid',
                lineWidth: '5',
                opacity: '0.5'
            },
            {}
        ];

        viewer.scene.globe.depthTestAgainstTerrain = true;
        // @ts-ignore
        viewer.dataSources.add(this.dataSourceToo).then();
        this.initEvent();
    }

    // 初始化事件
    initEvent() {
        EventMana.screenEvent.addEventListener(
            EventMana.ListenType.ScreenSpaceEventType.MOUSE_MOVE,
            EventMana.ScopeType.Viewer3D,
            cursorMove
        );
        EventMana.screenEvent.addEventListener(
            EventMana.ListenType.ScreenSpaceEventType.LEFT_CLICK,
            EventMana.ScopeType.Viewer3D,
            cursorCilk
        );
    }

    // 导入外部文件资源
    inputFileData({errFunc, endFunc} = {errFunc: Function, endFunc: Function}) {
        let that = this;
        // @ts-ignore
        inputVectorData({
            // @ts-ignore
            errFunc: (msg: string) => {
                typeof errFunc === 'function' && errFunc(msg);
            },
            // @ts-ignore
            endFunc: (res: { fileName: string, filePath: string, fileType: string, geoJson: GeoJSON }) => {
                const {fileName, filePath, fileType, geoJson} = res;
                that.fileName = fileName;
                that.addGeoJsonBackupBefore();
                if (geoJson.type === 'FeatureCollection') {
                    that.GeoJson = geoJson;
                } else {
                    that.GeoJson = window.turf.featureCollection([geoJson]);
                }
                that.addGeoJsonBackupAfter();
                typeof endFunc === 'function' && endFunc(fileName);
            }
        });
    }

    /**
     * 导出另存为 GeoJson 文件
     * @param func  回调函数
     * @constructor
     */
    SaveAsGeoJson(func: Function) {
        BOMTool.saveShareContent(JSON.stringify(this.GeoJson), 'exporton');
        typeof func === 'function' && func('导出 GeoJson 文件成功');
    }

    SaveAsKML(func: Function) {
        // @ts-ignore
        let kml = window.tokml(this.GeoJson);
        BOMTool.saveShareContent(kml, 'export.kml');
        typeof func === 'function' && func('导出 KML 文件成功');
    }

    addPoint(paramsObj: any) {
        let that = this;
        that.drawShape.drawPoint({
            coordinateType: CoordinateType.cartographicPoiArr,
            endCallback: function (ps: number[]) {
                that.addGeoJsonBackupBefore();
                let properties = {id: 'Point-' + SafeTool.uuid(), 'marker-symbol': 'null'} as any;
                for (let key in paramsObj) {
                    properties[key] = paramsObj[key];
                }
                let p = window.turf.point(ps[0], properties);
                that.GeoJson.features.push(p);
                that.addGeoJsonBackupAfter();
            }
        });
    }

    addMultiLine(strokeMaterial: string, width: number, func: Function) {
        let that = this;
        that.drawShape.drawPolyLine({
            coordinateType: CoordinateType.cartographicPoiArr,
            endCallback: function (ps: number[]) {
                that.addGeoJsonBackupBefore();
                let line = window.turf.lineString(ps, {
                    id: 'Line-' + SafeTool.uuid(),
                    'stroke-material': strokeMaterial || 'normal',
                    'stroke-width': width || 12,
                    'name': '多段线'
                });
                that.GeoJson.features.push(line);
                that.addGeoJsonBackupAfter();
                if (typeof func === 'function') {
                    func({message: '添加多段线', width: 320}, 'success', 2000, line);
                }
            }
        });
    }

    addPolygon(featureHasHeight: boolean = false, func: Function) {
        let that = this;
        that.drawShape.drawPolygon({
            coordinateType: CoordinateType.cartographicPoiArr,
            endCallback: function (ps: number[]) {
                that.addGeoJsonBackupBefore();

                if (!featureHasHeight) {
                    // @ts-ignore
                    ps.map((p: number[]) => {
                        if (p[2]) {
                            p.pop();
                        }
                    });
                }

                let polygon = window.turf.polygon([ps], {
                    id: 'Polygon-' + SafeTool.uuid(),
                    fill: 'rgba(128,224,245,0.5)',
                    name: '面'
                });
                that.GeoJson.features.push(polygon);
                that.addGeoJsonBackupAfter();
                if (typeof func === 'function') {
                    func({message: '添加面', width: 320}, 'success', 2000);
                }
            }
        });
    }

    async addModel(modelUrl: string, modelScale: number, modelHeight: number = 0, modelHeading: number, modelPitch: number, modelRoll: number) {
        let that = this;
        that.drawShape.drawPoint({
            coordinateType: CoordinateType.cartographicPoiArr,
            endCallback: function (ps: number[][]) {
                that.addGeoJsonBackupBefore();
                let properties = {
                    id: 'model-' + SafeTool.uuid(),
                    'model-url': modelUrl
                };
                ps[0][2] += modelHeight;
                let p = window.turf.point(ps[0], properties);
                that.GeoJson.features.push(p);
                that.addGeoJsonBackupAfter();
            }
        });
    }


    delEntity(func: Function) {
        let that = this;
        that.addGeoJsonBackupBefore();

        that.dataSourceToo.entities.removeById(SelEntityID);
        let geo = window.turf.featureCollection([]);
        window.turf.featureEach(that.GeoJson, function (currentFeature: Feature) {
            if (currentFeature.properties?.id !== SelEntityID) {
                geo.features.push(currentFeature);
            }
        });

        that.GeoJson = geo;

        that.addGeoJsonBackupAfter();

        typeof func === 'function' && func({message: '删除实体', width: 320}, 'success', 2000);
    }

    // 渲染 GeoJson
    analyticGeometry() {
        let that = this;
        that.dataSourceToo.entities.removeAll();
        that.dataSourceToo.load(that.GeoJson, {
            clampToGround: that.clampToGround
        });
    }

    // 撤销
    revoke() {
        if (this.GeoJsonBackups.length > 0) {
            this.GeoJson = this.GeoJsonBackups.pop();
            this.analyticGeometry();
        }
    }

    // 修改 GeoJson 完成后，将修改后的 GeoJson 存储到历史集合中
    addGeoJsonBackupAfter() {
        let that = this;
        // that.initTree();
        that.analyticGeometry();
    }

    // 每当需要改变 GeoJson 数据时，需要将旧的版本保存起来
    addGeoJsonBackupBefore() {
        let clone = JSON.parse(JSON.stringify(this.GeoJson));
        this.GeoJsonBackups.push(clone);
    }

    // 初始化资源
    removeAll() {
        this.dataSourceToo.entities.removeAll();
        this.GeoJson = window.turf.featureCollection([]);
        this.GeoJsonBackups = [];
    }

    // 销毁标绘工具
    destroy() {
        this.dataSourceToo.entities.removeAll();
        // @ts-ignore
        this.viewer.dataSources.remove(this.dataSourceToo);
        EventMana.screenEvent.removeEventListener(cursorCilk);
        EventMana.screenEvent.removeEventListener(cursorMove);

        document.body.style.cursor = 'default';
    }
}

function cursorMove(event: { endPosition: Cartesian3 }) {
    let pickedFeature = getMainViewer().scene.pick(event?.endPosition);
    if (pickedFeature?.id) {
        // document.body.style.cursor = 'pointer';
        MoveEntityID = pickedFeature?.id?.id;
    }
}

function cursorCilk(event: { position: Cartesian3 }) {
    let pickedFeature = getMainViewer().scene.pick(event?.position);
    if (pickedFeature?.id) {
        SelEntityID = pickedFeature?.id?.id;
    }
}

export { PlotTool };
