VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();


let customBgImage = new VGEEarth.CustomBgImage(earth.viewer3D, 0);
// let customBgImage = new VGEEarth.CustomBgImage(earth.viewer3D, 1);
// let customBgImage = new VGEEarth.CustomBgImage(earth.viewer3D, './backGroundImg.jpg');


customBgImage.init();

window.setCustomBgImage = function (index = 0) {
    customBgImage && customBgImage.remove();
    customBgImage = new VGEEarth.CustomBgImage(earth.viewer3D, index);
};

window.clearCustomBg = function () {
    customBgImage && customBgImage.remove();
};
