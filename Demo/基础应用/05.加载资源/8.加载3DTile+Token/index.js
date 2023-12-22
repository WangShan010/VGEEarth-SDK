VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();


const tileSet = await Cesium.Cesium3DTileset.fromUrl(
    new Cesium.Resource({
        url: 'https://webgpu.top:3006/DBService/terr_three_osgblab_new/scene.json',
        queryParameters: {
            'access_token': '123-435-456-000'
        }
    }),
    {
        maximumScreenSpaceError: 2,
        maximumMemoryUsage: 8192,
    }
);


earth.viewer3D.scene.primitives.add(tileSet);
earth.viewer3D.zoomTo(tileSet);


