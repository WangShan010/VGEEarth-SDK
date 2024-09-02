import { DataTypeEnum } from '../Enum/DataTypeEnum';
import { ResourceItem } from '../ResourceItem/ResourceItem';

const TerrainList: ResourceItem[] = [
    {
        pid: '8fe81f58-9d74-d69b-77d6-0d74a8ed44aa',
        name: 'Cesium-在线地形',
        catalog: '地形图层',
        dataType: DataTypeEnum.terrain,
        showInTree: true,
        defaultLoad: true,
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
        dataType: DataTypeEnum.terrain,
        showInTree: true,
        netRootPaths: [
            'https://bj.webgpu.top:3006/DBService/Terrain-China/'
        ],
        defaultLoad: true,
        show: true,
        offlineCache: false,
        decryptionKey: "SDcVrdKWEgjKPTGQgZ6zopwGq0R4FtrqQWPVsVdblFTKDA0q8vjiINRKLV16fdaYrRaZNwr613Mu/K5rMIkeXmku8nyAd7tTSNMULVZMrQc9+Qv4GMeu6vcPfRxY5Cn4R4O1VQWSbpoDkv9hwEsoIb8pHcs6JRlnbVBaEwna8T/R5EAy21YArQJcAOKJo2dejdSc3JKz1uLUSr/i0iMdFthhTGl3grgzySDVLfMrUjA=",
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'https://bj.webgpu.top:3006/DBService/Terrain-China/'
        }
    }
];

export { TerrainList };
