import { Cesium } from '../../Impl/Declare';

function getOptions2D() {
    return {
        homeButton: false,
        fullscreenButton: false,
        sceneModePicker: false,
        clockViewModel: new Cesium.ClockViewModel(),
        infoBox: false,
        geocoder: false,
        sceneMode: Cesium.SceneMode.SCENE2D,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        baseLayerPicker: false
    };
}


export { getOptions2D };
