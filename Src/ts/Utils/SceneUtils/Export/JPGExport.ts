import { waterMark } from './waterMark';

function JPGExport(domId = '', fileName = '导出图片', waterMarkText: string = '', func?: Function | null) {
    let dom = document.getElementById(domId);
    const navigationDiv: HTMLDivElement | null = document.querySelector('#navigationDiv');
    navigationDiv?.style.setProperty('display', 'none');

    // 设置放大倍数
    const scale = window.devicePixelRatio;

    // 传入节点原始宽高
    // const _width = dom.offsetWidth;
    // const _height = dom.offsetHeight;

    // html2canvas配置项
    const ops = {
        scale,
        // width,
        // height,
        useCORS: true,
        allowTaint: false
    };

    return window.html2canvas(dom, ops).then(async (canvas: HTMLCanvasElement) => {
        let strDataURI = '';
        if (waterMarkText) {
            canvas = await waterMark(canvas, waterMarkText);
        }
        strDataURI = canvas.toDataURL('image/jpeg');
        let a = document.createElement('a');
        a.download = fileName;　　//下载的文件名，默认是'下载'
        a.href = strDataURI;
        a.click();
        navigationDiv?.style.setProperty('display', 'block');

        if (typeof func === 'function') {
            func();
        }
    });
}

export { JPGExport };
