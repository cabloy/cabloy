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
  created() {
    this._loadDict();
  },
  methods: {
    async _loadDict() {
      const dictKey = this.filterContainer.atomStateDictKey;
      this.dict = await this.$store.dispatch('a/dict/getDict', { dictKey });
    },
    onChange() {
      const checked = this.getComponentInstance().checked();
      // eslint-disable-next-line
      this.filterContainer.form.atomState = checked;
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
        ></eb-list-item>
      );
      for (const item of this.dict._dictItems) {
        children.push(
          <eb-list-item
            key={item.code}
            radio
            checked={stateCurrent === item.code}
            title={item.titleLocale}
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
