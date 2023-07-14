export default {
  data() {
    return {
      select: {
        selectedAtoms: [],
      },
    };
  },
  methods: {
    async select_openPageSelecting() {
      // params
      const selectedAtoms = this.select_getSelectedAtoms();
      const params = {
        selectMode: this.container.params?.selectMode,
        selectedAtoms,
      };
      const url = '/a/basefront/atom/selecting';
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            atomClass: this.container.atomClass,
            options: this.container.options,
            params,
            resource: this.container.resource,
          },
          callback: (code, selectedAtoms) => {
            if (code === 200) {
              if (!Array.isArray(selectedAtoms)) {
                selectedAtoms = [selectedAtoms];
              }
              this.container.params.selectedAtomIds = selectedAtoms.map(item => item.atomId);
              this.page_onRefresh();
            }
          },
        },
      });
    },
    async select_initCheckSelectedAtoms() {
      if (this.container.scene !== 'select') return;
      const selectedAtomIds = this.container.params?.selectedAtomIds;
      if (selectedAtomIds && selectedAtomIds.length > 0) return;
      // direct selecting
    },
    async select_prepareSelectedAtoms() {
      if (this.container.scene !== 'selecting') return;
      // selectedAtoms
      if (this.container.params?.selectedAtoms) {
        this.select.selectedAtoms = this.container.params?.selectedAtoms;
        return;
      }
      // selectedAtomIds
      const selectedAtomIds = this.container.params?.selectedAtomIds;
      if (selectedAtomIds && selectedAtomIds.length > 0) {
        // fetch
        const options = {
          where: {
            'a.id': selectedAtomIds,
          },
        };
        if (this.container.resource) {
          options.resource = 1;
          options.resourceLocale = this.$meta.util.getLocale();
        }
        const params = {
          atomClass: this.base.atomClass,
          options,
        };
        const res = await this.$api.post('/a/base/atom/select', params);
        this.select.selectedAtoms = res.list;
        return;
      }
    },
    select_getSelectedAtoms() {
      if (this.container.scene === 'selecting') {
        return this.select.selectedAtoms;
      }
      if (this.container.scene === 'select') {
        return this.base_getItems();
      }
    },
    select_onItemChange(event, item) {
      const selectMode = this.container.params?.selectMode;
      if (selectMode === 'single') {
        if (event.currentTarget.checked) {
          this.select.selectedAtoms = [item];
        }
      } else {
        const selectedAtoms = this.select.selectedAtoms;
        const index = selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
        if (event.currentTarget.checked && index === -1) {
          selectedAtoms.push(item);
        } else if (!event.currentTarget.checked && index > -1) {
          selectedAtoms.splice(index, 1);
        }
      }
    },
  },
};
