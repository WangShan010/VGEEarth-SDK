VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);


const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

let degreesArray = [
    108.95845176158039, 34.2209941780463,
    108.9584748495834, 34.21803038060675,
    108.96045905751183, 34.21798285304661,
    108.96044217064095, 34.22105243175435,
];
let limitHeight = new VGEEarth.LimitHeight(earth.viewer3D, degreesArray, 430);

let resourceItem = {
    pid: 'b0c24b7d-5970-f574-a7f2-5ef0851dfcc0',
    name: '小区',
    catalog: '三维模型',
    dataType: 'Cesium3DTile',
    defaultLoad: true,
    properties: {
        url: 'https://vge-webgl-open.oss-cn-beijing.aliyuncs.com/3DTiles-DaYanTa/tileset.json',
        maximumScreenSpaceError: 1,
        offset: {
            height: -15
        }
    }
};

earth.viewer3DWorkSpace.addData(resourceItem).then((tileSet) => {
    earth.viewer3D.zoomTo(tileSet);
});

window.limitHeightChange = function (height) {
    limitHeight.setHeight(height);
};
