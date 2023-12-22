// 已添加的资源项
const addedResourceItemIds = [];
const ResourceItemList = [
    {
        pid: 'dd7813c4-dd2c-2ce4-7ff3-af62a8b97255',
        name: 'Bing Maps Aerial',
        catalog: '基础影像',
        dataType: 'layer',
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'IonImageryProvider',
            assetId: 2
        }
    },
    {
        pid: '5bc9728a-2ad1-8160-70c1-9ae4a14876a3',
        name: 'Bing Maps - 带标注',
        catalog: '基础影像',
        dataType: 'layer',
        showInTree: true,
        defaultLoad: false,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'IonImageryProvider',
            assetId: 3
        }
    },
    {
        pid: '8fe81f58-9d74-d69b-77d6-0d74ed44aa',
        name: '阿里云-全国影像',
        catalog: '基础影像',
        dataType: 'layer',
        showInTree: true,
        defaultLoad: false,
        show: true,
        netRootPaths: [
            'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/TMS-mapbox.satellite/'
        ],
        offlineCache: false,
        decryptionKey: 'SDcVrdKWEgjKPTGQgZ6zop3OTsYo1T3nQ9FwlxROAySNOzXhmdjpVyDn0dMqcODWtC6+62uXM2jbMt24vgGxxHTkguhelh5LXi+zJ9666ryOhtqhvWrBMe9yr2mFNhIKpDsu+2hTSZG7wU5lDvE492Y+Wp0N8BCXOBjwIaaVSQo=',
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/TMS-mapbox.satellite/{z}/{x}/{y}.webp',
            minimumLevel: 0,
            maximumLevel: 10
        }
    },
    {
        pid: 'b4d62340-c25a-03b2-460f-4f5d74e31d1e',
        name: 'OSM-标准地图',
        catalog: '电子地图',
        dataType: 'layer',
        showInTree: true,
        defaultLoad: false,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            minimumLevel: 0,
            maximumLevel: 19
        }
    },
    {
        pid: '4f95a081-89d4-8bc4-3dd8-597a875f49b5',
        name: 'OSM-等高线地图',
        catalog: '电子地图',
        dataType: 'layer',
        showInTree: true,
        defaultLoad: false,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
            minimumLevel: 0,
            maximumLevel: 19
        }
    },
    {
        pid: '8fe81f58-9d74-d69b-77d6-0d74a8ed44aa',
        name: 'Cesium-在线地形',
        catalog: '地形图层',
        dataType: 'terrain',
        showInTree: true,
        defaultLoad: false,
        show: true,
        offlineCache: false,
        netRootPaths: [],
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'default'
        }
    },
    {
        pid: 'edaa73e0-e49b-f701-f212-2556bc279dbd',
        name: '中国地形-加密版',
        catalog: '地形图层',
        dataType: 'terrain',
        showInTree: true,
        netRootPaths: [
            'https://webgpu.top:3006/DBService/中国地形-加密/'
        ],
        defaultLoad: true,
        show: true,
        offlineCache: false,
        decryptionKey: 'SDcVrdKWEgjKPTGQgZ6zogd1U+ipK9DavJ1ewW36F8z8yqDX/9QVR4sAhynFg2Xy/ysWfNtq6fQxaQISn8YvJ4PIYdseKHRCfjGCJME7FOAhbfNve5S5UiBIfNj7fxarGWMMDlIRO/boCyI5n29pgERtTKl/XWDttQTh4gZbFhlguOTJWlryE1YUg4zcLtQdIV1mB90viuoEJNnwa7CG3GVXZD894LKiyZMx1OtkrP+IZyRIRe2mLaH55FHOhqIF',
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'https://webgpu.top:3006/DBService/中国地形-加密/'
        }
    },
    {
        pid: 'd76023df-981d-d4d5-5f46-21864b706b0e',
        name: '天一阁-加密倾斜模型',
        catalog: '三维模型',
        dataType: 'Cesium3DTile',
        defaultLoad: true,
        show: true,
        offlineCache: true,
        netRootPaths: [
            'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/3DTiles-TianYi/'
        ],
        decryptionKey: '795bc22d-c487-6fd6-ec77-56849171d53d',
        properties: {
            url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/3DTiles-TianYi/tileset.json',
            maximumScreenSpaceError: 2,
            maximumMemoryUsage: 8192,
            offset: {
                height: 25
            }
        }
    },
    {
        pid: '12ce5b10-a1a3-ab79-998f-37822cedea41',
        name: '大雁塔-正常倾斜模型',
        catalog: '三维模型',
        dataType: 'Cesium3DTile',
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            url: 'https://webgpu.top:3006/DBService/3DTiles-DaYanTa/tileset.json',
            maximumScreenSpaceError: 2,
            maximumMemoryUsage: 8192
        }
    }
];

const resourceItemCode = document.getElementById('resourceItemCode');
const resourceItemSelect = document.getElementById('resourceItemSelect');

resourceItemCode.innerHTML = JSON.stringify(ResourceItemList[0], null, 4);
resourceItemSelect.innerHTML = ResourceItemList.map(item => {
    return `<option value="${item.name}">${item.name}</option>`;
}).join('');

const earth = new VGEEarth.Earth('MapContainer');

earth.openDeBug();
earth.createNavigation();

window.switchData = () => {
    const currentResourceItem = ResourceItemList.find(item => item.name === resourceItemSelect.value);
    resourceItemCode.innerHTML = JSON.stringify(currentResourceItem, null, 4);
};

window.addData = () => {
    const resourceItemStr = resourceItemCode.value;
    const resourceItem = JSON.parse(resourceItemStr);


    // 通过 SDK 向视图添加数据项
    earth.viewer3DWorkSpace.addData(resourceItem)
        .then(resourceInstance => {
                if (resourceItem) {
                    addedResourceItemIds.push(resourceItem.pid);
                    // 根据 pid 定位到数据项
                    earth.viewer3DWorkSpace.flyToDataByPid(resourceItem.pid);
                }
            }
        );
};

window.removeAllData = () => {
    addedResourceItemIds.forEach(id => {
        // 根据 pid 移除数据项
        earth.viewer3DWorkSpace.removeDataByPid(id);
    });
    addedResourceItemIds.length = 0;
};
