VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
earth.viewer3DWorkSpace.addData({
    pid: 'c86ce275-5417-9c8d-f037-0d28ff378d6d',
    name: 'Merged_DTM_GF7',
    catalog: '滑坡-DEM',
    dataType: 'terrain',
    properties: {
        scheme: 'CesiumTerrainProvider',
        url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/DEM-wordHeights'
    }
}).then(r => {
    earth.viewer3DWorkSpace.flyToDataByPid('terrain-1');
});

