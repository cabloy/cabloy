import Base from './base.jsx';
import layout from './layout.jsx';

// container: {
//   mode,  // edit/view
//   atomId,
//   itemId,
//   atomClassId,
// },

export default {
  mixins: [ Base, layout ],
  data() {
    return {
    };
  },
  created() {
    this.layout_prepareConfig().then(() => {
      this.base.ready = true;
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
