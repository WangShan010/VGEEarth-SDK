VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);


const earth = new VGEEarth.Earth('MapContainer', {
    animation: true,
    shouldAnimate: true,
    timeline: true
});
earth.createNavigation();
setView();

earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;
let plotTool = new VGEEarth.PlotTool(earth.viewer3D);
let pathData = [];
let path = new VGEEarth.PathRoaming(VGEEarth.getMainViewer(), {
    roamingType: '车辆漫游'
});


function accelerateUp() {
    let speed = path.getRoamingSpeed();
    console.log('speed:' + speed);
    path.setRoamingSpeed(speed + 10);
}

function accelerateDown() {
    let speed = path.getRoamingSpeed();
    console.log('speed:' + speed);
    path.setRoamingSpeed(speed - 10);
}

function setView() {
    let s = {
        pid: '1234567890',
        name: '大雁塔数据',
        catalog: '三维模型',
        dataType: 'Cesium3DTile',
        defaultLoad: true,
        properties: {
            url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
            maximumScreenSpaceError: 8,
            maximumMemoryUsage: 8192,
            offset: {
                // height: -800
            }
        }
    };

    let ds = earth.viewer3DWorkSpace.addData(s).then(() => {
        earth.viewer3DWorkSpace.flyToDataByPid(s.pid);
    });
}
