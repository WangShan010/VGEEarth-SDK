const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = false;
let colors = [
    Cesium.Color.AQUA,
    Cesium.Color.GREEN,
    Cesium.Color.YELLOW,
    Cesium.Color.RED
];

let labels = [{
    position: Cesium.Cartesian3.fromDegrees(103.88545983932153, 36.033216960244246, 0),
    label: '沿河区'
}, {
    position: Cesium.Cartesian3.fromDegrees(103.87214667212257, 36.038301982724796, 0),
    label: '环城区'
}, {
    position: Cesium.Cartesian3.fromDegrees(103.86194888078703, 36.03969446525105, 0),
    label: '封控区'
}, {
    position: Cesium.Cartesian3.fromDegrees(103.85091307483806, 36.041102519445715, 0),
    label: '核心区'
}];

fetch('./arealabel.json').then(res => {
    return res.json();
}).then(res => {
    let features = res.features;
    let areaLabel = new VGEEarth.SuperiorEntity.AreaLabel(
        earth.viewer3D, colors, labels, features
    );
    areaLabel.init();
});

earth.viewer3D.scene.camera.setView({
    destination: {
        x: -1238875.9606814845,
        y: 5021694.589907374,
        z: 3731291.006898492
    },
    orientation: {
        heading: 6.2243565276080295,
        pitch: -0.9203738754493909,
        roll: 6.282874205266332
    },
    duration: 1
});
