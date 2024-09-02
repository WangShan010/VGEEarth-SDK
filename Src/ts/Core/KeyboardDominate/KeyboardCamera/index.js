/******
 * 名称：视角移动
 *
 * 描述：使用键盘控制视角移动
 ******/
class KeyboardCamera {
    /**构造函数
     * @param _viewer 视图*/
    constructor(_viewer) {
        this.viewer = _viewer;
        this.initKeyEvent();
        this.isActivate = true;
    }
    /**
     * 激活事件
     */
    activate() {
        this.isActivate = true;
    }
    /**
     * 键盘事件
     * 监测键盘输入的指令
     **/
    initKeyEvent() {
        let canvas = this.viewer.canvas;
        canvas.setAttribute('tabindex', '0'); //地图获取焦点后才可操作
        canvas.focus();
        canvas.onclick = function () {
            canvas.focus();
        };
        let flags = {};
        //按下
        canvas.addEventListener('keydown', (e) => {
            this.changeFlagForKeyCode(e.keyCode, flags, true);
        }, false);
        //抬起
        canvas.addEventListener('keyup', (e) => {
            this.changeFlagForKeyCode(e.keyCode, flags, false);
        }, false);
        let camera = this.viewer.camera;
        let ellipsoid = this.viewer.scene.globe.ellipsoid;
        this.viewer.clock.onTick.addEventListener((e) => {
            if (!this.isActivate)
                return;
            this.setCamera(flags, camera, ellipsoid);
        });
    }
    /**
     * 设置相机
     * @param flags 储存相机移动命令的对象
     * @param camera 相机
     * @param ellipsoid
     **/
    setCamera(flags, camera, ellipsoid) {
        let cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
        let moveRate = cameraHeight / 100.0;
        if (flags.moveForward) {
            camera.moveForward(moveRate);
        }
        if (flags.moveBackward) {
            camera.moveBackward(moveRate);
        }
        if (flags.moveUp) {
            camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
            camera.moveDown(moveRate);
        }
        if (flags.moveLeft) {
            camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
            camera.moveRight(moveRate);
        }
    }
    /**
     * 判断 按键 值对应的操作，并改变flags相应的值
     * @param keyCode 按键值
     * @param flags 储存相机移动命令的对象
     * @param value 布尔值
     **/
    changeFlagForKeyCode(keyCode, flags, value) {
        switch (keyCode) {
            case 'W'.charCodeAt(0):
                flags.moveForward = value; //前进
                return;
            case 'S'.charCodeAt(0):
                flags.moveBackward = value; //后退
                return;
            case 'Q'.charCodeAt(0):
                flags.moveUp = value; //上移
                return;
            case 'E'.charCodeAt(0):
                flags.moveDown = value; //下移
                return;
            case 'D'.charCodeAt(0):
                flags.moveRight = value; //右移
                return;
            case 'A'.charCodeAt(0):
                flags.moveLeft = value; //左移
                return;
            default:
                return;
        }
    }
    /**
     * 关闭事件
     */
    deactivate() {
        this.isActivate = false;
    }
}
export { KeyboardCamera };
