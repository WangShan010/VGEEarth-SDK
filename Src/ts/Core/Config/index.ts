/**
 * 全局配置信息管理模块
 *
 * 本模块主要用于管理配置系统的以下三类信息：
 *
 * ① 数据资源，包括地形、影像、模型、矢量数据等
 *
 * ② 服务地址，业务系统的服务地址、资源服务地址等
 *
 * ③ 行为配置，包括是默认视窗范围、是否有载入动画等
 *
 * @packageDocumentation
 */


export { BingMapLayerList } from './Resource/BingMapLayerList';
export { MapBoxLayerList } from './Resource/MapBoxLayerList';
export { OSMLayersList } from './Resource/OSMLayerList';
export { ResourceItem } from './Resource/ResourceItem';
export { TerrainList } from './Resource/TerrainList';
export { ConfigImpl } from './ConfigImpl';
export { ConfigTool } from './ConfigTool';
export { DefaultConfig } from './DefaultConfig';
export { Ion } from './Ion';
