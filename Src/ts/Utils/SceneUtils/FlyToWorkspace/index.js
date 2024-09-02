// 系统一开始进行的飞到目的地的功能，根据配置的边界数组进行飞行
import { getMainViewer } from '../../../Core/Earth/lib/getMainViewer';
let FlyToWorkspace = {
    contents: [
    // Cesium.Rectangle.fromDegrees(113.537926, 36.066539, 119.848199, 42.656242),
    // Cesium.Rectangle.fromDegrees(116.784339, 39.929257, 117.109741, 40.043802)
    ],
    startFlyCallbacks: [],
    endFlyCallbacks: [],
    //开始飞行
    start(contents) {
        const viewer = getMainViewer();
        if (contents) {
            this.contents = [
            // Cesium.Rectangle.fromDegrees(contents[0][0], contents[0][1], contents[0][2], contents[0][3]),
            // Cesium.Rectangle.fromDegrees(contents[1][0], contents[1][1], contents[1][2], contents[1][3])
            ];
        }
        startFly();
        viewer.camera.flyTo({
            destination: this.contents[0],
            duration: 2,
            complete: function () {
                viewer.camera.flyTo({
                    destination: this.contents[1],
                    complete: function () {
                        endFly();
                    }
                });
            }
        });
    },
    //飞行开始监听
    onStartFly(callback) {
        if (typeof callback === 'function') {
            // @ts-ignore
            this.startFlyCallbacks.push(callback);
        }
    },
    //飞行结束监听
    onEndFly(callback) {
        if (typeof callback === 'function') {
            // @ts-ignore
            this.endFlyCallbacks.push(callback);
        }
    }
};
function startFly() {
    FlyToWorkspace.startFlyCallbacks.forEach(callback => {
        // @ts-ignore
        callback();
    });
}
function endFly() {
    FlyToWorkspace.endFlyCallbacks.forEach(callback => {
        // @ts-ignore
        callback();
    });
}
export { FlyToWorkspace };
