VGEEarth.ConfigTool.addMapBoxOnLine(true);
VGEEarth.ConfigTool.addTerrainOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();


const tileSet = earth.viewer3D.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: new Cesium.Resource({
        url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
        // url:'http://localhost:3000/DBService/3DTiles-YunHe-3/cesium_3d_tiles_5_15.json',
        maximumScreenSpaceError: 2,
        maximumMemoryUsage: 8192,
        queryParameters: {
            'access_token': '123-435-456-000'
        }
    }),
    maximumScreenSpaceError: 24
}));

earth.viewer3D.zoomTo(tileSet);




