import { Cesium } from '../../Impl/Declare';
import { Cartesian3, Viewer } from 'cesium';

class dragEntity {

    private leftDownFlag: boolean;
    private pointDraged: any;
    private viewer: Viewer;
    private handler: any;
    private cartesian: any;
    private startPoint: any;
    private polylinePreviousCoordinates: Cartesian3[] = [];
    private polygonPreviousCoordinates: { positions: Cartesian3[] } = {positions: []};
    private rectanglePreviousCoordinates: any;
    private MoveEntity: any;
    private _moveEndCallBack: any;


    constructor(_moveEndCallBack: any, options: any) {
        this.leftDownFlag = false;
        // this.pointDraged= viewer.scene.pick(movement.position);
        this.viewer = options.viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.cartesian = null;
        this.startPoint = null;
        this.rectanglePreviousCoordinates = {};
        this.Init();
    }

    Init() {
        // Select plane when mouse down
        this.handler.setInputAction( (movement: any)=> {
            this.pointDraged = this.viewer.scene.pick(movement.position); //选取当前的entity
            this.leftDownFlag = true;
            if (this.pointDraged && this.pointDraged.id) {
                //记录按下去的坐标
                this.startPoint = this.viewer.scene.pickPosition(movement.position);
                this.viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
                //当前实体Entity的polyline坐标属性信息暂存
                if (this.pointDraged.id.polyline) {
                    this.polylinePreviousCoordinates = this.pointDraged.id.polyline.positions.getValue();
                }
                if (this.pointDraged.id.polygon) {
                    this.polygonPreviousCoordinates = this.pointDraged.id.polygon.hierarchy.getValue();
                }
                if (this.pointDraged.id.rectangle) {
                    this.rectanglePreviousCoordinates = this.pointDraged.id.rectangle.coordinates.getValue();
                }
            } else {
                this.leftDownFlag = false;
                this.pointDraged = null;
                this.viewer.scene.screenSpaceCameraController.enableInputs = true;
                this.viewer.scene.screenSpaceCameraController.enableRotate = true; //锁定相机
                this.handler.destroy();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Release plane on mouse up
        this.handler.setInputAction( ()=> {
            if (this._moveEndCallBack) {
                this._moveEndCallBack({
                    entityId: this.pointDraged.id.id,
                    startPosition: this.startPoint,
                    endPosition: this.cartesian ? this.cartesian : this.startPoint
                });
            }
            this.leftDownFlag = false;
            this.pointDraged = null;
            this.viewer.scene.screenSpaceCameraController.enableInputs = true;
            this.viewer.scene.screenSpaceCameraController.enableRotate = true; //锁定相机
            this.handler.destroy();
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        // Update plane on mouse move
        this.handler.setInputAction((movement: any) => {
            if (this.leftDownFlag === true && this.pointDraged != null && this.pointDraged.id) {
                //记录尾随的坐标
                let startPosition = this.viewer.scene.pickPosition(movement.startPosition);
                let endPosition = this.viewer.scene.pickPosition(movement.endPosition);

                if (Cesium.defined(startPosition) && Cesium.defined(endPosition)) {
                    this.pointDraged.id.position = new Cesium.CallbackProperty(function () {
                        return endPosition;
                    }, false);
                    //防止闪烁，在移动的过程console.log(pointDraged.id);
                    //计算每次的偏差
                    let changed_x = endPosition.x - startPosition.x;
                    let changed_y = endPosition.y - startPosition.y;
                    let changed_z = endPosition.z - startPosition.z;

                    this.cartesian = endPosition;

                    if (this.pointDraged.id.polyline) {
                        let currentsPoint: Cartesian3[] = [];
                        for (let i = 0; i < this.polylinePreviousCoordinates.length; i++) {
                            //与之前的算差 替换掉
                            this.polylinePreviousCoordinates[i].x =
                                this.polylinePreviousCoordinates[i].x + changed_x;
                            this.polylinePreviousCoordinates[i].y =
                                this.polylinePreviousCoordinates[i].y + changed_y;
                            this.polylinePreviousCoordinates[i].z =
                                this.polylinePreviousCoordinates[i].z + changed_z;
                            currentsPoint.push(this.polylinePreviousCoordinates[i]);
                        }
                        this.pointDraged.id.polyline.positions = new Cesium.CallbackProperty(
                            () => currentsPoint,
                            false
                        );
                    }

                    if (this.pointDraged.id.polygon) {
                        let currentsPoint: Cartesian3[] = [];
                        for (
                            let i = 0;
                            i < this.polygonPreviousCoordinates.positions.length;
                            i++
                        ) {
                            this.polygonPreviousCoordinates.positions[i].x += changed_x;
                            this.polygonPreviousCoordinates.positions[i].y += changed_y;
                            this.polygonPreviousCoordinates.positions[i].z += changed_z;
                            currentsPoint.push(this.polygonPreviousCoordinates.positions[i]);
                        }
                        this.pointDraged.id.polygon.hierarchy = new Cesium.CallbackProperty(
                            function () {
                                return {positions: currentsPoint, holes: []};
                            },
                            false
                        );
                    }

                    if (this.pointDraged.id.rectangle) {
                        let storePoint = {};

                        let position_start = startPosition;
                        let cartographic_start = Cesium.Cartographic.fromCartesian(
                            position_start
                        );
                        let longitude_start = Cesium.Math.toDegrees(
                            cartographic_start.longitude
                        );
                        let latitude_start = Cesium.Math.toDegrees(
                            cartographic_start.latitude
                        );
                        let height_start = cartographic_start.height;

                        let position_end = endPosition;
                        let cartographic_end = Cesium.Cartographic.fromCartesian(
                            position_end
                        );
                        let longitude_end = Cesium.Math.toDegrees(
                            cartographic_end.longitude
                        );
                        let latitude_end = Cesium.Math.toDegrees(
                            cartographic_end.latitude
                        );
                        let height_end = cartographic_end.height;

                        let changer_lng = longitude_end - longitude_start;
                        let changer_lat = latitude_end - latitude_start;

                        this.rectanglePreviousCoordinates.west = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(this.rectanglePreviousCoordinates.west) +
                            changer_lng
                        );

                        this.rectanglePreviousCoordinates.east = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(this.rectanglePreviousCoordinates.east) +
                            changer_lng
                        );

                        this.rectanglePreviousCoordinates.south = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(this.rectanglePreviousCoordinates.south) +
                            changer_lat
                        );
                        this.rectanglePreviousCoordinates.north = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(this.rectanglePreviousCoordinates.north) +
                            changer_lat
                        );
                        storePoint = this.rectanglePreviousCoordinates;

                        this.pointDraged.id.rectangle.coordinates = new Cesium.CallbackProperty(
                            function () {
                                // storePoint=new Cesium.Rectangle.fromDegrees(storePoint.west,storePoint.south,storePoint.east,storePoint.north);

                                return storePoint;
                                // return Cesium.Rectangle.fromDegrees(rectanglePreviousCoordinates.west, rectanglePreviousCoordinates.south, rectanglePreviousCoordinates.east, rectanglePreviousCoordinates.north);
                            },
                            false
                        );
                        this.pointDraged.id.rectangle.height = new Cesium.CallbackProperty(
                            function () {
                                return height_end;
                            },
                            false
                        );
                    }

                    if (this.pointDraged.id.ellipse) {
                        let position_end = endPosition;
                        let cartographic_end = Cesium.Cartographic.fromCartesian(
                            position_end
                        );
                        let height_end = cartographic_end.height;
                        this.pointDraged.id.ellipse.height = new Cesium.CallbackProperty(
                            function () {
                                return height_end;
                            },
                            false
                        );
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}




export { dragEntity };
