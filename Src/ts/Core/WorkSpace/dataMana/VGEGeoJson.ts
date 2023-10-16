import { Cesium } from '../../Impl/Declare';
import { DataSource, Viewer } from 'cesium';

import { ResourceItem } from '../../Config/Resource/ResourceItem';
import { VGEData } from './impl/VGEData';
import { PlotDataSource } from '../../PlotTool/lib/PlotDataSource';
import { AsyncTool } from '../../../Utils/YaoDo/Source/AsyncTool';
import { EntityFactory } from '../../ExpandEntity/EntityFactory/index';

class VGEGeoJson extends VGEData<PlotDataSource> {
    constructor(viewer: Viewer) {
        super(viewer);
    }

    async addData(sourceItem: ResourceItem): Promise<any> {

        const prop = sourceItem.properties;
        const url = prop.url;
        const pid = sourceItem.pid;

        const [err, geoJson] = await AsyncTool.awaitWrap(fetch(url).then(res=>res.json()));

        let entity = null;

        if (geoJson) {
            // 载入 geoJson
            let ds = new PlotDataSource('VGEGeoJson');
            ds.name = sourceItem.name;
            ds.load(geoJson, {clampToGround: true}).then(function (dataSource: DataSource) {
                let entities = dataSource.entities.values;
                entities.forEach((entity) => {
                    if (prop.symbol && prop.symbol.lineArrow && entity.polyline) {
                        entity.polyline.material = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED);
                        // @ts-ignore
                        entity.polyline.width = 15;
                    }
                });
            });

            // 添加文字标注
            if (prop.label) {
                let centerCoordinate = window.turf.center(geoJson).geometry.coordinates;
                let pro = ({id: pid} as any);
                // 设置文字偏移
                if (prop.label.pixelOffset) {
                    pro.pixelOffset = new Cesium.Cartesian2(prop.label.pixelOffset.x, prop.label.pixelOffset.y);
                }

                ds.entities.add(EntityFactory.buildLabelByDegrees({
                    longitude: centerCoordinate[0],
                    latitude: centerCoordinate[1],
                    height: 0
                }, prop.label.text, pro));
            }


            this.instancesMap.set(pid, ds);
            this.sourcesItems.push(sourceItem);
            // @ts-ignore
            entity = await this.viewer.dataSources.add(ds);
        }

        return entity;

    }

    async flyToByPid(pid: string): Promise<boolean> {
        let ds = this.getInstancesByPid(pid);
        if (ds) {
            // @ts-ignore
            return this.viewer.flyTo(ds, {
                offset: new Cesium.HeadingPitchRange(0, -3.14 / 2, 0)
            }).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        } else {
            return false;
        }
    }

    removeByPid(pid: string) {
        let removeRes = false;
        let instance = this.getInstancesByPid(pid);
        this.sourcesItems = this.sourcesItems.filter(item => item.pid !== pid);
        if (instance) {
            // @ts-ignore
            removeRes = this.viewer.dataSources.remove(instance);
            this.instancesMap.delete(pid);
        }
        return removeRes;
    }

    destroy(): boolean {
        return this.removeAll();
    }
}

export { VGEGeoJson };
