export default {
  data() {
    return {};
  },
  methods: {
    page_getTitle() {
      if (this.container.home) {
        const inPanel = this.$view.inPanel();
        return inPanel ? this.$text('Menu') : this.$text('Home');
      }
      const resourceTypes = this.$store.getState('a/base/resourceTypes');
      if (!resourceTypes) return null;
      return resourceTypes[this.container.resourceType].titleLocale;
    },
    page_getSubtitle() {
      return '';
    },
  },
};
