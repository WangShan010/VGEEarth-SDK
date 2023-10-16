/****************************************************************************
 名称：常用工具函数集合 - 树与数组的互转
 ****************************************************************************/


interface TreeItem {
    id: string;
    parent_id: string;
    children: TreeItem[];
}

interface ArrayItem {
    id: string;
    parent_id: string;
}


function array2Tree(arr: ArrayItem[] = [], idKey = 'id', parentIdKey = 'parent_id', groupName = 'children') {
    if (!Array.isArray(arr) || !arr.length) return;
    let map = new Map();
    // @ts-ignore
    arr.forEach(item => map.set(item[idKey], item));

    let roots: any[] = [];
    arr.forEach(item => {
        // @ts-ignore
        const parent: any = map.get(item[parentIdKey]);
        if (parent) {
            (parent[groupName] || (parent[groupName] = [])).push(item);
        } else {
            roots.push(item);
        }
    });

    return roots;
}

function treeGetByID(Tree: TreeItem[] = [], id = '', idKey = 'id', parentIdKey = 'parent_id', groupName = 'children') {
    let o = {};
    Tree.forEach(function (item) {
        if (item.id === id) {
            o = item;
        } else {
            // @ts-ignore
            if (typeof item[groupName] === 'string' && item[groupName].length > 0) {
                // @ts-ignore
                o = treeGetByID({Tree: item[groupName], id, idKey, parentIdKey, groupName});
            }
        }
    });
    return o;
}

export { array2Tree, treeGetByID };
