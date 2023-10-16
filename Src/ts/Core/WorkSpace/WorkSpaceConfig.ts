/****************************************************************************
 名称：资源图标

 最后修改日期：2021-09-09
 ****************************************************************************/

// 工作区间的数据的配置文件，主要设置数据的图标
const WorkSpaceDataIcons = {
    // 数据展示的图标
    'wj': 'wjIcon',
    'dataSet': 'DataSetIcon',
    'vrs': 'VRSIcon',
    'bim': 'BIMIcon',
    'las': 'LASIcon',
    'hole': 'HoleIcon',
    'pipe': 'PipeIcon',
    '3Dtiles': 'TILES_3D_Icon',
    'wms': 'TILESIcon',
    'layer-xyz-4326': 'TILESIcon',
    'layer-xyz-3857': 'TILESIcon',
    'geoserver': 'TILESIcon',
    'terrain': 'DEMIcon',
    'shp_polygon': 'PolygonFill_Icon',
    'shp_line': 'BrokenLine_Icon',
    'shp_point': 'Points_Icon',
    'isoline': 'ISOLineIcon',
    'lct': 'lct_Icon',
    // 功能区菜单的图标
    'wanderingThrough': 'myllIcon',
    'flightPath': 'fxljIcon',
    'oneCarRoaming': 'rcmyIcon',
    'surroundingBrowse': 'hrllIcon',
    'thematicData': 'ztsjIcon',
    'drillingData': 'zksjIcon',
    'BIMData': 'bimIcon',
    'formationModelData': 'dcmxIcon',
    'geologicalModelAnalysis': 'dzmxfxIcon',
    'stratigraphicModel': 'dcjmIcon',
    'peelingAnalysis': 'bcfxIcon',
    'tunnelAnalysis': 'sdfxIcon',
    'excavationAnalysis': 'kwfxIcon',
    'cuttingAnalysis': 'pqfxIcon',
    'fenceProfile': 'slpmIcon',
    'profile': 'pmtIcon',
    'surfaceWaveVelocityAnalysis': 'mbsfxIcon',
    'rectangularModel': 'jxmxIcon',
    'highlySplittings': 'gdbpIcon',
    'waveSplittings': 'bsbpIcon',
    'digAnalysis': 'wkfxIcon',
    'pointCloudAnalysis': 'dyfxIcon',
    'graphicData': 'txsjIcon',
    'set': 'setIcon',
    'weatherEffects': 'tqxgIcon',
    // 查询
    'query': 'cxIcon',
    'statistical': 'tjIcon',
    'appendageClassification': 'fswfltjIcon',
    'pipeClasses': 'glfltjIcon',
    'PipeDiameter': 'gjfltjIcon',
    'visual': 'ksyIcon',
    'coverage': 'tcglIcon',
    'modelManagement ': 'mxglIcon',
    'externalData': 'wbsjIcon'
};

// 工作区间的数据名称
const WorkSpaceDataNames = {
    'bim': '建筑模型',
    'las': '点云',
    '3DTiles': '三维模型',
    'layer-wms': '图层',
    'layer-wmts': '图层',
    'layer-arcgisMapServer': '图层',
    'layer-xyz-4326': '图层',
    'layer-xyz-3857': '图层',
    'layer-geoserver': '数据',
    'terrain': '高程',
    'shp_polygon': '矢量面',
    'shp_line': '矢量线',
    'shp_point': '矢量点'
};

let WorkSpaceConfig = {
    getIcon(map_type: string) {
        // @ts-ignore
        return WorkSpaceDataIcons[map_type];
    },

    getName(map_type: string) {
        // @ts-ignore
        return WorkSpaceDataNames[map_type];
    }
};


export { WorkSpaceConfig };
