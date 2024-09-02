async function awaitWrap(promise) {
    try {
        const data = await promise;
        return [null, data];
    }
    catch (err) {
        return [err, null];
    }
}
;
/**
 * 让异步函数，模拟睡眠进行
 * @param ms    毫秒
 *
 * @remarks
 * 命名空间：window.VGEEarth.sleep
 *
 * @example
 *
 * console.log('等待 3 秒钟');
 * await sleep(3000);
 * console.log('等待结束');
 *
 */
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const AsyncTool = {
    awaitWrap,
    sleep
};
export { AsyncTool };
