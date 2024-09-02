import { Cartesian3, Viewer } from 'cesium';
import { Cesium } from '../../Impl/Declare';

interface KeyboardModelOptions {
    modelUrl: string,
    scale: number,
    minimumPixelSize: number,
    angle: number,
    speed: number
}

/**
 * 名称：模型控制
 *
 * 描述：使用键盘控制模型移动
 **/
class KeyboardModel {
    /**位置*/
    position: Cartesian3;
    /**模型链接*/
    modelUrl: string;
    /**判断是否可以控制模型*/
    enable: boolean;
    /**模型的选项*/
    options;
    /**旋转角度*/
    radian: number;
    /**速度*/
    speed: number;
    /**3D笛卡尔点*/
    speedVector: Cartesian3;
    /**状态标志 即按下了那个按键
     */
    flag: { moveRight: boolean; moveLeft: boolean; moveDown: boolean; moveUp: boolean };
    /**表示为航向、俯仰和滚动的旋转*/
    hpRoll: any;
    fixedFrameTransforms: any;
    /**模型的各个参数的集合 */
    moveModel: any;
    /**Cesium三维视窗*/
    private viewer: Viewer;

    /**
     * 构造函数
     * @param _viewer 视图
     * @param _position 位置
     * @param _options 选项
     */
    constructor(_viewer: Viewer, _position: Cartesian3, _options: KeyboardModelOptions) {
        this.viewer = _viewer;
        this.position = _position;
        this.modelUrl = _options.modelUrl;
        this.enable = false;
        this.options = _options;
        /**旋转角度*/
        this.radian = Cesium.Math.toRadians(_options.angle || 1);
        /**速度*/
        this.speed = _options.speed || 1;
        this.speedVector = new Cesium.Cartesian3();

        /**状态标志 即按下了那个按键*/
        this.flag =
            {
                moveUp: false,
                moveDown: false,
                moveLeft: false,
                moveRight: false
            };
    }

    /**
     * 开始控制
     **/
    activate() {
        let canvas = this.viewer.canvas;
        canvas.setAttribute('tabindex', '0'); //地图获取焦点后才可操作
        canvas.focus();
        if (this.enable) return;
        this.hpRoll = new Cesium.HeadingPitchRoll();
        this.fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');

        this.addModelPrimitive().then(e=>{
            this.registerEvens();
            this.enable = true;
        })
    }

    /**
     * 添加模型*/
    async addModelPrimitive() {
        console.log(Cesium);
        this.moveModel = this.viewer.scene.primitives.add(await Cesium.Model.fromGltfAsync({
            url: this.modelUrl,
            modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(this.position, this.hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransforms),
            scale: this.options.scale,
            minimumPixelSize: this.options.minimumPixelSize
        }));
    }

    /**
     * 注册事件*/
    registerEvens() {
        let canvas = this.viewer.canvas;
        canvas.addEventListener('keydown', (e) => {
            this.setFlagStatus(e, true);
        }, false);

        canvas.addEventListener('keyup', (e) => {
            this.setFlagStatus(e, false);
        }, false);

        this.viewer.clock.onTick.addEventListener(this.tickEventHandler, this);
    }

    /**
     * 时刻表监听*/
    tickEventHandler() {
        const flag = this.flag;
        let hpRoll = this.hpRoll;
        const radian = this.radian;
        //前进
        if (flag.moveUp) {
            //前进同时改变方向
            if (flag.moveLeft) {
                hpRoll.heading -= radian;
            }

            if (flag.moveRight) {
                hpRoll.heading += radian;
            }
            this.moveModelByKey(true);
        }

        //后退
        if (flag.moveDown) {
            //后退同时改变方向
            if (flag.moveLeft) {
                hpRoll.heading -= radian;
            }

            if (flag.moveRight) {
                hpRoll.heading += radian;
            }
            this.moveModelByKey(false);
        }

        //单独改变方向 不前进后退
        if ((flag.moveLeft) && (!flag.moveDown) && (!flag.moveUp) && (!flag.moveRight)) {
            hpRoll.heading -= radian;
            Cesium.Transforms.headingPitchRollToFixedFrame(this.position, hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransforms, this.moveModel.modelMatrix);
        }
        //单独改变方向 不前进后退
        if ((flag.moveRight) && (!flag.moveDown) && (!flag.moveUp) && (!flag.moveLeft)) {
            hpRoll.heading += radian;
            Cesium.Transforms.headingPitchRollToFixedFrame(this.position, hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransforms, this.moveModel.modelMatrix);
        }
    }

    /**
     * 移动模型
     * @param isUP 布尔值*/
    moveModelByKey(isUP: boolean) {
        // 计算速度矩阵
        if (isUP) {
            this.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, this.speed, this.speedVector);
        } else {
            this.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, -this.speed, this.speedVector);
        }
        // 根据速度计算出下一个位置的坐标
        let position = Cesium.Matrix4.multiplyByPoint(this.moveModel.modelMatrix, this.speedVector, this.position);
        // 移动
        Cesium.Transforms.headingPitchRollToFixedFrame(position, this.hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransforms, this.moveModel.modelMatrix);
    }

    /**
     * 设置标识状态
     * @param key 键盘事件
     * @param value 布尔值*/
    setFlagStatus(key: KeyboardEvent, value: boolean) {
        switch (key.keyCode) {
            case 65:
                // 左
                this.flag.moveLeft = value;
                break;
            case 87:
                // 上
                this.flag.moveUp = value;
                break;
            case 68:
                // 右
                this.flag.moveRight = value;
                break;
            case 83:
                // 下
                this.flag.moveDown = value;
                break;
        }
    }

    /**
     * 结束控制*/
    deactivate() {
        this.unRegisterEvents();
        this.removeModelPrimitive();
        this.enable = false;
    }

    /**
     * 删除模型*/
    removeModelPrimitive() {
        this.viewer.scene.primitives.remove(this.moveModel);
    }

    /**
     * 注销事件
     **/
    unRegisterEvents() {
        this.viewer.clock.onTick.removeEventListener(this.tickEventHandler, this);
    }
}

export { KeyboardModel };