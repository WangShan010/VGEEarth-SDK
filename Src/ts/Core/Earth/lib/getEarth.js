// 获取 Earth
function getEarth() {
    let earth = window.earth;
    if (!earth) {
        throw new Error('请先初始化 Earth');
    }
    return earth;
}
export { getEarth };
