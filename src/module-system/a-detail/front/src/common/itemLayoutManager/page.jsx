export default {
  data() {
    return {
    };
  },
  methods: {
    page_getTitle() {
      const name = this.container.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      if (!this.base.item) return name;
      return `${name}: ${this.base.item.atomName}`;
    },
    page_getSubtitle() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
