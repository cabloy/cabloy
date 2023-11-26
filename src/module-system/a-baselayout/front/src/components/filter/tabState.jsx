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
    async onPerformClearState() {
      const tree = this.getComponentInstance().getInstance();
      await tree.uncheckNodes(this.filterContainer.form.state);
      // eslint-disable-next-line
      this.filterContainer.form.state = null;
    },
    onItemChange(event, item) {
      // eslint-disable-next-line
      this.filterContainer.form.state = item ? item.code : null;
    },
    onDictItemChange(node) {
      console.log(node.codeFull, node.attrs.checked);
    },
    _renderClearState() {
      return <eb-button propsOnPerform={this.onPerformClearState}>{this.$text('Clear State')}</eb-button>;
    },
    _renderStateTree() {
      // const selectedCategoryIds = [this.filterContainer.form.category];
      const options = {
        props: {
          dict: this.dict,
          leafOnly: true,
          checkOnLabel: true,
          multiple: true,
          maxLevelAutoOpened: 1,
          // selectedCodes,
        },
        on: {
          dictItemChange: this.onDictItemChange,
        },
      };
      return <eb-component ref="stateTree" module="a-dict" name="dictSelect" options={options}></eb-component>;
    },
  },
  render() {
    if (!this.dict) return null;
    const domClearState = this._renderClearState();
    const domStateTree = this._renderStateTree();
    return (
      <div>
        {domClearState}
        {domStateTree}
      </div>
    );
  },
};

// _renderStateSelect() {
//   if (!this.dict) return null;
//   // current state
//   const stateCurrent = this.filterContainer.form.state;
//   const children = [];
//   children.push(
//     <eb-list-item
//       key="All"
//       radio
//       checked={stateCurrent === undefined || stateCurrent === null}
//       title={this.$text('All')}
//       onChange={event => this.onItemChange(event, null)}
//     ></eb-list-item>
//   );
//   for (const item of this.dict._dictItems) {
//     children.push(this._renderStateSelectItem({ item, stateCurrent }));
//   }
//   return <eb-list inset>{children}</eb-list>;
// },
// _renderStateSelectItem({ item, stateCurrent }) {
//   const isDraft = this.filterContainer.stage === 0 || this.filterContainer.stage === 'draft';
//   const code = item.code;
//   if (isDraft && [-1, -3].includes(code)) return null;
//   return (
//     <eb-list-item
//       key={item.code}
//       radio
//       checked={stateCurrent === item.code}
//       title={item.titleLocale}
//       onChange={event => this.onItemChange(event, item)}
//     ></eb-list-item>
//   );
// },
