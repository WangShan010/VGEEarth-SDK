# VGEEarth SDK 基础开源版

**VGEEarth SDK** 是虚拟地理环境工程实验室开发的一套基于 Cesium 的拓展功能函数库，内部封装了数十个常用功能模块，并可快速接入搭建应用系统。



该版本是根据 **VGEEarth SDK 高级版** 拆分出的基础功能简化版，保留基本的框架结构和常用的库。

更多高级模块，待后续放出示例....

| 信息                   | 描述                                              |
| ---------------------- | ------------------------------------------------- |
| 基础开发平台（开源版） | https://github.com/WangShan010/MetaVGE-3DVis-Vue3 |
| VGEEarth SDK（开源版） | https://github.com/WangShan010/VGEEarth-SDK       |
| 最新版本               | 2023 年 10 月 18 日                               |
| 交流群                 | QQ 交流群：869192861                              |
| 版权所有               | © 2018 - 2023 VGELab（虚拟地理环境工程研究室）    |







## 命名规范

在工程中，一般我们会用 **Utils** 、**Helper**、**Tools** 的包名来封装一些通用的工具类。单单从字面上来看，两者都可以表示工具的意思，但往往并不能做出比较精准的定义。



以下是本人对包的定义及理解：

| 包名尾缀   | 定义                                                   | 方法或属性                                                   | 举例                        |
|--------| ------------------------------------------------------ | ------------------------------------------------------------ | --------------------------- |
| Utils  | 通用的且与项目业务无关的类的组合；可供其他项目使用     | 方法通常是public static的；一般无类的属性，如果有，也是public static的 | 字符串工具类,文件工具类等   |
| Helper | 强调辅助作用的类，通常表示一些特定任务或场景的辅助代码 | 有状态（类的成员变量），一般需要创建实例才能使用。           | 视角限制类，绕点旋转类      |
| Tools  | 当前项目中通用的业务类的组合；仅能当前项目使用         | 不限                                                         | 用户校验工具类,支付工具类等 |



## 1.系统参数配置工具

- API：`VGEEarth.ConfigTool.*`

- 类型：对象 Object

- 描述：系统参数配置 的操作工具。

  > 在项目业务中，通过原生 Cesium 管理图层、影像、模型是一件非常繁琐的工作。在项目业务中还可能经常需要对以上各类 GIS 资源做加载、编辑、移除以及权限管理。
  >
  >
  >
  > ConfigTool 就是一个专门管理项目 `配置参数` 的一个接口工具，通过这个工具可以灵活的对系统的各项配置、资源进行控制。

- 标签：2022-05-05

- 结构体

```tsx
const ConfigTool = {
	// 获取系统当前的配置参数
    getConfig(): ConfigImpl {},
	// 设置配置参数
    loadConfig(C: ConfigImpl) {},
	// 添加资源
    addSourcesItem(item: any) {},
	// 根据 pid 获取资源
    getSourcesItemByPid(pid: string) {},
	// 获取全部的资源，以数组的方式返回
    getAllSources() {},
	// 获取当前 Viewer 的底图
    getBaseLayer() {}
};
```



- 使用示例

本示例展示如何在系统加载时，默认载入一份影像数据

```js
const config = {};
config.layerList = [{
    name: '自定义影像',
    catalog: '基础数据',
    dataType: 'layer',
    defaultLoad: true,
    properties: {
        scheme: 'layer-xyz-3857',
        url: 'https://vge-earth.oss-cn-beijing.aliyuncs.com/MapTile-google/{z}/{x}/{y}.png'
    }
}];
VGEEarth.ConfigTool.loadConfig(config);
```

> Demo：VGEEarth\Demo\基础应用\05.加载资源\2.完整可用资源树\index.html





## 2.地球视图类

- API：`new VGEEarth.Earth()`

- 类型：构造函数

- 描述：核心模块，用于创建地球的构造类
- 标签：2022-05-05

- 结构体

```js
class Earth {
    viewer2D: Viewer | undefined;
    viewer2DWorkSpace: WorkSpace | undefined;
    
    // 场景中的主 Viewer 对象
    viewer3D: Viewer;
    viewer3DWorkSpace: WorkSpace;
    viewerOl: any;
    is2D3D: boolean;
    loadComplete: boolean;
    overviewMap: OverviewMap | undefined;
    linkOLMap23D: LinkOLMap23D | undefined;
    
    // 默认生成的量测工具
    measureTool: MeasureTool;
    // 默认生成的标绘工具
    plotTool: plotTool;

    /**
     * 创建新的 viewer 对象
     * @param domID     创建球的父容器（div 的 id）
     * @param option    viewer 的原参数，参照 new Cesium.Viewer(id,option)
     */
    constructor(domID: string, option: any = {}) {}
    // 初始化屏幕事件
    initViewer3DScreenEvent() {}
    // 开启 Cesium 二三维联动
    openCesiumMapLink23d() {}
    // 关闭 Cesium 二三维联动
    closeCesiumMapLink23d() {}
    // 切换显示隐藏 2D视图
    toggleCesiumMapLink23d() {}
    // 开启鹰眼地图
    openOverviewMap() {}
    // 关闭鹰眼地图
    closeOverviewMap() {}
    // 开启 OL 二三维联动
    openOLMapLink23d(){}
    // 关闭 OL 二三维联动
    closeOLMapLink23d() {}
    // 切换显示 OL 二三维联动
    toggleOLMapLink23d() {}
    // 开启调试模式
    openDeBug(){}
    // 关闭调试模式
    closeDeBug() {}
    // 创建指北针
    createNavigation(){};
    // 初始化坐标与高度的监听
    initMonitorCoordinates = initMonitorCoordinates;
}
```



- 使用示例

```js
let earth = new VGEEarth.Earth('MapContainer');
```

> Demo：VGEEarth\Demo\基础应用\01.起步\2.文件引入-正式发布版\index.html



## 3.事件管理器

- API：`VGEEarth.EventMana.*`

- 类型：对象 Object

- 描述：在原生API基础上，再次封装了一层事件管理器

  > ① Cesium 原生事件管理体系更接近底层，其主要关注的是操作事件以及资源事件。
  >
  > ② 而我们更关注业务层面的事件，例如：二三维视图变化、鼠标事件、资源数据载入移除、配置参数发生更改。所以就需要专门编写一个事件管理器，来管理这些业务事件，例如：配置参数发生改变后，将更新资源树状图控件。

- 标签：2022-05-05

- 结构体

```tsx
const eventMana = {
    ScopeType: ScopeType,
    ListenType: ListenType,
    configEvent: new ConfigEvent(),
    screenEvent: new ScreenEvent(),
    sourceEvent: new SourceEvent(),
    viewerEvent: new ViewerEvent()
};
```



3.1 ScopeType

类型：枚举对象 Object

描述：事件的作用域，分为全局、三维视图、二维视图、ol视图

```tsx
enum ScopeType {
    global,
    Viewer3D,
    Viewer2D,
    initOL
}
```



3.2 ListenType

描述：事件类型

```js
let ListenType = {
    // 配置参数事件类型
    ConfigEventType,
    ViewerEventType,
    // 与 Cesium.ScreenSpaceEventType 相同
    ScreenSpaceEventType,
    // 与 Cesium.CameraEventType 相同
    CameraEventType,
    // 资源数据事件类型
    DataEventType
};
```



3.3.Event实现类

描述：事件类型

- configEvent
- screenEvent
- sourceEvent
- viewerEvent

以上对象实现类全部继承于：

```tsx
class BaseEvent implements EventImpl {
    listenCallbacks: listenItem[];

    constructor() {
        this.listenCallbacks = [];
    }

    addEventListener(listenType: number, scope: ScopeType, callback: any): boolean { }

    raiseEvent(listenType: number, scope: ScopeType, param: any): void {}

    removeEventListener(callback: any): boolean {  }
}
```





3.4.使用示例

```js
let earth = new VGEEarth.Earth('MapContainer');

VGEEarth.EventMana.sourceEvent.addEventListener(
    VGEEarth.EventMana.ListenType.DataEventType.addData,
    VGEEarth.EventMana.ScopeType.Viewer3D,
    function (e) {
        console.log('有新数据载入系统', e);
    }
);
```

> Demo：VGEEarth\Demo\基础应用\03.常用工具类\13.数据加载事件管理\index.html







## 4.事件句柄控制器

- API：`new VGEEarth.HandlerMana.getHandle()`

- 类型：全局方法 Function

- 描述：事件句柄控制器

  >  名称：事件句柄控制器
  >  设想：设计思路，运行时每个viewer对象存在两个handle，一个是一直运行的 runningHandle,一个是运行时的 runtimeHandle，
  >  运行时 runtimeHandle 执行时会让一直运行的 runningHandle 暂时停止运行，当检测到运行时 runtimeHandle 销毁后，
  >  一直运行的 runningHandle 继续运行。一个运行时 runtimeHandle 会把前一个正在运行的运行时 runtimeHandler 销毁，销毁时会
  >  执行提前绑定好的errCallback函数，并返回绑定好的errCallbackScope回调参数
  >
  >
  >
  >  这个场景主要适用于系统全局的默认事件句柄获取，注册事件后一定要主动销毁，没有被动销毁，不然程序会报错

- 标签：2022-05-05

- 使用示例

```js
VGEEarth.HandlerMana.getHandle();
```



## 5.资源树状图控件

- API：`new VGEEarth.TreeMana.ZTreeMana()`

- 类型：构造函数

- 描述：可以将 ConfigTool （系统参数配置工具）的各类【影像、地形、模型、矢量】资源映射为一个可操作的树状图，而实现数据资源的加载、移除、查询等

- 示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="../../../../Ext/Cesium/^1.98/Cesium.js"></script>
    <link rel="stylesheet" href="../../../../Ext/Cesium/^1.98/Widgets/widgets.css">
    <script src="../../../../Src/dist/VGEEarth.js"></script>
    <style>
        #treeDom {
            position: absolute;
            top: 5px;
            left: 80px;
            width: 500px;
            z-index: 10;
            background-color: rgba(195, 227, 190, 0.5);
            border-radius: 10px;
        }
    </style>
</head>
<body>
<div id="treeDom" class="ztree"></div>
<div id="MapContainer"></div>
<script>
    let earth = new VGEEarth.Earth('MapContainer');

	let t = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D);
</script>
</body>
</html>
```





## 6.拓展 Entity 实体

- 类型：对象 Object

- 描述

  >Cesium 提供了配套的原生 Entity 几何三维实体，但这些接口可能不太满足项目的业务需求。
  >我们将一些 【常用Entity】、【特效实体材质】、【 DOM + Entity】、【实体构造工厂】 进行封装。
  >以降低项目开发过程中的工作量

- 标签：2022-05-05

- 结构体

```js
let ExpandEntity = {
    Material,
    NormalEntity,
    SuperiorEntity,
    EntityFactory
};
```



### 6.1 普通entity

略



### 6.2 特殊entity

6.1.1 AreaLabel

+ 描述：区域标注

6.1.2 DeviceStatusWindow

+ 描述：设备状态窗口

6.1.3 LeafletWindow

+ 描述：leaflet风格弹窗

6.1.4 MultFieldAdaptWindow

+ 描述：多字段自动适配窗口，根据字段字符段长度设置label的宽度不限字段数量，动态设置字段与字段值

6.1.5 PopupWindow1

+ 描述：气泡窗口样式1

6.1.6 PopupWindow2

+ 描述：气泡窗口样式2

6.3 动态线entity

6.3.1 PolylineArrow

+ 描述：箭头线

6.3.2 PolylineEnergyTrans

+ 描述：传输线

6.3.3 PolylineLighting

+ 描述：发光线

6.3.4 PolylineLinkPulse

+ 描述：脉冲线、迁徙线

6.3.5 PolylineSprite

+ 描述：精灵线

6.3.6 PolylineSuper

+ 描述：超级线

6.3.7 PolylineTrail

+ 描述：尾迹线

6.3.8 PolylineVolumeTrial

+ 描述：流动管线

+ 使用示例



6.3.9 FlyCylinder

+ 类型：类class
+ 描述：一个投影圆柱体，如一条无人机航线上无人机向下投影的圆柱体/圆锥体

6.3.10 GlowLine

+ 描述：条光晕线

## 7.键盘控制工具类

- API：`VGEEarth.KeyboardDominate`

- 类型：对象 Object

- 描述：将键盘控制的三个类（KeyboardCamera、KeyboardModel、KeyboardModelExt）封装为一个接口

- 标签：2022-05-06

- 结构体

  ~~~js
  let KeyboardDominate = {
      KeyboardCamera,
      KeyboardModel,
      KeyboardModelExt
  };
  ~~~

7.1 KeyboardCamera

- 类型：对象 Object

- 描述：视角移动 使用键盘控制视角移动

- 标签：2022-05-06

- 结构体

  ~~~js
  class KeyboardCamera {
      constructor(_viewer: Viewer) {}
      // 激活键盘控制
      activate() {}
      // 移除键盘控制
      deactivate() {}
  }
  ~~~

- 使用示例

  ~~~js
  let keyboardCamera = new VGEEarth.KeyboardDominate.KeyboardCamera(viewer);
  keyboardCamera.activate();
  ~~~

  > Demo：VGEEarth\Demo\基础应用\8.键盘控制\1.视角控制\index.html

7.2 KeyboardModel

- 类型：对象 Object

- 描述：模型移动 使用键盘移动模型

- 标签：2022-05-06

- 结构体

  ~~~tsx
  interface KeyboardModelOptions {
      modelUrl: string,			//模型路径
      scale: number,				//模型缩放比例
      minimumPixelSize: number,	//模型显示最小像素大小
      angle: number,				//转弯角度大小 越大转得越快
      speed: number				//速度
  }
  class KeyboardModel {
      constructor(_viewer: Viewer, _position: Cartesian3, _options: KeyboardModelOptions) {}
      //激活键盘开始控制模型
      activate(){}
      //移除模型并结束模型控制
      deactivate(){}
  }
  ~~~

- 使用示例

  ~~~js
  this.keyboardModel = new VGEEarth.KeyboardDominate.KeyboardModel(this.viewer, position, {
      modelUrl: './xiaofangche.gltf',
      scale: 50,
      minimumPixelSize: 20,
      angle: 1, //转弯角度大小 越大转得越快
      speed: 1 //速度
  });
  this.keyboardModel.activate();
  ~~~

  > Demo：VGEEarth\Demo\基础应用\8.键盘控制\2.模型控制\index.html

7.3 KeyboardModelExt

- 类型：对象 Object

- 描述：模型移动扩展，扩展了移动模型类，支持第一视角移动

- 标签：2022-05-06

- 结构体

  ~~~tsx
  interface KeyboardModelExtOptions {
      modelUrl: string,			//模型路径
      scale: number,				//模型缩放比例
      minimumPixelSize: number,	//模型显示最小像素大小
      angle: number,				//转弯角度大小 越大转得越快
      speed: number				//速度
      role: number,				//0 自由视角 1 第一视角
      aotuPickHeight: boolean		//是否拾取高程
  }
  class KeyboardModelExt {
      constructor(_viewer: Viewer, _position: Cartesian3, _options: KeyboardModelExtOptions) {}
      //激活键盘开始控制模型
      activate(){}
      //移除模型并结束模型控制
      deactivate(){}
  }
  ~~~

- 使用示例

  ~~~js
  this.keyboardModel = new VGEEarth.KeyboardDominate.KeyboardModelExt(this.viewer, position, {
      modelUrl: "./xiaofangche.gltf",
      scale: 10,
      minimumPixelSize: 20,
      angle: 1, //转弯角度大小 越大转得越快
      speed: 1, //速度,
      role: 1, //0 自由视角 1 第一视角
      aotuPickHeight: false //是否拾取高度
  });
  this.keyboardModel.activate();
  ~~~

  > Demo：VGEEarth\Demo\基础应用\8.键盘控制\3.第一视角\index.html



## 8.地图重置

- 类型：全局方法 Function

- 描述：重置地球：清除当前界面全部的操作结果，并初始化 Earth
- 标签：2022-05-05

- 使用示例

```js
VGEEarth.restMap();
```



## 9.获取 Viewer 视图

- 类型：全局方法 Function

- 描述：获取主视图 viewer 球对象
- 标签：2022-05-05

- 使用示例

```js
let viewer = VGEEarth.getMainViewer();
```





## 10.坐标采集工具

- API：`new VGEEarth.DrawShape()`

- 类型：构造函数

- 描述：核心模块，可在地图上进行【画点】、【画线】、【画多折线】、【画角度】、【画多边形】、【画圆】、【画矩形】、【画斜矩形】操作，返回该几何图形的坐标

- 标签：2022-05-05

- 结构体

  ```jsx
  class DrawShape {
      constructor(viewer: Viewer) {  }
      // 画点函数
      drawPoint({coordinateType, endCallback, moveCallback, errCallback}: any) {};
      // 画线函数
      drawLine({coordinateType, endCallback, moveCallback, errCallback}: any){};
      // 画多折线
      drawPolyLine({coordinateType, endCallback, moveCallback, errCallback}: any){};
      // 画角度
      drawTriangle({coordinateType, endCallback, moveCallback, errCallback}: any) {};
      // 画多边形
      drawPolygon({coordinateType, endCallback, moveCallback, errCallback}: any){};
      // 画圆
      drawCircle({coordinateType,endCallback, moveCallback, errCallback}: any) {};
      // 画矩形
      drawRectangle({coordinateType, endCallback, moveCallback, errCallback}: any) {};
      // 画斜距形
      drawInclinedRectangle({coordinateType, endCallback, moveCallback, errCallback}: any){};
  }
  ```

  coordinateType：返回的坐标格式，可选：

    - cartesian：```[{x: -1708218.500471409, y: 5211816.659704349, z: 3247022.1648146017}];```
    - cartographicObj：```[{longitude: 108.147, latitude: 30.795, height: 1145.012}];```
    - cartographicPoiArr：```[[108.14700948231935, 30.795471733827313, 1145.012060885598]];```



- 使用示例

```js
let earth = new VGEEarth.Earth('MapContainer');
let ds = new VGEEarth.DrawShape(earth.viewer3D);
ds.drawLine({})
```

> Demo：VGEEarth\Demo\基础应用\04.业务模块类\02.坐标采集工具\index.html





## 11.路径规划工具

- API：`new VGEEarth.PlotTool(viewer)`

- 类型：构造函数

- 描述：核心模块，在坐标采集工具的基础上封装的标绘工具

- 标签：2022-05-05

- 结构体

  ```jsx
  class PathPlanning {
      constructor(viewer) {}
      // 选取起始点
      async takeStartingPoint() {}
      // 选取终点
      async takeEndPoint() {}
      // 选取途径点
      async takePassPoint(){}
      // 选取避让区
      async takeAvoidRange() {}
      // 清除途径点
      clearPassPoint() {}
      // 清除避让区
      clearAvoidRanges() {}
      // 清空规划路线结果
      clearRoads() {}
      // 根据路径规划结果，生成路径实体
      buildPathEntity(pathIndex: number = 0) {}
      // 执行路径规划
      async runNavigation() {}
      // 重置路径规划工具全部数据
      resetNavigation() {}
  }
  ```

- 使用示例

```js
let earth = new VGEEarth.Earth('MapContainer');
let ds = new VGEEarth.PathPlanning(earth.viewer3D);
```

> Demo：VGEEarth\Demo\基础应用\04.业务模块类\01.路径规划\index.html





## 12.量测工具

- API：`new VGEEarth.MeasureTool()`

- 类型：构造函数

- 描述：核心模块

- 标签：2022-05-05

- 结构体

  ```tsx
  class MeasureTool {
      constructor(viewer: any) {}
      // 三角量距
      CesiumTriangle(){}
      // 测量角度
      measureTriangle() {}
      // 垂直距离
      verticalDistance() {}
      // 测量空间距离
      spaceDistance() {}
      // 测量点高度
      measureHeight() {}
      // 空间面积
      surfaceArea() {}
      // 周长
      perimeter(){}
      // 移除所有模型
      removeAll() {}
  }
  ```

- Demo

  ```js
  earth.measureTool.measureHeight()
  ```

  > Earth 在初始化时，已经预先实例化了一个量测工具，可直接使用



## 13.标绘工具

- API：`new VGEEarth.PlotTool()`

- 类型：构造函数

- 描述：核心模块，在坐标采集工具的基础上封装的标绘工具

- 标签：2022-05-05

- 结构体

  ```tsx
  class PlotTool {
      constructor(viewer: Viewer) {}
      // 导入外部文件资源
      inputFileData({errFunc, endFunc}: any = {}) {}
      // 保存为 GeoJson 文件
      SaveAsGeoJson(func: any) {}
      // 保存为 Kml 文件
      SaveAsKML(func: any) {}
      // 添加标注点
      addPoint(name: string, markerSymbol: string) {}
      // 添加标注线
      addMultiLine(strokeMaterial: string, func: any) {}
      // 添加标注面
      addPolygon(func: any){}
      // 撤销操作
      revoke() {}
      // 清空标注结果
      removeAll() {}
      // 销毁标绘工具
      destroy() {}
  }
  ```

- 使用示例

```js
let earth = new VGEEarth.Earth('MapContainer');
let plotTool = new VGEEarth.PlotTool(earth.viewer3D);
```

> Demo：虚拟地理环境三维可视化平台 => 工具箱 => 图上标绘



## 14.3Dtiles工具类

- API：`VGEEarth.TileSetPlugin.*`

- 类型：对象 Object

- 描述

  > 3DTileset模型【模块】
  >
  > 可用于实现3DTileset模型的“裁剪”、“热力图”、“编辑”、“部分可见”等。

- 标签 2022-03-23

- 结构体

```js
let TileSetPlugin = {
  Heatmap,
  PositionEditor,
  TilesetClip,
  PartVisible,
  setTileSetHeight
}
```

14.1 Heatmap

+ 类型：类class
+ 描述：热力图类，用于实现热力图相关功能

+ 使用示例



14.2 PartVisible

+ 类型：类class
+ 描述：部分可见工具类

> Demo：VGEEarth\Demo\基础应用\05.加载资源\9.部分可见\index.html

14.3 PositionEditor

+ 类型：类class
+ 描述：Cesium3DTileset 交互编辑类
+ 标签：2022-03-23
+ 构造函数

```tsx
import { Viewer, Cesium3DTileset } from "cesium"

type params = { 
    rx: number,
    ry: number,
    rz: number,
    latitude: number,
    longitude: number,
    height: number,
    scale: number
}

class PositionEditor {
    constructor(
        _viewer: Viewer,    
        _tileset: Cesium3DTileset,  
        _params?: params
    )
    // 激活(构造时会执行)
    activate():void
    // 冻结
    deactivate():void
    // 获取参数
    getParams():params
}
```

+ 使用示例

```js

```

14.4 TilesetClip

+ 类型：类class
+ 描述：Cesium3DTileset 裁剪工具类
+ 标签：2022-03-23
+ 构造函数

```tsx
import { Viewer, Cartesian3, Cesium3DTileset } from "cesium"

class TilesetClip {
    constructor(_viewer: Viewer)
    // 添加裁剪
    add(
        positions: Cartesian3[],    // 裁剪的位置
        _tiles: Cesium3DTileset     // 所裁剪的瓦片
    ):void
    // 清空
    clear():void
}
```

+ 使用示例

```js

```

14.5 setTileSetHeight

+ 类型：全局方法 Function
+ 描述：设置Cesium3DTileset的高度
+ 接口

```tsx
import {Cesium3DTileset} from "cesium";

function setTileSetHeight(
    tileset: Cesium3DTileset,
    height: number  // 高度
){}
```

+ 使用示例

```js
VGEEarth.TileSetPlugin.setTileSetHeight(tileset, height)
```

