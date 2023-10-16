let layers = [
    {
        name: '自定义影像',
        catalog: '基础数据',
        dataType: 'layer',
        defaultLoad: true,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://vge-earth.oss-cn-beijing.aliyuncs.com/MapTile-google/{z}/{x}/{y}.png'
        }
    }
];

for (let i = 0; i < layers.length; i++) {
    VGEEarth.ConfigTool.addSourcesItem(layers[i]);
}

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
let t = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D);


