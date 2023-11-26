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
    getComponentInstance() {
      return this.$refs.stateTree.getComponentInstance();
    },
    onDictItemChange(node, checkedNodes) {
      // eslint-disable-next-line
      this.filterContainer.form.state = checkedNodes.map(node => node.data.codeFull);
    },
    onDictClearSelected() {
      // eslint-disable-next-line
      this.filterContainer.form.state = null;
    },
    _renderStateTree() {
      const selectedCodes = this.filterContainer.form.state;
      const options = {
        props: {
          dict: this.dict,
          leafOnly: true,
          checkOnLabel: true,
          multiple: true,
          maxLevelAutoOpened: 1,
          selectedCodes,
        },
        on: {
          dictItemChange: this.onDictItemChange,
          dictClearSelected: this.onDictClearSelected,
        },
      };
      return <eb-component ref="stateTree" module="a-dict" name="dictSelect" options={options}></eb-component>;
    },
  },
  render() {
    if (!this.dict) return null;
    const domStateTree = this._renderStateTree();
    return <div>{domStateTree}</div>;
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
