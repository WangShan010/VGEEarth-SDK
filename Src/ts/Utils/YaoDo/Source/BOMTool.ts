
/****************************************************************************
 名称：常用工具函数集合 - 浏览器类

 ****************************************************************************/
let BOMTool = {
    GetUA: function () {
        let u = navigator.userAgent;
        // let u2 = navigator.userAgent.toLowerCase();
        return u;
    },
    toClipboard: async function (text: string) {
        // 动态创建 textarea 标签
        const textarea = document.createElement('textarea');
        // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
        textarea.readOnly = true;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        // 将要 copy 的值赋给 textarea 标签的 value 属性
        textarea.value = text;
        // 将 textarea 插入到 body 中
        document.body.appendChild(textarea);
        // 选中值并复制
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        document.execCommand('Copy');
        document.body.removeChild(textarea);
    },
    // 把字符串内容，保存到本地
    saveShareContent(content: string, fileName: string) {
        let downLink = document.createElement('a');
        downLink.download = fileName;
        //字符内容转换为blod地址
        let blob = new Blob([content]);
        downLink.href = URL.createObjectURL(blob);
        // 链接插入到页面
        document.body.appendChild(downLink);
        downLink.click();
        // 移除下载链接
        document.body.removeChild(downLink);
    }
};

export { BOMTool };
