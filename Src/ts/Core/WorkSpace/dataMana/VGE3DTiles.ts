import { Cesium3DTileset, Viewer } from 'cesium';
import { Cesium } from '../../Impl/Declare';
import { ResourceItem } from '../../Config/Resource/ResourceItem';
import { offSetTileSetByCartographic } from '../../../Utils/TileSetUtils/index';
import { VGEData } from './impl/VGEData';


// 3DTiles格式的数据，包括倾斜摄影、bim等生产的数据
class VGE3DTiles extends VGEData<Cesium3DTileset> {
    loadTileCallFunMap: Map<string, Function> = new Map<string, Function>();

    constructor(viewer: Viewer) {
        super(viewer);
    }

    async addData(sourceItem: ResourceItem): Promise<Cesium3DTileset> {
        let prop = sourceItem.properties;
        let url = prop.url;
        let queryParameters = prop.queryParameters || {};

        // 对地形进行深度测试
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        let resource = new Cesium.Resource({
            url,
            queryParameters
        });

        // 适应屏幕空间误差和内存使用的设备
        let isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };


        let tileSetOptions = {
            // show: true,//可选的 确定是否显示图块集。
            // // modelMatrix: Matrix4.IDENTITY,//可选的 一个 4x4 转换矩阵，用于转换图块集的根图块。
            // // shadows: ShadowMode.ENABLED,//可选的 确定图块集是投射还是接收来自光源的阴影。
            //
            // // 特别重要的 优化参数，默认为 8，最精细为 1
            // // @ts-ignore
            // maximumScreenSpaceError: 8,//	可选的 用于驱动细节细化级别的最大屏幕空间误差。
            //
            // // 优化项目，改为 4000
            // maximumMemoryUsage: 8192//可选的 ,//图块集可以使用的最大内存量（以 MB 为单位）。
            // cullWithChildrenBounds: true,//可选的 优化选项。 是否使用其子边界体积的并集来剔除瓷砖。
            // cullRequestsWhileMoving: false,//可选的 优化选项。 不要请求由于相机移动而返回时可能不会使用的图块。 此优化仅适用于固定的瓦片集。
            // cullRequestsWhileMovingMultiplier: 60.0,//可选的 优化选项。 移动时用于剔除请求的乘数。 较大的是更积极的剔除，较小的则是较不积极的剔除。
            //
            // // 优化项目，改为 true
            // preloadWhenHidden: true,//	可选的 预加载瓷砖时 tileset.show是 false. 加载图块，就好像图块集是可见的，但不渲染它们。
            // preloadFlightDestinations: true,//可选的 优化选项。 在相机飞行时在相机的飞行目的地预加载图块。
            // preferLeaves: true,//可选的 优化选项。 最好先装载叶子。
            // dynamicScreenSpaceError: true,//可选的 优化选项。 减少离相机较远的图块的屏幕空间误差。
            // dynamicScreenSpaceErrorDensity: 0.00278,//可选的 Density 用于调整动态屏幕空间误差，类似于雾密度。
            // dynamicScreenSpaceErrorFactor: 8,//可选的 用于增加计算的动态屏幕空间误差的因素。
            // dynamicScreenSpaceErrorHeightFalloff: 0.1,//可选的 密度开始下降时图块集高度的比率。
            // progressiveResolutionHeightFraction: 0.5,//可选的 优化选项。 如果在 (0.0, 0.5] 之间，则平铺等于或高于屏幕空间错误，以降低屏幕分辨率 progressiveResolutionHeightFraction*screenHeight将被优先考虑。 这有助于在继续加载全分辨率图块的同时快速降低图块层。
            // foveatedScreenSpaceError: true,//可选的 优化选项。 通过暂时提高屏幕边缘周围瓷砖的屏幕空间错误，优先加载屏幕中央的瓷砖。 一旦屏幕中心的所有图块由 Cesium3DTileset#foveatedConeSize被加载。
            // foveatedConeSize: 0.1,//可选的 优化选项。 何时使用 Cesium3DTileset#foveatedScreenSpaceError用于控制确定哪些图块被延迟的锥体大小是正确的。 该锥体内的图块会立即加载。 圆锥外的图块可能会根据它们在圆锥外的距离以及它们的屏幕空间误差而延迟。 这是由控制 Cesium3DTileset#foveatedInterpolationCallback和 Cesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation. 将此设置为 0.0 意味着锥体将是由相机位置及其视图方向形成的线。 将此设置为 1.0 意味着圆锥体包含相机的整个视野​​，从而禁用效果。
            // foveatedMinimumScreenSpaceErrorRelaxation: 0.0,//可选的 优化选项。 何时使用 Cesium3DTileset#foveatedScreenSpaceError对于注视锥外的图块，控制起始屏幕空间误差松弛是正确的。 从tileset值开始，屏幕空间错误将被提高到 Cesium3DTileset#maximumScreenSpaceError基于提供的 Cesium3DTileset#foveatedInterpolationCallback.
            // // foveatedInterpolationCallback  Cesium3DTileset.foveatedInterpolationCallback  Math.lerp,//可选的 优化选项。 何时使用 Cesium3DTileset#foveatedScreenSpaceError控制注视锥外的图块的屏幕空间误差增加多少是正确的，在两者之间进行插值 Cesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation和 Cesium3DTileset#maximumScreenSpaceError
            // foveatedTimeDelay: 0.2,//可选的 优化选项。 何时使用 Cesium3DTileset#foveatedScreenSpaceError用于控制在延迟块开始加载之前相机停止移动后等待多长时间（以秒为单位）。此时间延迟可防止在相机移动时请求屏幕边缘周围的块。 将此设置为 0.0 将立即请求任何给定视图中的所有图块。
            //
            //
            // skipLevelOfDetail: false,//可选的 优化选项。 确定是否应在遍历期间应用详细级别跳过。
            // baseScreenSpaceError: 1024,//可选的 什么时候 skipLevelOfDetail是 true，在跳过细节级别之前必须达到的屏幕空间错误。
            // skipScreenSpaceErrorFactor: 16,//可选的 什么时候 skipLevelOfDetail是 true，定义要跳过的最小屏幕空间错误的乘数。 配合使用 skipLevels以确定要加载的图块。
            // skipLevels: 0,//可选的 什么时候 skipLevelOfDetail是 true，定义加载图块时要跳过的最小级别数的常量。 当它为 0 时，不跳过任何级别。 配合使用 skipScreenSpaceErrorFactor以确定要加载的图块。
            // immediatelyLoadDesiredLevelOfDetail: false,//可选的 什么时候 skipLevelOfDetail是 true，只有满足最大屏幕空间错误的图块才会被下载。 跳过因素被忽略，只加载所需的图块。
            // loadSiblings: false,//可选的 什么时候 skipLevelOfDetail是 true, 确定在遍历过程中是否总是下载可见图块的同级。
            // //clippingPlanes  剪裁平面集合,//可选的 这 ClippingPlaneCollection用于有选择地禁用渲染图块集。
            // // classificationType  分类类型,//可选的 确定地形、3D 瓷砖或两者都将按此图块集分类。 看 Cesium3DTileset#classificationType有关限制和限制的详细信息。
            // //  ellipsoid  椭球体  Ellipsoid.WGS84,//可选的 决定地球大小和形状的椭球。
            // //  pointCloudShading  目的,//可选的 构建一个的选项 PointCloudShading对象根据几何误差和光照控制点衰减。
            // //  imageBasedLightingFactor  笛卡尔2  new Cartesian2(1.0, 1.0),//可选的 缩放来自地球、天空、大气和星空盒的基于漫反射和镜面反射图像的照明。
            // //  lightColor  笛卡尔3,//可选的 为模型着色时的浅色。 什么时候 undefined取而代之的是场景的光色。
            // luminanceAtZenith: 0.2,//可选的 用于此模型的程序环境贴图的太阳在天顶处的亮度，以每平方米千坎德拉为单位。
            // //  sphericalHarmonicCoefficients  数组。<Cartesian3>    ,//可选的 用于基于图像的照明的漫反射颜色的三阶球谐系数。
            // // specularEnvironmentMaps:,//可选的 KTX2 文件的 URL，其中包含镜面反射光照和复杂镜面反射 mipmap 的立方体贴图。
            // backFaceCulling: true,//可选的 是否剔除背面几何体。 当为 true 时，背面剔除由 glTF 材料的 doubleSided 属性决定； 当为 false 时，背面剔除被禁用。
            // showOutline: true,//可选的 是否使用 显示模型的轮廓 CESIUM_primitive_outline 扩展 。 当为真时，显示轮廓。 如果为 false，则不显示轮廓。
            // vectorClassificationOnly: false,//可选的 表示只应使用瓦片集的矢量瓦片进行分类。
            // vectorKeepDecodedPositions: true,//可选的 矢量切片是否应将解码位置保留在内存中。 这与 Cesium3DTileFeature.getPolylinePositions.
            // // debugHeatmapTilePropertyName,//可选的 要着色为热图的图块变量。 所有渲染的图块都将相对于彼此指定的变量值进行着色。
            // debugFreezeFrame: false,//可选的 仅用于调试。 确定是否只应使用最后一帧的图块进行渲染。
            // debugColorizeTiles: false,//可选的 仅用于调试。 如果为 true，则为每个图块分配随机颜色。
            // debugWireframe: false,//可选的 仅用于调试。 为 true 时，将每个图块的内容渲染为线框。
            // debugShowBoundingVolume: false,//可选的 仅用于调试。 当为 true 时，渲染每个图块的边界体积。
            // debugShowContentBoundingVolume: false,//可选的 仅用于调试。 为 true 时，为每个图块的内容呈现边界体积。
            // debugShowViewerRequestVolume: false,//可选的 仅用于调试。 为 true 时，呈现每个图块的查看器请求量。
            // debugShowGeometricError: false,//可选的 仅用于调试。 为 true 时，绘制标签以指示每个图块的几何误差。
            // debugShowRenderingStatistics: false,//可选的 仅用于调试。 为 true 时，绘制标签以指示每个图块的命令、点、三角形和特征的数量。
            // debugShowMemoryUsage: false,//可选的 仅用于调试。 当为真时，绘制标签以指示每个图块使用的纹理和几何内存（以兆字节为单位）。
            // debugShowUrl: false//可选的 仅用于调试。 当为 true 时，绘制标签以指示每个图块的 url。
        };

        for (const propKey in prop) {
            // @ts-ignore
            tileSetOptions[propKey] = prop[propKey];
        }

        let tileSet = await Cesium.Cesium3DTileset.fromUrl(resource, tileSetOptions);

        this.instancesMap.set(sourceItem.pid, tileSet);
        this.sourcesItems.push(sourceItem);

        // 设置模型的位置偏移修正
        let offset = prop.offset;
        let lon = offset?.lon;
        let lat = offset?.lat;
        let height = offset?.height;
        if (offset) {
            offSetTileSetByCartographic(tileSet, lon, lat, height);
        }

        tileSet = this.viewer.scene.primitives.add(tileSet);

        tileSet.loadProgress.addEventListener((numberOfPendingRequests: number, numberOfTilesProcessing: number) => {
            for (let [key, func] of this.loadTileCallFunMap) {
                func(sourceItem, numberOfPendingRequests, numberOfTilesProcessing);
            }
        });

        return tileSet;
    };


    async flyToByPid(pid: string): Promise<boolean> {
        let ds = this.getInstancesByPid(pid);
        if (ds) {
            return this.viewer.flyTo(ds, {
                offset: new Cesium.HeadingPitchRange(0, -3.14 / 2, 0)
            }).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        } else {
            return false;
        }
    }


    removeByPid(pid: string) {
        let removeRes = false;
        let tileSet = this.getInstancesByPid(pid);
        this.sourcesItems = this.sourcesItems.filter(item => item.pid !== pid);

        if (tileSet && !tileSet.isDestroyed()) {
            removeRes = this.viewer.scene.primitives.remove(tileSet);
            tileSet.destroy();
            this.instancesMap.delete(pid);
        }
        return removeRes;
    };

    destroy(): boolean {
        return this.removeAll();
    }
}


export { VGE3DTiles };
