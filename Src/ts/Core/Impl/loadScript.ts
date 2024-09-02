import { DefaultConfig } from '../Config/DefaultConfig';

if (!window.VGEEarth_SDK_isLoaded) {
	window.VGEEarth_SDK_isLoaded = true;

	window.jQuery = window.$ = require('../../../ext/jQuery/^2.1.4/jquery-2.1.4.min.js');

	// 在 esbuild 打包机制下，直接在模块里打包会报错
	// window.h337 = require('../../../ext/heatmap/^2.0.5/heatmap.min.js');
	window.ol = require('../../../ext/ol/^6.14.1/ol.js');
	require('../../../ext/ol/^6.14.1/ol.css');
	window.turf = require('../../../ext/Turf/^6.5.0/turf.min.js');
	// 在 esbuild 打包机制下，直接在模块里打包会报错
	// window.DOMParser = require('../../../ext/xmdom/^0.6.0/lib/dom-parser.js').DOMParser;  // 标绘工具，用于解析 kml
	window.toGeoJSON = require('../../../ext/togeojson/^5.5.0/dist/togeojson.es.mjs');    // 标绘工具，用于将 kml 转化为转化 geoJson
	window.tokml = require('../../../ext/tokml/^0.4.0/tokml.js');                         // 标绘工具，用于将 geoJson 转化为转化 kml
	require('../../../ext/ztree/^3.5.48/js/jquery.ztree.all.min.js');
	require('../../../ext/file-saver/^2.0.5/FileSaver.min.js');
	window.html2canvas = require('../../../ext/html2canvas/^1.4.1/html2canvas.js');
	require('../../../ext/ztree/^3.5.48/css/zTreeStyle/zTreeStyle.css');

	if (window.Cesium) {
		console.log(`%c⭐ 开发工具包：%cVGEEarth%c${DefaultConfig.Version}%c，基于 Cesium ^${window.Cesium.VERSION}\n` +
			`‍💻 版权所有：虚拟地理实验室 VGELab\n` +
			`📀 帮助文档：http://8.146.208.114:8083`,
			'color:green;font-size:14px;font-weight: bold;',
			'padding: 0 5px; border-radius: 3px 0 0 3px; color: #fff; background: #e52; font-weight: bold;',
			'padding: 0 5px; border-radius: 0 3px 3px 0; color: #de3; background: #1c1c1c; font-weight: bold;',
			'color:green;font-size:14px;font-weight: bold;'
		);

		console.log(`%c🎁 预加载第三方模块：`,
			'color:green;font-size:14px;font-weight: bold;', {
				jQuery: '版本号：^2.1.4`',
				// heatmap: '版本号：^2.0.5`',
				Ol: '版本号：^6.14.1`',
				Turf: '版本号：^6.5.0`',
				xmdom: '版本号：^0.6.0`',
				FileSaver: '版本号：^2.0.5`',
				toGeoJSON: '版本号：^5.5.0`',
				Tokml: '版本号：^0.4.0`',
				ztree: '版本号：^3.5.48`',
				CesiumNetworkPlug: '版本号：^1.0.7`'
			});
	} else {
		console.log(`%cSDK版本：VGEEarth ${DefaultConfig.Version}，初始化失败：未检测到 Cesium`, 'color: green;');
	}
}
