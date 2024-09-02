import { Cesium } from '../../Impl/Declare';
function getOptions2D() {
    return {
        animation: false, // 是否显示动画控件
        homeButton: false, // 是否显示home键
        geocoder: false, // 是否显示地名查找控件
        baseLayerPicker: false, // 是否显示图层选择控件
        timeline: false, // 是否显示时间线控件
        fullscreenButton: false, // 是否全屏显示
        infoBox: true, // 是否显示点击要素之后显示的信息
        sceneModePicker: false,
        clockViewModel: new Cesium.ClockViewModel(),
        sceneMode: Cesium.SceneMode.SCENE2D,
        navigationHelpButton: false,
        imageryProvider: false
    };
}
export { getOptions2D };
