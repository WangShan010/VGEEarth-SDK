VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
const position = Cesium.Cartesian3.fromDegrees(
    123.0744619,
    44.0503706,
    500
);

window.entity = new Cesium.Entity({
    position: position,
    model: new Cesium.ModelGraphics({
        uri: './bell_huey_helicopter.glb',
        minimumPixelSize: 64,
        maximumScale: 20000
    })
});

earth.viewer3D.entities.add(entity);

earth.viewer3D.zoomTo(entity);
