export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      dict: null,
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      const { property } = this.context;
      const dictKey = property.ebParams.dictKey;
      this.dict = await this.$store.dispatch('a/dict/getDict', { dictKey });
    },
    _renderAsSelect() {
      if (!this.dict) return <div></div>;
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
      return <div></div>;
    },
  },
  render() {
    const { property } = this.context;
    const mode = property.ebParams && property.ebParams.mode;
    if (!mode || mode === 'select') {
      return this._renderAsSelect();
    }
    return this._renderAsTree();
  },
};
