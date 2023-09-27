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
      const useStoreAtomState = await this.$store.use('a/basestore/atomState');
      this.dict = await useStoreAtomState.getDict({
        atomClass: this.filterContainer.atomClass,
        atomStage: this.filterContainer.stage,
      });
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
        children.push(this._renderStateSelectItem({ item, stateCurrent }));
      }
      return <eb-list inset>{children}</eb-list>;
    },
    _renderStateSelectItem({ item, stateCurrent }) {
      const isDraft = this.filterContainer.stage === 0 || this.filterContainer.stage === 'draft';
      if (isDraft && [-1, -3].includes(item.code)) return null;
      return (
        <eb-list-item
          key={item.code}
          radio
          checked={stateCurrent === item.code}
          title={item.titleLocale}
          onChange={event => this.onItemChange(event, item)}
        ></eb-list-item>
      );
    },
  },
  render() {
    const domStateSelect = this._renderStateSelect();
    return <div>{domStateSelect}</div>;
  },
};
