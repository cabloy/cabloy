export default {
  data() {
    return {};
  },
  computed: {
    page_title() {
      return this.page_getTitle();
    },
  },
  methods: {
    page_getTitle() {
      let title;
      if (!this.base.item) {
        title = this.container.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      } else {
        title = this.base.item.atomName;
      }
      return this.page_getDirtyTitle(title);
      // return `${name}: ${this.base.item.atomName}`;
    },
    page_getSubtitle() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
