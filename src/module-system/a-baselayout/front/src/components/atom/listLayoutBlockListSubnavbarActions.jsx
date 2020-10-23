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
      this.layoutManager.onSelectingBulkSwitch();
    },
    onSelectingBulkChecking() {
      this.layoutManager.onSelectingBulkChecking();
    },
    _renderActionsLeft() {
      const children = [];
      // switch select
      const items = this.layoutManager.getItems();
      if (items.length > 0) {
        children.push(
          <eb-link iconMaterial="grading" propsOnPerform={this.onSelectingBulkSwitch} ></eb-link>
        );
      }
      const selectedAtomsBulk = this.layoutManager.selectedAtomsBulk;
      if (this.layoutManager.selectingBulk) {
        children.push(
          <eb-link iconMaterial={selectedAtomsBulk.length >= items.length ? 'check_box_outline_blank' : 'check_box'} iconBadge={selectedAtomsBulk.length} propsOnPerform={this.onSelectingBulkChecking} ></eb-link>
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
      if (this.layoutManager.actionsBulk && this.actionsAll) {
        for (const action of this.layoutManager.actionsBulk) {
          const _action = this.getAction({
            module: this.layoutManager.atomClass.module,
            atomClassName: this.layoutManager.atomClass.atomClassName,
            name: action.name,
          });
          children.push(
            <f7-link iconMaterial={_action.icon && _action.icon.material} tooltip={_action.icon && _action.titleLocale}>{!_action.icon && _action.titleLocale}</f7-link>
          );
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
        <div class="atom-list-subnavbarActions-container">
          {this._renderActionsLeft()}
          {this._renderActionsRight()}
        </div>

      </f7-subnavbar>
    );
  },
};
