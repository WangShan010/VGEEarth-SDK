/****************************************************************************
 名称：创建简易 OL 地图

 最后修改日期：2022-03-10
 ****************************************************************************/
function createOL() {
    const ol = window.ol;
    return new ol.Map({
        target: 'ol-container',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://t5.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=1814d83db8edd8e5b799a0d2128a9685'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
                })
            })
        ],
        view: new ol.View({
            center: [108.41, 34],
            zoom: 4,
            projection: 'EPSG:4326'
        }),
        controls: ol.control.defaults({ zoom: false })
    });
}
export { createOL };
