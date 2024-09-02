VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);


const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
window.earth = earth;


let s = {
    pid: '1234567890',
    name: '倾斜模型',
    catalog: '三维模型',
    dataType: 'Cesium3DTile',
    defaultLoad: true,
    netRootPaths: [
        'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/3DTiles-TianYi/'
    ],
    offlineCache: true,
    decryptionKey: '795bc22d-c487-6fd6-ec77-56849171d53d',
    properties: {
        url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/3DTiles-TianYi/tileset.json',
        maximumScreenSpaceError: 2,
        maximumMemoryUsage: 8192,
        offset: {
            height: 52
        }
    }
};


let ds = earth.viewer3DWorkSpace.addData(s).then(() => {
    earth.viewer3DWorkSpace.flyToDataByPid(s.pid);
});

