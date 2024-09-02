/****************************************************************************
 名称：模型移动扩展
 描述：扩展了移动模型类，支持第一视角移动


 最后修改日期：2022-07-14
 ****************************************************************************/

import { Cartesian3, HeadingPitchRange, Viewer } from 'cesium';
import { Cesium } from '../../Impl/Declare';

interface KeyboardModelExtOptions {
    modelUrl: string,
    scale: number,
    minimumPixelSize: number,
    angle: number,
    speed: number,
    role: number,
    aotuPickHeight: boolean
}

/**
 * 名称：模型移动扩展
 *
 * 描述：扩展了移动模型类，支持第一视角移动
 **/
class KeyboardModelExt {
    /**状态标志 即按下了那个按键
     */
    flag: { moveRight: boolean; moveLeft: boolean; moveDown: boolean; moveUp: boolean };
    /**3D笛卡尔点*/
    position: Cartesian3;
    /**键盘控制选项*/
    keyboardModelExtOptions: KeyboardModelExtOptions;
    /**判断是否可以控制模型*/
    enable: boolean;
    /**旋转角度*/
    radian: number;
    /**模型姿态*/
    hpRange: HeadingPitchRange;
    /**运动方向*/
    speedVector: Cartesian3;
    /**速度*/
    role;
    /**模型的各个参数的集合 */
    moveModel: any;
    /**模型的姿态*/
    hpRoll: any;
    fixedFrameTransforms: any;
    /**Cesium三维视窗*/
    private viewer: Viewer;

    /**
     * 构造函数
     * @param viewer Cesium三维视窗
     * @param position 位置
     * @param keyboardModelExtOptions 键盘控制选项
     */
    constructor(viewer: Viewer, position: Cartesian3, keyboardModelExtOptions: KeyboardModelExtOptions) {
        this.viewer = viewer;
        this.position = position;
        this.enable = false;

        this.keyboardModelExtOptions = keyboardModelExtOptions;
        this.keyboardModelExtOptions.speed = keyboardModelExtOptions.speed || 1;
        this.keyboardModelExtOptions.aotuPickHeight = keyboardModelExtOptions.aotuPickHeight || true;

        this.speedVector = new Cesium.Cartesian3();


        //旋转角度
        this.radian = Cesium.Math.toRadians(keyboardModelExtOptions.angle || 1);
        this.hpRange = new Cesium.HeadingPitchRange();
        // 速度
        this.role = keyboardModelExtOptions.role || 0; //0 自由视角 1 第一视角
        //状态标志 即按下了那个按键
        this.flag = {
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


        this.addModelPrimitive().then(e => {
            this.registerEvens();
            this.enable = true;
        });
    }

    /**
     * 添加模型*/
    async addModelPrimitive() {
        this.moveModel = this.viewer.scene.primitives.add(await Cesium.Model.fromGltfAsync({
            url: this.keyboardModelExtOptions.modelUrl,
            modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(this.position, this.hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransforms),
            scale: this.keyboardModelExtOptions.scale,
            minimumPixelSize: this.keyboardModelExtOptions.minimumPixelSize
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

        //所有键盘抬起 是否锁定
        if ((!flag.moveLeft) && (!flag.moveDown) && (!flag.moveUp) && (!flag.moveRight)) {
            this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        } else {
            this.lookAt();
        }
    }

    lookAt() {
        if (!this.role) return;
        let r = 2.0 * Math.max(this.moveModel.boundingSphere.radius, this.viewer.camera.frustum.near);
        let centerGAI = new Cesium.Cartesian3();
        Cesium.Matrix4.multiplyByPoint(this.moveModel.modelMatrix, centerGAI, this.position);
        this.hpRange.heading = this.hpRoll.heading;
        this.hpRange.pitch = this.hpRoll.pitch - Cesium.Math.toRadians(30);
        this.hpRange.range = r * 5.0;
        this.viewer.camera.lookAt(this.position, this.hpRange);
    }

    /**
     * 移动模型
     * @param isUP*/
    moveModelByKey(isUP: boolean) {
        // 计算速度矩阵
        if (isUP) {
            this.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, this.keyboardModelExtOptions.speed, this.speedVector);
        } else {
            this.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, -this.keyboardModelExtOptions.speed, this.speedVector);
        }
        // 根据速度计算出下一个位置的坐标
        let position = Cesium.Matrix4.multiplyByPoint(this.moveModel.modelMatrix, this.speedVector, this.position);
        if (this.keyboardModelExtOptions.aotuPickHeight) {
            position = this.getPositionByHeight(position);
        }
        // 移动
        Cesium.Transforms.headingPitchRollToFixedFrame(position, this.hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransforms, this.moveModel.modelMatrix);
    }

    /**高度转换
     * @param position*/
    getPositionByHeight(position: Cartesian3) {
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let height = this.viewer.scene.sampleHeight(cartographic, [this.moveModel]);
        cartographic.height = height;
        return Cesium.Cartographic.toCartesian(
            cartographic,
            Cesium.Ellipsoid.WGS84
        );
    }

    /**
     * 设置标识状态
     * @param key
     * @param value*/
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

export { KeyboardModelExt };