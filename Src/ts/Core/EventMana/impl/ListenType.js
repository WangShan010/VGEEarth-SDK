export var ConfigEventType;
(function (ConfigEventType) {
    ConfigEventType[ConfigEventType["addData"] = 0] = "addData";
})(ConfigEventType || (ConfigEventType = {}));
export var ViewerEventType;
(function (ViewerEventType) {
    ViewerEventType[ViewerEventType["init"] = 0] = "init";
    ViewerEventType[ViewerEventType["hide"] = 1] = "hide";
    ViewerEventType[ViewerEventType["show"] = 2] = "show";
    ViewerEventType[ViewerEventType["destroy"] = 3] = "destroy";
})(ViewerEventType || (ViewerEventType = {}));
export var ScreenSpaceEventType;
(function (ScreenSpaceEventType) {
    ScreenSpaceEventType[ScreenSpaceEventType["LEFT_DOWN"] = 0] = "LEFT_DOWN";
    ScreenSpaceEventType[ScreenSpaceEventType["LEFT_UP"] = 1] = "LEFT_UP";
    ScreenSpaceEventType[ScreenSpaceEventType["LEFT_CLICK"] = 2] = "LEFT_CLICK";
    ScreenSpaceEventType[ScreenSpaceEventType["LEFT_DOUBLE_CLICK"] = 3] = "LEFT_DOUBLE_CLICK";
    ScreenSpaceEventType[ScreenSpaceEventType["RIGHT_DOWN"] = 5] = "RIGHT_DOWN";
    ScreenSpaceEventType[ScreenSpaceEventType["RIGHT_UP"] = 6] = "RIGHT_UP";
    ScreenSpaceEventType[ScreenSpaceEventType["RIGHT_CLICK"] = 7] = "RIGHT_CLICK";
    ScreenSpaceEventType[ScreenSpaceEventType["MIDDLE_DOWN"] = 10] = "MIDDLE_DOWN";
    ScreenSpaceEventType[ScreenSpaceEventType["MIDDLE_UP"] = 11] = "MIDDLE_UP";
    ScreenSpaceEventType[ScreenSpaceEventType["MIDDLE_CLICK"] = 12] = "MIDDLE_CLICK";
    ScreenSpaceEventType[ScreenSpaceEventType["MOUSE_MOVE"] = 15] = "MOUSE_MOVE";
    ScreenSpaceEventType[ScreenSpaceEventType["WHEEL"] = 16] = "WHEEL";
    ScreenSpaceEventType[ScreenSpaceEventType["PINCH_START"] = 17] = "PINCH_START";
    ScreenSpaceEventType[ScreenSpaceEventType["PINCH_END"] = 18] = "PINCH_END";
    ScreenSpaceEventType[ScreenSpaceEventType["PINCH_MOVE"] = 19] = "PINCH_MOVE";
})(ScreenSpaceEventType || (ScreenSpaceEventType = {}));
export var CameraEventType;
(function (CameraEventType) {
    CameraEventType[CameraEventType["LEFT_DRAG"] = 0] = "LEFT_DRAG";
    CameraEventType[CameraEventType["RIGHT_DRAG"] = 1] = "RIGHT_DRAG";
    CameraEventType[CameraEventType["MIDDLE_DRAG"] = 2] = "MIDDLE_DRAG";
    CameraEventType[CameraEventType["WHEEL"] = 3] = "WHEEL";
    CameraEventType[CameraEventType["PINCH"] = 4] = "PINCH";
})(CameraEventType || (CameraEventType = {}));
export var DataEventType;
(function (DataEventType) {
    DataEventType[DataEventType["addData"] = 0] = "addData";
    DataEventType[DataEventType["removeData"] = 1] = "removeData";
    DataEventType[DataEventType["changedData"] = 2] = "changedData"; // 数据发生改变之后发生
})(DataEventType || (DataEventType = {}));
