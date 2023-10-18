const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
earth.viewer3DWorkSpace.addData({
    name: '在线地形',
    catalog: '地形数据',
    dataType: 'terrain',
    properties: {
        scheme: 'CesiumTerrainProvider',
        url: 'default'
    }
});

let position = {};
earth.initMonitorCoordinates(
    earth.viewer3D, function (log, lat, height, cameraHeight, orientation) {
        position.lon = `${log.toFixed(5)}  °`;
        position.lat = `${lat.toFixed(5)}  °`;
        position.height = `${height.toFixed(2)} m`;
        position.cameraHeight = `${cameraHeight.toFixed(2)} m`;
        position.orientation = orientation;
        document.getElementById('position-label').innerText = JSON.stringify(position, null, 4);
    }
);
