import { Cesium } from '../../Impl/Declare';
import { CustomDataSource, Entity, Viewer } from 'cesium';
import { ResourceItem } from '../../Config/Resource/ResourceItem';
import { MotionEntity } from '../../ExpandEntity/MotionEntity/index';
import { VGEData } from './impl/VGEData';


class VGEGLTF extends VGEData<Entity> {
    private readonly dataSourceToo: CustomDataSource;

    constructor(viewer: Viewer) {
        super(viewer);
        this.dataSourceToo = new Cesium.CustomDataSource('工作区 GLTF - 附加实体集合');
        this.viewer.dataSources.add(this.dataSourceToo);
    }

    async addData(sourceItem: ResourceItem): Promise<any> {
        let prop = (sourceItem.properties) as any;
        let url = prop.url;
        let queryParameters = prop.queryParameters || {};
        let scale = prop.scale || 1;
        // 对地形进行深度测试
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        let resource = new Cesium.Resource({url, queryParameters});

        let position = Cesium.Cartesian3.fromDegrees(prop.position.longitude, prop.position.latitude, prop.position.height || 0);

        let heading = Cesium.Math.toRadians(135);
        let pitch = 0;
        let roll = 0;
        let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        let orientation = sourceItem.properties.orientation ? sourceItem.properties.orientation : Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );
        let option = ({
            id: sourceItem.pid,
            name: sourceItem.name,
            position: position,
            orientation: orientation,
            model: {
                uri: resource,
                scale: scale
                // maximumScale: 20000
            }
        } as any);
        if (prop.position.height === null) {
            option.model.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        }

        if (prop.DistanceDisplayCondition) {
            let near = prop.DistanceDisplayCondition.near;
            let far = prop.DistanceDisplayCondition.far;
            option.model.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(near, far);
        }

        // 添加实体最小缩放比例
        prop.minimumPixelSize && (option.model.minimumPixelSize = prop.minimumPixelSize);


        let entity = this.dataSourceToo.entities.add(option);

        // 添加实体运动
        if (prop?.motion?.path && prop?.motion?.speed) {
            MotionEntity(entity, window.turf.lineString(prop.motion.path), prop.motion.speed);
        }

        this.sourcesItems.push(sourceItem);
        this.instancesMap.set(entity.id, entity);

        return entity;
    };


    async flyToByPid(pid: string): Promise<boolean> {
        let ds = this.getInstancesByPid(pid);
        if (ds) {
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
            removeRes = this.dataSourceToo.entities.removeById(pid);
            this.instancesMap.delete(pid);
        }
        return removeRes;
    }

    destroy(): boolean {
        return this.removeAll();
    }
}


export { VGEGLTF };
