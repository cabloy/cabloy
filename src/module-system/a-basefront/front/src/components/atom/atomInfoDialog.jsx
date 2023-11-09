export default {
  props: {
    item: { type: Object },
    atomClass: { type: Object },
    atomClassBase: { type: Object },
  },
  data() {
    return {};
  },
  computed: {
    validateHost() {
      return {
        cascadeParams: {
          default: {
            ebParams_group: {
              staticClass: 'col-100 medium-100 large-100',
            },
            ebParams_groupWhole: {
              staticClass: 'col-100 medium-100 large-100',
            },
          },
        },
      };
    },
    validateParams() {
      if (!this.atomClassBase.itemOnly) {
        return { module: 'a-basefront', schema: 'atomInfo' };
      }
      const userIdCreatedField = this.atomClassBase.fields?.mappings?.userIdCreated;
      if (userIdCreatedField) {
        return { module: 'a-basefront', schema: 'atomInfoItemOnly' };
      }
      return { module: 'a-basefront', schema: 'atomInfoItemOnlySimple' };
    },
    validateMeta() {
      return {
        ebPatch: {
          getDataKey: (dataKey /* , name*/) => {
            if (dataKey !== 'userIdCreated') return dataKey;
            if (!this.atomClassBase.itemOnly) {
              return dataKey;
            }
            const userIdCreatedField = this.atomClassBase.fields?.mappings?.userIdCreated;
            if (userIdCreatedField) {
              return userIdCreatedField;
            }
            return dataKey;
          },
        },
      };
    },
  },
  created() {},
  mounted() {
    const self = this;
    const el = self.$refs.el;
    if (!el) return;
    const dialogParams = {
      el: self.$refs.el,
      backdrop: true,
      closeByBackdropClick: true,
      closeByOutsideClick: true,
      closeOnEscape: true,
      swipeToClose: true,
    };
    self.$f7ready(() => {
      self.f7Dialog = self.$f7.dialog.create(dialogParams);
    });
  },
  beforeDestroy() {
    const self = this;
    if (self.f7Dialog) self.f7Dialog.destroy();
  },
  methods: {
    open() {
      this.f7Dialog.open();
    },
  },
  render() {
    return (
      <div ref="el" class="dialog">
        <div class="dialog-inner">
          <div class="dialog-title"></div>
          <eb-validate
            auto={true}
            readOnly={true}
            data={this.item}
            params={this.validateParams}
            host={this.validateHost}
            meta={this.validateMeta}
          ></eb-validate>
        </div>
      </div>
    );
  },
};
