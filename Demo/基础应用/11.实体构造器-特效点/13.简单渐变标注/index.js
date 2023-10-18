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
dom.innerHTML = `<div style="text-align: left">
<div>经度：54515</div>
<div>纬度：54515454</div>
<div>高程：54515</div>
</div>`;


let point = new VGEEarth.SuperiorEntity.GradientLabelPoint(
    earth.viewer3D,
    {
        longitude: 108.97697,
        latitude: 32.05784
    },
    dom
);

point.init();

window.point = point;
