const earth = new VGEEarth.Earth('MapContainer');


earth.viewer3D.imageryLayers.removeAll();
let splitLayerL = new Cesium.UrlTemplateImageryProvider({
    url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', // 3857 的切片方案
    tilingScheme: new Cesium.WebMercatorTilingScheme(), fileExtension: 'png'
});

window.splitControlL = new VGEEarth.ImageLayerSplit(earth.viewer3D, splitLayerL, Cesium.SplitDirection.LEFT);

let splitLayerR = new Cesium.UrlTemplateImageryProvider({
    url: 'https://vge-earth.oss-cn-beijing.aliyuncs.com/MapTile-google/{z}/{x}/{y}.png', // 3857 的切片方案
    tilingScheme: new Cesium.WebMercatorTilingScheme(), fileExtension: 'png'
});

window.splitControlR = new VGEEarth.ImageLayerSplit(earth.viewer3D, splitLayerR, Cesium.SplitDirection.RIGHT);
