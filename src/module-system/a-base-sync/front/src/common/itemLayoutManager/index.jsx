import ebAtomClasses from '../atomClasses.js';
import ebAtomActions from '../atomActions.js';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Subnavbar from './subnavbar.jsx';
import Info from './info.jsx';
import Actions from './actions.jsx';
import Validate from './validate.jsx';

// container: {
//   mode,  // edit/view
//   atomId,
//   itemId,
//   atomClassId,
// },

export default {
  mixins: [ ebAtomClasses, ebAtomActions, Base, Page, Layout, Subnavbar, Info, Actions, Validate ],
  data() {
    return {
    };
  },
  created() {
    this.base_loadItem().then(res => {
      if (!res) return;
      this.layout_prepareConfig().then(() => {
        this.base.ready = true;
      });
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
