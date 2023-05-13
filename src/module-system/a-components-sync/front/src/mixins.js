import pageContext from './common/pageContext.js';
import validateCheck from './common/validate/validateCheck.js';
import validateComponentBase from './common/validate/validateComponentBase.js';
import viewSizeChange from './common/viewSizeChange.jsx';
import stats from './common/stats.js';
import pageDirty from './common/pageDirty.js';
import TreeviewAdapterBaseFn from './components/treeview/treeviewAdapterBase.js';

export default {
  ebPageContext: pageContext,
  ebValidateCheck: validateCheck,
  ebValidateComponentBase: validateComponentBase,
  ebViewSizeChange: viewSizeChange,
  ebStats: stats,
  ebPageDirty: pageDirty,
  ebTreeviewAdapterBase: TreeviewAdapterBaseFn,
};
