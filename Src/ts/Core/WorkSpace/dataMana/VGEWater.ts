import { Viewer } from 'cesium';

import { ResourceItem } from '../../Config/Resource/ResourceItem';
import { WaterPolygon } from '../../ExpandEntity/SuperiorEntity/lib/WaterPolygon';
import { VGEData } from './impl/VGEData';

class VGEWater extends VGEData<WaterPolygon> {
    options;

    constructor(viewer: Viewer) {
        super(viewer);
        this.options = {
            red: 0, // 颜色R
            green: 0.2941177, // 颜色G
            blue: 0.2078431, // 颜色B
            alpha: 0.7,// 透明度
            frequency: 20.0, // 波纹频率
            animationSpeed: 0.005, // 波动速度
            amplitude: 1.0, // 波动高度
            height: 1 // 水面高度
        };
    }

    async addData(sourceItem: ResourceItem): Promise<WaterPolygon | null> {
        let that = this;
        let prop = sourceItem.properties;
        let options = JSON.parse(JSON.stringify(prop));
        options.red && (that.options.red = options.red);
        options.green && (that.options.green = options.green);
        options.blue && (that.options.blue = options.blue);
        options.alpha && (that.options.alpha = options.alpha);
        options.frequency && (that.options.frequency = options.frequency);
        options.animationSpeed && (that.options.animationSpeed = options.animationSpeed);
        options.amplitude && (that.options.amplitude = options.amplitude);
        options.height && (that.options.height = options.height);

        let geoJsonUrl = options.geoJsonUrl;

        let item = this.getSourcesItemsByPid(sourceItem.pid);
        if (item) {
            console.log('不允许重复添加');
            return null;
        }
        that.sourcesItems.push(sourceItem);

        let geoJson: any = await fetch(geoJsonUrl).then(res=>res.json());

        that.instancesMap.get(sourceItem.pid)?.destroy();
        let waterPolygon = new WaterPolygon(that.viewer, geoJson, that.options.height);
        that.reLoad();
        that.instancesMap.set(sourceItem.pid, waterPolygon);

        return waterPolygon;
    }

    reLoad() {
        let that = this;
        for (const [key, waterPolygon] of this.instancesMap) {
            waterPolygon.red = that.options.red;
            waterPolygon.green = that.options.green;
            waterPolygon.blue = that.options.blue;
            waterPolygon.alpha = that.options.alpha;
            waterPolygon.frequency = that.options.frequency;
            waterPolygon.animationSpeed = that.options.animationSpeed;
            waterPolygon.amplitude = that.options.amplitude;
            waterPolygon.height = that.options.height;
            waterPolygon.reLoad();
        }
    }

    async flyToByPid(pid: string): Promise<boolean> {
        let instance = this.instancesMap.get(pid);
        if (instance) {
            return instance.flyTo();
        } else {
            return false;
        }
    }


    removeByPid(pid: string) {
        let removeRes = false;
        this.sourcesItems = this.sourcesItems.filter(item => item.pid !== pid);
        let waterPolygon = this.getInstancesByPid(pid);
        if (waterPolygon) {
            removeRes = waterPolygon.destroy();
            this.instancesMap.delete(pid);
        }
        return removeRes;
    };

    destroy(): boolean {
        return this.removeAll();
    }
}

export { VGEWater };
