import { DataTypeEnum } from './DataTypeEnum';
import { ResourceItem } from './ResourceItem';

const OSMLayersList: ResourceItem[] = [
    {
        pid: 'b4d62340-c25a-03b2-460f-4f5d74e31d1e',
        name: 'OSM-标准地图',
        catalog: '电子地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
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
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
            minimumLevel: 0,
            maximumLevel: 19
        }
    }
];

export { OSMLayersList };
