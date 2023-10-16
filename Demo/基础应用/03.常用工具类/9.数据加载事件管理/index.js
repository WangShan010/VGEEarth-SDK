const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
let func = function (e) {
    console.log('有新数据载入系统', e);
};
VGEEarth.EventMana.sourceEvent.addEventListener(
    VGEEarth.DataEventType.addData,
    VGEEarth.ScopeType.Viewer3D,
    func
);

// VGEEarth.EventMana.sourceEvent.removeEventListener(
//     func
// );
