VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
let pinBuilder = new Cesium.PinBuilder();

let questionPin = earth.viewer3D.entities.add({
    name: 'Question mark',
    position: Cesium.Cartesian3.fromDegrees(-75.1698529, 39.9220071),
    billboard: {
        image: pinBuilder.fromUrl('./士兵-1.png', Cesium.Color.GREEN, 48),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
});

earth.viewer3D.zoomTo(questionPin);
