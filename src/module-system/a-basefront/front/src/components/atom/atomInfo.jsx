export default {
  props: {
    item: { type: Object },
  },
  data() {
    return {
      atomClass: null,
      atomClassBase: null,
      ready: false,
    };
  },
  watch: {
    item() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.item) return;
      this.atomClass = { module: this.item.module, atomClassName: this.item.atomClassName };
      const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
      this.atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass: this.atomClass });
      this.ready = true;
    },
    _getItemMetaMedia(avatar) {
      return this.$meta.util.combineAvatarUrl(avatar, 16);
    },
    onPerformClick() {},
  },
  render() {
    if (!this.ready) return null;
    const media = this._getItemMetaMedia(this.item.avatarUpdated);
    return (
      <eb-link
        key="actionsLeft:label"
        iconF7={media}
        tooltip={this.$text('UserLabels')}
        propsOnPerform={this.onPerformClick}
      ></eb-link>
    );
  },
};
