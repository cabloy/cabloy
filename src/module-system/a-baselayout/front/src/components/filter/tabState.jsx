export default {
  props: {
    layoutManager: {
      type: Object,
    },
    filterConfig: {
      type: Object,
    },
    filterContainer: {
      type: Object,
    },
  },
  data() {
    return {
      dict: null,
    };
  },
  computed: {
    atomStateDictKey() {
      return this.filterContainer.atomStateDictKey;
    },
  },
  watch: {
    atomStateDictKey() {
      this._loadDict();
    },
  },
  created() {
    this._loadDict();
  },
  methods: {
    async _loadDict() {
      const dictKey = this.atomStateDictKey;
      this.dict = await this.$store.dispatch('a/dict/getDict', { dictKey });
    },
    onItemChange(event, item) {
      // eslint-disable-next-line
      this.filterContainer.form.state = item ? item.code : null;
    },
    _renderStateSelect() {
      if (!this.dict) return null;
      // current state
      const stateCurrent = this.filterContainer.form.state;
      const children = [];
      children.push(
        <eb-list-item
          key="All"
          radio
          checked={stateCurrent === undefined || stateCurrent === null}
          title={this.$text('All')}
          onChange={event => this.onItemChange(event, null)}
        ></eb-list-item>
      );
      for (const item of this.dict._dictItems) {
        children.push(
          <eb-list-item
            key={item.code}
            radio
            checked={stateCurrent === item.code}
            title={item.titleLocale}
            onChange={event => this.onItemChange(event, item)}
          ></eb-list-item>
        );
      }
      return <eb-list inset>{children}</eb-list>;
    },
  },
  render() {
    const domStateSelect = this._renderStateSelect();
    return <div>{domStateSelect}</div>;
  },
};
