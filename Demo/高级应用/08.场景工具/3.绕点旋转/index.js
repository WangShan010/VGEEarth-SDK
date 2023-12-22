VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');

earth.openDeBug();
earth.createNavigation();

let model = earth.viewer3D.entities.add({
    position: Cesium.Cartesian3.fromDegrees(109.02025470002677, 32.08927505285042, 2140.534056351892),
    model: {
        uri: './fengche.gltf',
        colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
        color: Cesium.Color.WHITE,
        scale: 30,
        maximumScale: 40
    }
});
earth.thenLoadComplete().then(() => {
    let aroundPoint = new VGEEarth.AroundPoint(earth.viewer3D, model.position);
    aroundPoint.activate().then(() => {
        aroundPoint.flyToClose().then();
    });
})

