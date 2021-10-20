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
  computed: {},
  watch: {
    context() {
      this._loadDict();
    },
  },
  created() {
    this._loadDict();
  },
  methods: {
    async _loadDict() {
      const { key, property, validate } = this.context;
      if (validate.readOnly || property.ebReadOnly) {
        this.dictItemTitle = this.context.getValue(`_${key}TitleLocale`);
      } else {
        const dictKey = property.ebParams.dictKey;
        this.dict = await this.$store.dispatch('a/dict/getDict', { dictKey });
      }
    },
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
      const { parcel, dataPath, property, validate } = this.context;
      const title = this.context.getTitle();
      const categoryName = parcel.data.atomCategoryNameLocale || parcel.data.atomCategoryName;
      if (validate.readOnly || property.ebReadOnly) {
        return (
          <f7-list-item title={title}>
            <div slot="after">{categoryName}</div>
          </f7-list-item>
        );
      }
      return (
        <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseCategory}>
          <div slot="after">{categoryName}</div>
        </eb-list-item-choose>
      );
    },
  },
  render() {
    if (!this.dict) return <div></div>;
    const { property } = this.context;
    const mode = property.ebParams && property.ebParams.mode;
    if (!mode || mode === 'select') {
      return this._renderAsSelect();
    }
    return this._renderAsTree();
  },
};
