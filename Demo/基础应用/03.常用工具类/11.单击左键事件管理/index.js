const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

const blueBox = earth.viewer3D.entities.add({
    id: 'blueBox1',
    name: 'Blue box',
    position: Cesium.Cartesian3.fromDegrees(114.0, 40.0, 30000.0),
    box: {
        dimensions: new Cesium.Cartesian3(40000.0, 30000.0, 50000.0),
        material: Cesium.Color.BLUE
    }
});
earth.viewer3D.zoomTo(blueBox).then();

VGEEarth.EventMana.screenEvent.addEventListener(
    VGEEarth.ScreenSpaceEventType.LEFT_CLICK,
    VGEEarth.ScopeType.Viewer3D,
    (e) => {
        let pick = earth.viewer3D.scene.pick(e.position);

        alert(pick?.id?.name);
    }
);
