class JPGFactory {
    private dom: HTMLDivElement;

    constructor(dom: HTMLDivElement) {
        this.dom = dom;
    }

    export(fileName: string, func: Function) {
        let that = this;

        window.html2canvas(that.dom, {
            onrendered: function (canvas: HTMLCanvasElement) {
                let strDataURI = canvas.toDataURL('image/jpeg');
                let a = document.createElement('a');
                a.download = fileName || '导出图片';　　//下载的文件名，默认是'下载'
                a.href = strDataURI;
                a.click();

                if (typeof func === 'function') {
                    func();
                }
            }
        });
    }
}

export { JPGFactory };
