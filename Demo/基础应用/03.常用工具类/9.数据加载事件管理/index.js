const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
const func = (e) => {
    alert('有新数据载入系统:' + JSON.stringify(e));
};
VGEEarth.EventMana.sourceEvent.addEventListener(
    VGEEarth.DataEventType.addData,
    VGEEarth.ScopeType.Viewer3D,
    func
);

// VGEEarth.EventMana.sourceEvent.removeEventListener(
//     func
// );
