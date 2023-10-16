/****************************************************************************
 名称：常用工具函数集合 - 字符串

 ****************************************************************************/
let StringTool = {
    //过滤非法字符串
    illegalFilter(str: string) {
        let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if (regEn.test(str) || regCn.test(str)) return false;
        return true;
    }
};

export { StringTool };
