VGEEarth.ConfigTool.addMapBoxOnLine(true);
// VGEEarth.ConfigTool.addTerrainOnAliYun(true);

const config = {
    geoJsonList: [
        {
            name: '长虹桥',
            catalog: '特效',
            dataType: 'water',
            defaultLoad: true,
            properties: {
                geoJsonUrl: `./水域.geojson`,
                red: 0.8,
                height: 50
            }
        }
    ]
};
VGEEarth.ConfigTool.loadConfig(config);


const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

VGEEarth.SceneUtils.viewerFlyToLonLat(120.6710443, 30.7404327, 1000);
