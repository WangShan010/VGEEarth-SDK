function exportHide() {
    const $ = window.$;
    // @ts-ignore
    let user = JSON.parse(window.userConfig.user);
    !user.exportConfig.compassExport && $('.compass').hide();  // 指南针
    !user.exportConfig.ribbonExport && $('#ribbon').hide();  // 色带
    !user.exportConfig.timeLabel && $('.currentDisplayTime').hide();  // 时间戳

    $('.mapControl_export_hide').hide();
    $('.ol-zoom').hide();
    $('.ol-scale-line').hide();
}

function exportShow() {
    const $ = window.$;
    $('.compass').show();
    $('.currentDisplayTime').show();
    $('#ribbon').show();

    $('.mapControl_export_hide').show();
    $('.ol-zoom').hide();
    $('.ol-scale-line').show();
}

export { exportHide, exportShow };
