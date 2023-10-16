VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;

let ds = [
    117.567, 31.8, 8,
    117.667, 31.8, 8
];

ds = [
    117.567, 31.85, 8,
    117.667, 31.85, 8
];

let entity = earth.viewer3D.entities.add({
    polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(ds),
        shape: [
            new Cesium.Cartesian2(-200, -200),
            new Cesium.Cartesian2(100, 200),
            new Cesium.Cartesian2(200, -200)
        ],
        cornerType: Cesium.CornerType.MITERED,
        material: new VGEEarth.Material.Polyline.PolylineVolumeTrialMaterial({
            color: Cesium.Color.RED,
            duration: 5000,
            count: 5
            // url: './polylinematerial/管道线材质.png' //材质图片"
        })
    }
});

earth.viewer3D.zoomTo(entity);






