import { DataTypeEnum } from './DataTypeEnum';

// 可参见：
// Cesium.ArcGisMapServerImageryProvider.ConstructorOptions
// Cesium.BingMapsImageryProvider.ConstructorOptions
// Cesium.GoogleEarthEnterpriseImageryProvider.ConstructorOptions
// Cesium.GridImageryProvider.ConstructorOptions
// Cesium.ImageryProvider.ConstructorOptions
// Cesium.IonImageryProvider.ConstructorOptions
// Cesium.MapboxImageryProvider.ConstructorOptions
// Cesium.MapboxStyleImageryProvider.ConstructorOptions
// Cesium.OpenStreetMapImageryProvider.ConstructorOptions
// Cesium.SingleTileImageryProvider.ConstructorOptions
// Cesium.TileCoordinatesImageryProvider.ConstructorOptions
// Cesium.TileMapServiceImageryProvider.ConstructorOptions
// Cesium.UrlTemplateImageryProvider.ConstructorOptions
// Cesium.WebMapServiceImageryProvider.ConstructorOptions
// Cesium.WebMapTileServiceImageryProvider.ConstructorOptions
interface ImageryLayerProps {
    scheme: 'layer-xyz-3857' | 'layer-singleTileImagery',
    baseLayer?: boolean,
    minimumLevel: number,
    maximumLevel: number
}

interface Cesium3DTileProps {
    offset: {
        lon: number,
        lat: number,
        height: number
    };
}


/**
 * 资源项的定义规范，用于约束资源项的类型。
 *
 * 最后修改日期：2023-12-22
 *
 *
 *  @example
 *
 * // 以下是一个影像资源资源项的示例：更详细的描述和案例可参见：
 * // http://8.146.208.114:8083/zh/基础平台二次开发指南/#_2-1-baseconfig-js-文件说明
 *  const resourceItem = {
 *   "pid": "dd7813c4-dd2c-2ce4-7ff3-af62a8b97255",
 *   "name": "Bing Maps Aerial",
 *   "catalog": "基础影像",
 *   "dataType": "layer",
 *   "showInTree": true,
 *   "defaultLoad": true,
 *   "show": true,
 *   "offlineCache": false,
 *   "properties": {
 *     "scheme": "layer-xyz-3857",
 *     "url": "http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
 *   }
 * }
 *
 *
 *
 *
 *
 */
interface ResourceItem {
    pid: string,
    name: string,
    catalog: string,
    dataType: DataTypeEnum,
    showInTree: boolean,
    defaultLoad: boolean,
    show: boolean,
    netRootPaths?: string[],
    offlineCache: boolean,
    decryptionKey?: string,

    properties: ImageryLayerProps | Cesium3DTileProps | any;
}


export { ResourceItem };
