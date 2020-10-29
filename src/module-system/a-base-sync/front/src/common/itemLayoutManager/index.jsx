import ebAtomClasses from '../atomClasses.js';
import ebAtomActions from '../atomActions.js';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Subnavbar from './subnavbar.jsx';
import Actions from './actions.jsx';
import Validate from './validate.jsx';

// container: {
//   mode,  // edit/view
//   atomId,
//   itemId,
//   atomClassId,
// },

export default {
  mixins: [ ebAtomClasses, ebAtomActions, Base, Page, Layout, Subnavbar, Actions, Validate ],
  data() {
    return {
    };
  },
  created() {
    this.base_loadItem().then(() => {
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
