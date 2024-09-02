import { LayerSchemeEnum } from '../Enum/LayerSchemeEnum';

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
    scheme: LayerSchemeEnum,
    baseLayer?: boolean,
    minimumLevel: number,
    maximumLevel: number
}

export { ImageryLayerProps };