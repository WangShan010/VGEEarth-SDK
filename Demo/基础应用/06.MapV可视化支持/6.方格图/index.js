/****************************************************************************
 名称：用于展示mapv方格图
 描述：MapV实例 详情请查看 https://mapv.baidu.com/examples/#baidu-map-point-grid.html


 最后修改日期：2022-03-14
 ****************************************************************************/

VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

VGEEarth.ConfigTool.loadConfig({ homeView: { longitude: 120, latitude: 35, height: 8000000 } });

const earth = new VGEEarth.Earth('MapContainer');
const viewer = earth.viewer3D;

earth.createNavigation();
earth.openDeBug();

let mapvLayers = createLayer();
//销毁图层，需要可以添加上
//destroy();


/**
 * 创建mapvLayer图层
 * @returns {*[]} 所创建的所有的mapvLayer图层
 */
function createLayer() {
    // 构造数据
    let positions = [];
    let geojson = [];
    let randomCount = 300;
    while (randomCount--) {
        let point = randomPoint();
        positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));

        geojson.push({
            geometry: {
                type: 'Point',
                coordinates: point
            },
            count: 30 * Math.random()
        });
    }

    //mapv图层参数
    let options = {
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        max: 100,
        size: 50,
        label: {
            show: true,
            fillStyle: 'white'
        },
        globalAlpha: 0.5,
        gradient: {
            0.25: 'rgb(0,0,255)',
            0.55: 'rgb(0,255,0)',
            0.85: 'yellow',
            1.0: 'rgb(255,0,0)'
        },
        draw: 'grid'
    };
    let dataSet = new mapv.DataSet(geojson);

    //创建MapV图层
    let mapVLayer = new VGEEarth.MapVLayer(viewer, dataSet, options);
    return [mapVLayer];
}

/**
 * 取区域内的随机点
 * @returns {number[]}
 */
function randomPoint() {
    let jd = 113.65276089 + Math.random() * 5;
    let wd = 28.310530293 + Math.random() * 5;
    return [jd, wd];
}

/**
 * 销毁图层
 */
function destroy() {
    mapvLayers.map(layer => {
        layer.destroy();
    });
    //viewer.entities.removeAll();
    //viewer.imageryLayers.removeAll(true);
    //viewer.destroy();
}
