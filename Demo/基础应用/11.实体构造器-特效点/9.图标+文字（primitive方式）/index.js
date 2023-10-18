VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;
let point = new VGEEarth.SuperiorEntity.PrimitiveLabelCol(earth.viewer3D);
fetch('./css/mudi-all.json ')
    .then(res => res.json())
    .then(res => {
        res.data.forEach(item => {
            const position = Cesium.Cartesian3.fromDegrees(Number(item.lng), Number(item.lat));
            const label = item.text;
            point._add(position, label, './css/mark3.png');
        });
    });


