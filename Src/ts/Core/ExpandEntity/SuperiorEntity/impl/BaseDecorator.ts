/****************************************************************************
 名称：装饰器父类

 最后修改日期：2022-05-25
 ****************************************************************************/

import { Cartesian3, Entity, Viewer } from 'cesium';
import { Cesium } from '../../../Impl/Declare';
import { getMainViewer } from '../../../Earth/lib/getMainViewer';
import { EventMana } from '../../../EventMana/EventMana';
import { CartographicTool } from '../../../../Utils/CoordinateTool/CartographicTool';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

abstract class BaseDecorator {
    viewer: Viewer;
    entity: Entity;
    cartesian3Position: Cartesian3 | undefined;
    decoratorOpen: boolean = false;
    #clampToGround: boolean = true;
    #eventInstance;

    constructor(entity: Entity, params: object, clampToGround: boolean = false) {
        this.viewer = getMainViewer();
        this.entity = entity;
        this.#clampToGround = clampToGround;
        this.#eventInstance = this.#clickEntity.bind(this);

        if (this.entity.position) {
            this.cartesian3Position = this.entity.position?.getValue(this.viewer.clock.currentTime);

            // 如果贴地
            if (this.cartesian3Position && this.#clampToGround) {
                let cartographic = CartographicTool.formCartesian3(this.cartesian3Position);
                getTerrainMostDetailedHeight(cartographic.longitude, cartographic.latitude).then(height => {
                    this.cartesian3Position = Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, height);
                });
            }
        }

        this.#addEvent();
    }

    // 视角发生改变时改变装饰器的位置，需要子类重写
    abstract postRenderEvent(): void;

    // 创建装饰器，需要子类重写
    abstract createDecorator(): void;

    // 移除装饰器，需要子类重写
    abstract removeDecorator(): void;

    destroy() {
        this.removeDecorator();
        EventMana.screenEvent.removeEventListener(this.#eventInstance);
    }

    // 添加 Entity 的【点击事件】和【销毁事件】
    #addEvent() {
        let that = this;
        this.viewer.scene.postRender.addEventListener(this.postRenderEvent.bind(this));
        EventMana.screenEvent.addEventListener(
            EventMana.ListenType.ScreenSpaceEventType.LEFT_CLICK,
            EventMana.ScopeType.Viewer3D,
            that.#eventInstance
        );

        // 监听 Entity 是是否被销毁
        this.entity.entityCollection.collectionChanged.addEventListener(function (e: any) {
            let entity = e._entities._array.find((entity: Entity) => entity.id === that.entity.id);
            if (entity === undefined) {
                that.destroy();
            }
        });
    }

    // 点击实体，创建装饰器
    #clickEntity(e: any) {
        let that = this;
        if (that.decoratorOpen) return;
        let pick = that.viewer.scene.pick(e.position);
        if (pick && pick.id === that.entity) {
            that.createDecorator();
        }
    }
}


export { BaseDecorator };