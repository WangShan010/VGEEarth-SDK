const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
earth.viewer3DWorkSpace.addData({
    name: '自定义影像',
    catalog: '基础数据',
    dataType: 'layer',
    defaultLoad: true,
    properties: {
        scheme: 'layer-xyz-3857',
        url: 'https://vge-earth.oss-cn-beijing.aliyuncs.com/MapTile-google/{z}/{x}/{y}.png'
    }
});
