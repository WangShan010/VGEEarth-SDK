import { ResourceItem } from './Resource/ResourceItem';


/**
 * 配置项参数接口规范
 *
 * 最后修改日期：2022-03-18
 */
interface ConfigImpl {
    /** SDK 的版本号，可由开发者去自定义 */
    Version: string,
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

    layerList: ResourceItem [],
    terrainList: ResourceItem [],
    modelList: ResourceItem [],
    cesium3DTileSetList: ResourceItem [],
    geoJsonList: ResourceItem [],
    poiList: ResourceItem []
}

export { ConfigImpl };