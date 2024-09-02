import { DataTypeEnum } from '../Enum/DataTypeEnum';
import { ImageryLayerProps } from './ImageryLayerProps';
import { Cesium3DTileProps } from './Cesium3DTileProps';


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
    show: boolean,
    netRootPaths?: string[],
    offlineCache: boolean,
    decryptionKey?: string,

    properties: ImageryLayerProps | Cesium3DTileProps | any;
}


export { ResourceItem };
