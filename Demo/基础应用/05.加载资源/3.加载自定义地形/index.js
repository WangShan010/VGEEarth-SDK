VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
earth.viewer3DWorkSpace.addData({
    pid: 'terrain-1',
    name: 'Merged_DTM_GF7',
    catalog: '滑坡-DEM',
    dataType: 'terrain',
    properties: {
        scheme: 'CesiumTerrainProvider',
        url: 'http://localhost:3000/DBService/中国地形/'
    }
}).then(r => {
    earth.viewer3DWorkSpace.flyToDataByPid('terrain-1');
});

