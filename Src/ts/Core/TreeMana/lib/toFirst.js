// 数组 置顶移动
function toFirst(fieldData, index) {
    if (index != 0) {
        // 这种方法是与另一个元素交换了位子
        // fieldData[index] = fieldData.splice(0, 1, fieldData[index])[0];
        fieldData.unshift(fieldData.splice(index, 1)[0]);
    }
    return fieldData;
}
export { toFirst };
