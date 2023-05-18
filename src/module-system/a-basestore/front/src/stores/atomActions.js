import Vue from 'vue';

export default {
  state() {
    return { actionsBases: {} };
  },
  actions: {
    // actionsBase
    setActionsBase({ atomClass, actionsBase }) {
      const key = `${atomClass.module}:${atomClass.atomClassName}`;
      this.actionsBases[key] = actionsBase;
    },
    getActionsBaseSync({ atomClass }) {
      const key = `${atomClass.module}:${atomClass.atomClassName}`;
      return Vue.get(this.actionsBases, key, () => {
        // get async
        return this.getActionsBase({ atomClass });
      });
    },
    async getActionsBase({ atomClass }) {
      const key = `${atomClass.module}:${atomClass.atomClassName}`;
      if (this.actionsBases[key]) return this.actionsBases[key];
      const actionsBase = await Vue.prototype.$meta.api.post('/a/base/base/getActionsBase', {
        atomClass,
      });
      this.setActionsBase({ atomClass, actionsBase });
      return actionsBase;
    },
    // actionBase
    async getActionBase({ atomClass, code, name }) {
      const actionsBase = await this.getActionsBase({ atomClass });
      return this._getActionBaseInner({ actionsBase, code, name });
    },
    getActionBaseSync({ atomClass, code, name }) {
      const actionsBase = this.getActionsBaseSync({ atomClass });
      if (!actionsBase) return actionsBase;
      return this._getActionBaseInner({ actionsBase, code, name });
    },
    _getActionBaseInner({ actionsBase, code, name }) {
      // prepare
      if (name && !isNaN(name)) {
        code = parseInt(name);
        name = null;
      } else if (code && isNaN(code)) {
        name = code;
        code = null;
      }
      // action
      if (name) return actionsBase[name];
      const key = Object.keys(actionsBase).find(key => actionsBase[key].code === code);
      return actionsBase[key];
    },
  },
};
