/****************************************************************************
 名称：调试模式控制器

 最后修改日期：2022-03-10
 ****************************************************************************/

import { framesPerSecond } from './framesPerSecond';

let debugMana = {
    state: false,
    open() {
        this.state = true;
        framesPerSecond.open();
    },
    close() {
        this.state = false;
        framesPerSecond.close();
    }
};

export { debugMana };
