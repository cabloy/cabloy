export default {
  methods: {
    async loadActionSelectOptions_normal({ actionsUser }) {
      //
      const actions = this.getActionsOfAtomClass(this.atomClass);
      //
      const groupAtom = { title: 'Atom Actions', options: [] };
      const groupBulk = { title: 'Bulk Actions', options: [] };
      // atom/bulk
      for (const key in actions) {
        const action = actions[key];
        if (!actionsUser.find(item => item.action === action.code)) continue;
        if (action.authorize === false) continue;
        const option = { title: action.titleLocale, value: key };
        if (action.code === 1 || !action.bulk) {
          groupAtom.options.push(option);
        } else {
          groupBulk.options.push(option);
        }
      }
      return [groupAtom, groupBulk];
    },
    async loadActionSelectOptions_flow({ actionsUser }) {
      const groupFlow = { title: 'WorkFlow Actions', options: [] };
      for (const actionUser of actionsUser) {
        if (actionUser.actionMode !== 1) continue;
        const option = { title: actionUser.nameLocale, value: actionUser.actionId };
        groupFlow.options.push(option);
      }
      return groupFlow;
    },
    async loadActionSelectOptions() {
      // actionsUser
      const actionsUser = await this.$api.post('/a/base/atomClass/actionsUser', {
        atomClass: this.atomClass,
      });
      // normal
      const [groupAtom, groupBulk] = await this.loadActionSelectOptions_normal({ actionsUser });
      // flow
      const groupFlow = await this.loadActionSelectOptions_flow({ actionsUser });
      // ok
      this.actionsUser = actionsUser;
      this.actionSelectOptions = [groupAtom, groupBulk, groupFlow];
    },
  },
};
