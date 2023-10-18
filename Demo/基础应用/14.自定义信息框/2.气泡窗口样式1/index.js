VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;


let pinBuilder = new Cesium.PinBuilder();

window.questionPin = earth.viewer3D.entities.add({
    name: 'Question mark',
    position: Cesium.Cartesian3.fromDegrees(108.97697,32.05784,2015.6),
    billboard: {
        image: pinBuilder.fromUrl('./image/bluecamera.png', Cesium.Color.GREEN, 48),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
});


questionPin.D = new VGEEarth.SuperiorEntity.PopupWindow1Decorator(questionPin, { tile: 123 });

earth.viewer3D.zoomTo(questionPin);
