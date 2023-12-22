import './css/index.js';
import * as VGEEarth from './ts/vge.earth.core';
import { Cesium } from './ts/Core/Impl/Declare';

// @ts-ignore
VGEEarth.VERSION = VGEEarth.ConfigTool.config.Version;

window.VGEEarth = VGEEarth;
Cesium.Ion.defaultAccessToken = VGEEarth.Ion.defaultAccessToken;


export default VGEEarth;
