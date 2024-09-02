VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

VGEEarth.ConfigTool.loadConfig({homeView: {longitude: 110, latitude: 30, height: 1000000}});

const earth = new VGEEarth.Earth('MapContainer');
const pinBuilder = new Cesium.PinBuilder();
earth.openDeBug();
earth.createNavigation();


const entity = earth.viewer3D.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-75.1698529, 39.9220071),
    billboard: {
        image: pinBuilder.fromUrl('./士兵-1.png', Cesium.Color.GREEN, 48),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
});

earth.viewer3D.zoomTo(entity);
const editEntity = new VGEEarth.EditEntity(entity, (coor) => {
    console.log(coor);
});

editEntity.destroy();
