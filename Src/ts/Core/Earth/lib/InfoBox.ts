import { InfoBoxViewModel, Viewer } from 'cesium';
import { Cesium } from '../../Impl/Declare';

class InfoBox {
    public viewModel: InfoBoxViewModel;

    constructor(viewer: Viewer) {
        const infoBoxContainer = document.createElement('div');
        infoBoxContainer.className = 'cesium-viewer-infoBoxContainer';
        viewer.container.appendChild(infoBoxContainer);
        let infoBox = new Cesium.InfoBox(infoBoxContainer);

        const dom: HTMLDivElement | null = document.querySelector('.cesium-infoBox');
        if (dom) {
            dom.style.top = '105px';
        }

        infoBox.viewModel.closeClicked.addEventListener(() => {
            infoBox.viewModel.showInfo = false;
        });
        this.viewModel = infoBox.viewModel;
    }
}


export { InfoBox };