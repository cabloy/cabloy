export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      dict: null,
      dictItemTitle: null,
    };
  },
  computed: {
    value() {
      return this.context.getValue();
    },
  },
  watch: {
    context() {
      this._loadDict();
    },
    value() {
      this._loadDictItem();
    },
  },
  created() {
    this._loadDict();
  },
  methods: {
    async _loadDict() {
      const { property, validate } = this.context;
      const dictKey = property.ebParams.dictKey;
      if (!validate.readOnly && !property.ebReadOnly) {
        this.dict = await this.$store.dispatch('a/dict/getDict', { dictKey });
      }
      // load dict item
      await this._loadDictItem();
    },
    async _loadDictItem() {
      const { key, property, validate } = this.context;
      const dictKey = property.ebParams.dictKey;
      if (validate.readOnly || property.ebReadOnly) {
        this.dictItemTitle = this.context.getValue(`_${key}TitleLocale`);
      } else {
        const code = this.context.getValue();
        const options = property.ebParams && property.ebParams.options;
        const dictItem = await this.$store.dispatch('a/dict/findItem', { dictKey, code, options });
        this.dictItemTitle = dictItem ? dictItem.titleLocaleFull : null;
      }
    },
    async onChooseDict() {},
    _renderAsSelect() {
      const { parcel, key, property } = this.context;
      const options = this.dict._dictItems.map(item => {
        return {
          title: item.titleLocale,
          value: item.code,
        };
      });
      const propertyNew = this.$utils.extend({}, property, {
        ebType: 'select',
        ebOptions: options,
        ebParams: null,
      });
      return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
    },
    _renderAsTree() {
      const { dataPath } = this.context;
      const title = this.context.getTitle();
      return (
        <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseDict}>
          <div slot="after">{this.dictItemTitle}</div>
        </eb-list-item-choose>
      );
    },
  },
  render() {
    const { property, validate } = this.context;
    // readOnly
    if (validate.readOnly || property.ebReadOnly) {
      const title = this.context.getTitle();
      return (
        <f7-list-item title={title}>
          <div slot="after">{this.dictItemTitle}</div>
        </f7-list-item>
      );
    }
    // write
    if (!this.dict) return <div></div>;
    const mode = property.ebParams && property.ebParams.mode;
    if (!mode || mode === 'select') {
      return this._renderAsSelect();
    }
    return this._renderAsTree();
  },
};
