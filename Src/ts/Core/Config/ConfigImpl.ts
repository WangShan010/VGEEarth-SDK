import { ResourceItem } from './Resource/ResourceItem';


/**
 * 配置项参数的总体接口规范，用于约束配置项参数的类型。
 * 所有的配置项参数都应该遵循此接口规范。
 *
 * 最后修改日期：2022-03-18
 *
 *  @example
 *
 * // 可以通过：VGEEarth.ConfigTool.config 来访问此接口的实例，但不建议直接进行修改。
 * window.VGEEarth.ConfigTool.config
 *
 * // 可通过以下方式对配置项进行修改：
 * window.VGEEarth.ConfigTool.loadConfig(...)
 *
 *
 */


interface ConfigImpl {
    /** SDK 的版本号，可由开发者去自定义 */
    Version: string,
    /** 计算机的性能指标，用于调整 SDK 的性能参数 */
    computerSpeed: number,
    /** SDK 的 Token，用于与后台服务进行通信 */
    Token: string,
    /** 业务系统的名称 */
    appName: string,
    /** 显示在浏览器上 Tab 栏上的系统名称 */
    appTitle: string,
    /** 业务系统的图标 */
    appIcon: string,
    /** 数字地球的默认启动视角 */
    homeView: {
        longitude: number,
        latitude: number,
        height: number,
        headingRadians?: number,
        pitchRadians?: number,
        rollRadians?: number
    },
    /** 是否显示从全球旋转然后推进到默认视角的加载动画 */
    startAnimation: boolean,

    /** 演示服务器 基础路径 */
    demoServerUrl: string,
    /** 系统后台服务 基础路径 */
    AppBaseUrl: string,
    /** 静态资源服务器 基础路径 */
    GISResourcesUrl: string,

    /** GIS资源配置：图层、地形、gltf模型、倾斜模型、矢量、兴趣点 */
    layerList: ResourceItem [],
    terrainList: ResourceItem [],
    modelList: ResourceItem [],
    cesium3DTileSetList: ResourceItem [],
    geoJsonList: ResourceItem [],
    poiList: ResourceItem []
}

export { ConfigImpl };
