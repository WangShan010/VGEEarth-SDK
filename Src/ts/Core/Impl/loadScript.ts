import { DefaultConfig } from '../Config/DefaultConfig';

if (!window.VGEEarth_SDK_isLoaded) {
    window.VGEEarth_SDK_isLoaded = true;

    window.jQuery = window.$ = require('../../../ext/jQuery/^2.1.4/jquery-2.1.4.min.js');
    window.h337 = require('../../../ext/heatmap/^2.0.5/heatmap.min.js');
    window.ol = require('../../../ext/ol/^6.14.1/ol.js');
    require('../../../ext/ol/^6.14.1/ol.css');
    window.turf = require('../../../ext/Turf/^6.5.0/turf.min.js');
    window.DOMParser = require('../../../ext/xmdom/^0.6.0/lib/dom-parser.js').DOMParser;  // 标绘工具，用于解析 kml
    window.toGeoJSON = require('../../../ext/togeojson/^5.5.0/dist/togeojson.es.mjs');    // 标绘工具，用于将 kml 转化为转化 geoJson
    window.tokml = require('../../../ext/tokml/^0.4.0/tokml.js');                         // 标绘工具，用于将 geoJson 转化为转化 kml
    require('../../../ext/ztree/^3.5.48/js/jquery.ztree.all.min.js');
    require('../../../ext/ztree/^3.5.48/css/zTreeStyle/zTreeStyle.css');
    require('../../../ext/CesiumNetworkPlug/^1.0.4/CesiumNetworkPlug.min.js');

    if (window.Cesium) {
        console.log(`%c⭐ 开发包：VGEEarth ${DefaultConfig.Version}，基于 Cesium ^${window.Cesium.VERSION}\n🧑‍💻 版权所有：版权所有：中国科学院空天信息创新研究院  虚拟地理环境工程实验室 VGE-Yao\n🎁 预加载第三方模块：`,
            'color: green;',
            {
                jQuery: '版本号：^2.1.4`',
                heatmap: '版本号：^2.0.5`',
                Ol: '版本号：^6.14.1`',
                Turf: '版本号：^6.5.0`',
                xmdom: '版本号：^0.6.0`',
                toGeoJSON: '版本号：^5.5.0`',
                Tokml: '版本号：^0.4.0`',
                ztree: '版本号：^3.5.48`',
                CesiumNetworkPlug: '版本号：^1.0.3`'
            });
    } else {
        console.log(`%cSDK版本：VGEEarth ${DefaultConfig.Version}，初始化失败：未检测到 Cesium`, 'color: green;');
    }
}
