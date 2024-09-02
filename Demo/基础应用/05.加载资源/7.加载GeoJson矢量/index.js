VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

Cesium.GeoJsonDataSource.load('./road.json', { clampToGround: true }).then(function (dataSource) {
    earth.viewer3D.dataSources.add(dataSource);

    earth.viewer3D.zoomTo(dataSource);
});
