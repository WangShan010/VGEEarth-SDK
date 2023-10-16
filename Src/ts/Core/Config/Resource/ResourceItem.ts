import { DataTypeEnum } from './DataTypeEnum';


interface LayerResourceItemProps {
    scheme: 'layer-xyz-3857' | 'layer-singleTileImagery',
    url: string,
    baseLayer?: boolean,
    minimumLevel: number,
    maximumLevel: number
}


/**
 * 资源项
 */
interface ResourceItem {
    pid: string,
    name: string,
    catalog: string,
    dataType: DataTypeEnum,
    showInTree: boolean,
    defaultLoad: boolean,

    netRootPaths?: string[],
    offlineCache: boolean,
    decryptionKey?: string,

    properties: LayerResourceItemProps | any;


    /*
    waterOptions;
    label;
    symbol;
    scheme;  // 当为 图层、地形 时的加载方案
    url: string,
    queryParameters: object;

    position: Cartographic;
    image_path;
    text_string;

    offset;  // 3DTile 时，需要偏移

    orientation?:any; // 需要设置旋转
     */
}

export { ResourceItem };