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
      console.log(this.dict);
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.locales,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
