import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomActions ],
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
    onSelectingBulkSwitch() {
      this.layoutManager.bulk_onSelectingSwitch();
    },
    onSelectingBulkChecking() {
      this.layoutManager.bulk_onSelectingChecking();
    },
    onAction(event, action) {
      this.$f7.tooltip.hide(event.currentTarget);
      let _action = this.getAction(action);
      if (!_action) return;
      let item;
      if (_action.name === 'create') {
        item = {
          atomClassId: action.atomClassId,
          module: action.module,
          atomClassName: action.atomClassName,
          atomClassIdParent: action.atomClassIdParent,
        };
        const createParams = this.$meta.util.getProperty(this.layoutManager.container.params, 'createParams');
        if (createParams) {
          item = this.$utils.extend({}, item, createParams);
        }
      }
      _action = this.$utils.extend({}, _action, { targetEl: event.target });
      return this.$meta.util.performAction({ ctx: this, action: _action, item });
    },
    _renderActionsLeft() {
      const children = [];
      // switch select
      const items = this.layoutManager.base_getItems();
      if (items.length > 0) {
        children.push(
          <eb-link iconMaterial="grading" propsOnPerform={this.onSelectingBulkSwitch} ></eb-link>
        );
      }
      const selectedAtoms = this.layoutManager.bulk.selectedAtoms;
      if (this.layoutManager.bulk.selecting) {
        children.push(
          <eb-link iconMaterial={selectedAtoms.length >= items.length ? 'check_box_outline_blank' : 'check_box'} iconBadge={selectedAtoms.length} propsOnPerform={this.onSelectingBulkChecking} ></eb-link>
        );
      }

      return (
        <div class="actions-block actions-block-left">
          {children}
        </div>
      );
    },
    _renderActionsRight() {
      const children = [];
      const selectedAtoms = this.layoutManager.bulk.selectedAtoms;
      if (this.layoutManager.bulk.actions && this.actionsAll) {
        for (const action of this.layoutManager.bulk.actions) {
          const _action = this.getAction(action);
          if (_action.select === undefined || _action.select === null ||
            (_action.select === true && selectedAtoms.length > 0) ||
            (_action.select === false && !this.layoutManager.bulk.selecting)
          ) {
            children.push(
              <eb-link iconMaterial={_action.icon && _action.icon.material} tooltip={_action.icon && _action.titleLocale} propsOnPerform={event => this.onAction(event, action)}>{!_action.icon && _action.titleLocale}</eb-link>
            );
          }
        }
      }
      return (
        <div class="actions-block actions-block-right">
          {children}
        </div>
      );
    },
  },
  render() {
    return (
      <f7-subnavbar>
        <div class="atom-list-subnavbar-container">
          {this._renderActionsLeft()}
          {this._renderActionsRight()}
        </div>

      </f7-subnavbar>
    );
  },
};
