export default {
  props: {
    context: {
      type: Object,
    },
    atomClass: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    });
  },
  methods: {
    onChangeLanguage() {
      const { data } = this.context;
      this.$set(data, 'categoryId', null);
      this.$set(data, 'categoryName', null);
    },
  },
  render() {
    const { key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.languages,
    });
    return (
      <eb-list-item-validate
        dataKey={key} property={propertyNew} onChange={this.onChangeLanguage}>
      </eb-list-item-validate>
    );
  },
};
