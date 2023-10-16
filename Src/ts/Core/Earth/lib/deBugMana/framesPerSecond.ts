/****************************************************************************
 名称：帧数显示控制器

 最后修改日期：2022-03-10
 ****************************************************************************/

const framesPerSecond = {
    getDom(): HTMLDivElement | null {
        return document.querySelector('.cesium-performanceDisplay-defaultContainer');
    },
    // 显示帧率
    open() {
        const dom = this.getDom();
        if (dom?.style) {
            dom.style.display = 'flex';
        }
    },

    // 关闭显示帧率
    close() {
        const dom = this.getDom();
        if (dom?.style) {
            dom.style.display = 'none';
        }
    }
};


export { framesPerSecond };
