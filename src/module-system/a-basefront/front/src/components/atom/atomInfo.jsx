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
    _getMediaInfo() {
      let media;
      let mediaLabel;
      if (!this.atomClassBase.itemOnly) {
        media = this.item.avatarUpdated;
        mediaLabel = this.item.userName;
      } else {
        const userIdCreatedField = this.atomClassBase.fields?.mappings?.userIdCreated;
        if (userIdCreatedField) {
          media = this.item[`_${userIdCreatedField}Avatar`];
          mediaLabel = this.item[`_${userIdCreatedField}Name`];
        } else {
          media = '::information';
          mediaLabel = this.$text('Information');
        }
      }
      return { media, mediaLabel };
    },
    _getItemMetaMedia(avatar) {
      return this.$meta.util.combineAvatarUrl(avatar, 16);
    },
    async onPerformClick() {
      const options = {
        props: {
          item: this.item,
        },
      };
      const dialog = await this.$view.createModal({ module: 'a-basefront', name: 'atomInfoDialog', options });
      dialog.open();
    },
  },
  render() {
    if (!this.ready) return null;
    const { media, mediaLabel } = this._getMediaInfo();
    const _media = this._getItemMetaMedia(media);
    return <eb-link iconF7={_media} tooltip={mediaLabel} propsOnPerform={this.onPerformClick}></eb-link>;
  },
};
