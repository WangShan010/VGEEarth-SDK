
VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);

VGEEarth.ConfigTool.loadConfig({
    homeView: {
        longitude: 108.9882,
        latitude: 32.06822,
        height: 2799.40946,
        headingRadians: 3.857331164336868,
        pitchRadians: -0.418174472030965,
        rollRadians: 6.283136533129425
    }
});

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;


let dom = document.createElement('div');
dom.innerHTML = '<div>测试2</div>';
dom.style.width = '300px';
dom.style.height = '100px';

let pinBuilder = new Cesium.PinBuilder();

window.questionPin = earth.viewer3D.entities.add({
    name: 'Question mark',
    position: Cesium.Cartesian3.fromDegrees(108.97697,32.05784,2015.6),
    billboard: {
        image: pinBuilder.fromUrl('./士兵-1.png', Cesium.Color.GREEN, 48),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
});


questionPin.D = new VGEEarth.SuperiorEntity.SimpleLabelDecorator(questionPin, dom);
