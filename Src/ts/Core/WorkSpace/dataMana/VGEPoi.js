import { Cesium } from '../../Impl/Declare';
import { VGEData } from './impl/VGEData';
class VGEPoi extends VGEData {
    constructor(viewer) {
        super(viewer);
        this.dataSourceToo = new Cesium.CustomDataSource('工作区 geoJson - 标注点');
        this.viewer.dataSources.add(this.dataSourceToo).then();
    }
    async addData(sourceItem) {
        let pid = sourceItem.pid;
        let { longitude, latitude } = sourceItem.properties.position;
        let text_string = sourceItem.properties.text_string;
        let image_path = sourceItem.properties.image_path;
        let mark = this.dataSourceToo.entities.add({
            id: pid,
            name: ' mark',
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            billboard: {
                image: image_path,
                width: 15,
                height: 15,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            label: {
                text: text_string,
                font: '12pt bold monospace',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 4,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, 0),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            }
        });
        this.sourcesItems.push(sourceItem);
        this.instancesMap.set(pid, mark);
        return mark;
    }
    async flyToByPid(pid) {
        let ds = this.getInstancesByPid(pid);
        if (ds) {
            return this.viewer.flyTo(ds, {
                offset: new Cesium.HeadingPitchRange(0, -3.14 / 2, 0)
            }).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        }
        else {
            return false;
        }
    }
    removeByPid(pid) {
        let removeRes = false;
        let instance = this.instancesMap.get(pid);
        this.sourcesItems = this.sourcesItems.filter(item => item.pid !== pid);
        if (instance) {
            removeRes = this.dataSourceToo.entities.remove(instance);
            this.instancesMap.delete(pid);
        }
        return removeRes;
    }
    destroy() {
        return this.removeAll();
    }
}
export { VGEPoi };
