import './loadScript';
import { JulianDate } from 'cesium';
import VGEEarth from '../../../index';

declare global {
    interface Window {
        VGEEarth_SDK_isLoaded: boolean;
        Cesium: any;
        $: any;
        jQuery: any;
        h337: any;
        tokml: any;
        ol: any;
        turf: any;
        jsPDF: any;
        videojs: any;
        toGeoJSON: {
            kml: any
        };
        DOMParser: any;
        html2canvas: any;
        CesiumNetworkPlug: {
            OfflineCacheController: any,
            DecryptionController: any,
        };
        echarts: any;
        mapv: any;
        earth: any;
        VGEEarth: typeof VGEEarth;
        YaoDo: any;
    }
}

const Cesium = window.Cesium;

type CameraViewType = {
    destination: {
        x: number,
        y: number,
        z: number,
    },
    orientation: {
        heading: number,
        pitch: number,
        roll: number,
    },
}

/** Cesium.Cartographic 是以弧度制来表示，使用时有诸多不便。
 * 本接口是角度制的经纬度坐标对象
 * 例如：{longitude:120.123, latitude:30.123, height:0}!
 * */
interface WorldDegree {
    longitude: number;
    latitude: number;
    height: number;
}

interface WorldDegreeWithTime extends WorldDegree {
    isoTime: string;
}

interface WorldDegreeWithJulianDate extends WorldDegree {
    julianDate: JulianDate;
}


export {
    Cesium,
    CameraViewType,
    WorldDegree,
    WorldDegreeWithTime,
    WorldDegreeWithJulianDate
};