export default {
  data() {
    return {
      bulk: {
        actions: null,
        selectedAtoms: [],
        selecting: false,
      },
    };
  },
  methods: {
    bulk_onAction(event, action) {
      this.$f7.tooltip.hide(event.currentTarget);
      // action
      let _action = this.getAction(action);
      if (!_action) return;
      _action = this.$utils.extend({}, _action, { targetEl: event.target });
      // item
      let item = {
        atomClassId: action.atomClassId,
        module: action.module,
        atomClassName: action.atomClassName,
        atomClassIdParent: action.atomClassIdParent,
      };
      if (_action.name === 'create') {
        const createParams = this.$meta.util.getProperty(this.container.params, 'createParams');
        if (createParams) {
          item = this.$utils.extend({}, item, createParams);
        }
        const params = this.base_prepareSelectParams({ setOrder: false });
        if (params.options.language) {
          item.atomLanguage = params.options.language;
        }
        if (params.options.category) {
          item.atomCategoryId = params.options.category;
        }
      }
      // performAction
      return this.$meta.util.performAction({ ctx: this, action: _action, item });
    },
    bulk_loadActions() {
      if (this.bulk.actions) return;
      this.$api.post('/a/base/atom/actionsBulk', {
        atomClass: this.container.atomClass,
      }).then(data => {
        this.bulk.actions = data;
      });
    },
    bulk_onSelectingSwitch() {
      this.bulk.selecting = !this.bulk.selecting;
      if (!this.bulk.selecting) {
        this.bulk.selectedAtoms = [];
      }
    },
    bulk_onItemChange(event, item) {
      const selectedAtoms = this.bulk.selectedAtoms;
      const index = selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      if (event.target.checked && index === -1) {
        selectedAtoms.push(item);
      } else if (!event.target.checked && index > -1) {
        selectedAtoms.splice(index, 1);
      }
    },
    bulk_onSelectingChecking() {
      const items = this.base_getItems();
      const selectedAtoms = this.bulk.selectedAtoms;
      if (selectedAtoms.length >= items.length) {
        // uncheck all
        this.bulk.selectedAtoms = [];
      } else {
        // check all
        this.bulk.selectedAtoms = items.concat();
      }
    },
    bulk_renderActionsLeft() {
      const children = [];
      // switch select
      const items = this.base_getItems();
      const selectedAtoms = this.bulk.selectedAtoms;
      if (items.length > 0 || this.bulk.selecting) {
        children.push(
          <eb-link key="actionsLeft:select" iconMaterial="grading" propsOnPerform={this.bulk_onSelectingSwitch} ></eb-link>
        );
      }
      if (this.bulk.selecting) {
        children.push(
          <eb-link key="actionsLeft:selectChecking" iconMaterial={selectedAtoms.length >= items.length ? 'check_box_outline_blank' : 'check_box'} iconBadge={ selectedAtoms.length.toString()} propsOnPerform={this.bulk_onSelectingChecking} ></eb-link>
        );
      }
      return children;
    },
    bulk_renderActionsLeftB() {
      const children = [];
      // switch select
      // not check items.length > 0, so as to avoid splash
      // const items = this.base_getItems();
      const selectedAtoms = this.bulk.selectedAtoms;
      // if (items.length > 0 || this.bulk.selecting) {
      children.push(
        <eb-link key="actionsLeftB:select" iconMaterial="grading" iconBadge={ this.bulk.selecting ? selectedAtoms.length.toString() : 0} propsOnPerform={this.bulk_onSelectingSwitch} ></eb-link>
      );
      // }
      return children;
    },
    bulk_renderActionsRight() {
      const children = [];
      const selectedAtoms = this.bulk.selectedAtoms;
      if (this.bulk.actions && this.actionsAll) {
        for (const action of this.bulk.actions) {
          const _action = this.getAction(action);
          if (_action.select === undefined || _action.select === null ||
            (_action.select === true && selectedAtoms.length > 0) ||
            (_action.select === false && !this.bulk.selecting)
          ) {
            children.push(
              <eb-link key={`actionsRight:${_action.name}`} iconMaterial={_action.icon && _action.icon.material} tooltip={_action.icon && _action.titleLocale} propsOnPerform={event => this.bulk_onAction(event, action)}>{!_action.icon && _action.titleLocale}</eb-link>
            );
          }
        }
      }
      return children;
    },
  },
};
