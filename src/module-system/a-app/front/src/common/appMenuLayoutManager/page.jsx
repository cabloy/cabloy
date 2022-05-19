export default {
  data() {
    return {};
  },
  methods: {
    page_ptr() {
      return false;
    },
    page_infinite() {
      return false;
    },
    page_onGetTitle() {
      // default title
      const inPanel = this.$view.inPanel();
      const titleDefault = inPanel ? this.$text('Apps') : this.$text('WorkplaceTitle');
      // app title
      return this.base_isChildMode() ? this.base.appItem.atomNameLocale : titleDefault;
    },
    page_onGetTitleSub() {
      return '';
    },
  },
};
