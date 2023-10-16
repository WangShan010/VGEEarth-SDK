import { Cesium } from '../../Impl/Declare';


function getBlankViewer() {
    return new Cesium.Viewer(document.createElement('div'));
}

export { getBlankViewer };
