// 数据分组
function arrGrouping(arr: any[], sortKey: string) {
    let sortKeyArr: string[] = [];
    let sortGroupArr: string[] = [];
    let groupMap = new Map();

    arr.forEach((item) => {
        let group = groupMap.get(item[sortKey]);
        if (group) {
            group.push(item);
        } else {
            sortKeyArr.push(item[sortKey]);
            groupMap.set(item[sortKey], [item]);
        }
    });

    sortKeyArr = sortKeyArr.sort((a: string, b: string) => {
        return a.localeCompare(b);
    });

    for (let i = 0; i < sortKeyArr.length; i++) {
        sortGroupArr.push(groupMap.get(sortKeyArr[i]));
    }

    return sortGroupArr;
}

export { arrGrouping };
