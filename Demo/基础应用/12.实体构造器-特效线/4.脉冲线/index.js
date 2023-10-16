VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;

let lines = [
    [
        { x: -1705722.7375782044, y: 5456272.240635795, z: 2818985.3064158773 },
        { x: -1707465.3050721162, y: 5455799.126313257, z: 2818846.9912274643 },
        { x: -1709648.901559206, y: 5455193.614325796, z: 2818696.3690761398 }
    ],
    [
        { x: -1705743.9778158371, y: 5456179.3424243955, z: 2819151.1387875197 },
        { x: -1708235.6078501693, y: 5455529.657677858, z: 2818901.457562383 },
        { x: -1709625.693373575, y: 5455126.525294995, z: 2818839.3192474963 }
    ]
];
let colors = [Cesium.Color.RED, Cesium.Color.AQUA];
lines.forEach((item, index) => {
    let entity = earth.viewer3D.entities.add({
        polyline: {
            positions: item,
            width: 12,
            material: new VGEEarth.Material.Polyline.PolylineLinkPulseMaterial({
                color: colors[index],
                duration: 5000 //时间 控制速度
                // url: './polylinematerial/脉冲线材质.png' //材质图片"
            }),
            clampToGround: true
        }
    });

    earth.viewer3D.zoomTo(entity);

});



