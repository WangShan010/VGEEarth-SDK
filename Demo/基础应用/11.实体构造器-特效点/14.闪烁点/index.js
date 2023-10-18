VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);


const earth = new VGEEarth.Earth('MapContainer');

let points = [
    [120.45332960278935, 29.505968155210237],
    [120.45377240762079, 29.50653022945677],
    [120.45372948529989, 29.506279211964337]
];

let colors = [Cesium.Color.RED, Cesium.Color.YELLOW, Cesium.Color.ORANGE];

let iconUrls = ['pos_red.png', 'pos_yellow.png', 'pos_orange.png'];


earth.thenLoadComplete().then(async () => {
//添加闪烁点
    for (let i = 0; i < points.length; i++) {
        let point = new VGEEarth.SuperiorEntity.AlertMarker(
            earth.viewer3D,
            { longitude: points[i][0], latitude: points[i][1] },
            {
                iconUrl: '../../../../Src/img/marker/' + iconUrls[i],
                color: colors[i]
            }
        );
        await point.init();
    }

    earth.viewer3D.zoomTo(earth.viewer3D.entities);
});


