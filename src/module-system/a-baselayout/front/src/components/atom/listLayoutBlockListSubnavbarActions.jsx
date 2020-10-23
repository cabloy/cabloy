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
    _renderActions() {
      const children = [];
      if (this.layoutManager.actionsBulk && this.actionsAll) {
        children.push(
          <f7-link iconMaterial="grading"></f7-link>
        );
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
          <div class="actions-block actions-block-left">ss</div>
          {this._renderActions()}
        </div>

      </f7-subnavbar>
    );
  },
};
