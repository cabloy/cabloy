export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    onPerformAdd() {
      // selectedAtomIds
      const selectedAtoms = this.layoutManager.getSelectedAtoms();
      const selectedAtomIds = selectedAtoms.map(item => item.atomId);
      const params = {
        selectMode: this.layoutManager.selectMode,
        selectedAtomIds,
      };
      const url = '/a/base/atom/selecting';
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            atomClass: this.layoutManager.atomClass,
            options: this.layoutManager.options,
            params,
          },
          callback: (code, selectedAtoms) => {
            if (code === 200) {
              this.layoutManager.params.selectedAtomIds = selectedAtoms.map(item => item.atomId);
            }
          },
        },
      });
    },
    onPerformDone() {
      // selectedAtoms
      const selectedAtoms = this.getSelectedAtoms();
      // ok
      this.contextCallback(200, selectedAtoms);
      this.$f7router.back();
    },
    getSelectedAtoms() {
      const selectedAtoms = this.layoutManager.getSelectedAtoms();
      let res;
      if (this.layoutManager.params.selectMode === 'single') {
        res = (selectedAtoms && selectedAtoms.length > 0) ? selectedAtoms[0] : null;
      } else {
        res = (selectedAtoms && selectedAtoms.length > 0) ? selectedAtoms : null;
      }
    },
  },
  render() {
    return (
      <f7-nav-right>
        <eb-link iconMaterial="add" propsOnPerform={this.onPerformAdd}></eb-link>
        <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>
      </f7-nav-right>
    );
  },
};
