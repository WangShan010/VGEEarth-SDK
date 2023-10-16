const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

window.getCameraInfo = function () {
    let info = VGEEarth.CameraUtils.getCameraInfo();
    alert(JSON.stringify(info));
};

