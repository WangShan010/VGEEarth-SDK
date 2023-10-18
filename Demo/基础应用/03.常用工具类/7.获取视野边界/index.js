VGEEarth.ConfigTool.loadConfig({ homeView: { longitude: 120, latitude: 30, height: 1_0000 } });
VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

let viewerRect = [];
let debugLine = new Cesium.Entity({
    name: 'Red line on terrain',
    polyline: {
        positions: new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.fromDegreesArray(viewerRect);
        }),
        width: 5,
        material: Cesium.Color.RED,
        clampToGround: true
    }
});
earth.viewer3D.entities.add(debugLine);

VGEEarth.EventMana.screenEvent.addEventListener(
    VGEEarth.EventMana.ListenType.ScreenSpaceEventType.WHEEL,
    VGEEarth.EventMana.ScopeType.Viewer3D,
    function (e) {
        setTimeout(() => {
            viewerRect = VGEEarth.CameraUtils.getCameraRectanglePoint().flat(2);
        }, 400);
    }
);

VGEEarth.EventMana.screenEvent.addEventListener(
    VGEEarth.EventMana.ListenType.ScreenSpaceEventType.MIDDLE_UP,
    VGEEarth.EventMana.ScopeType.Viewer3D,
    function (e) {
        setTimeout(() => {
            viewerRect = VGEEarth.CameraUtils.getCameraRectanglePoint().flat(2);
        }, 100);
    }
);
