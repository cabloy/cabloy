import listLayoutManager from './common/listLayoutManager/index.jsx';
import itemLayoutManager from './common/itemLayoutManager/index.jsx';
import atomButtonBaseFn from './common/AtomButtonBase.jsx';

export default function (Vue) {
  return {
    ebListLayoutManager: listLayoutManager,
    ebItemLayoutManager: itemLayoutManager,
    ebAtomButtonBase: atomButtonBaseFn(Vue),
  };
}
