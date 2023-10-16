VGEEarth.ConfigTool.addMapBoxOnLine(true);
// VGEEarth.ConfigTool.addTerrainOnAliYun(true);

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
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;


let pinBuilder = new Cesium.PinBuilder();

window.questionPin = earth.viewer3D.entities.add({
    name: 'Question mark',
    position: Cesium.Cartesian3.fromDegrees(108.97697, 32.05784),
    billboard: {
        image: pinBuilder.fromUrl('../../../../Src/img/简单标注点（装饰器）/士兵-1.png', Cesium.Color.GREEN, 48),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
});


let monitor = {
    title: 'Hls监控1',
    url: './搜索视频.mp4',
    type: 'mp4'
};


window.hls = new VGEEarth.SuperiorEntity.HlsVideoWindowDecorator(questionPin, monitor);
