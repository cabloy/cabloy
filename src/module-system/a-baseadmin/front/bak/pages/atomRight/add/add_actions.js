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
      //
      const groupFlows = [];
      //
      const actionsFlow = actionsUser
        .filter(item => item.actionMode === 1)
        .sort((a, b) => {
          const locale = this.$meta.util.getLocale();
          return a.flowDefNameLocale.localeCompare(b.flowDefNameLocale, locale);
        })
        .group(item => item.flowDefNameLocale);
      //
      for (const flowDefNameLocale in actionsFlow) {
        const actions = actionsFlow[flowDefNameLocale];
        const groupFlow = { title: `${this.$text('WorkFlow Actions')}: ${flowDefNameLocale}`, options: [] };
        for (const action of actions) {
          const option = { title: action.nameLocale, value: action.actionId };
          groupFlow.options.push(option);
        }
        groupFlows.push(groupFlow);
      }
      return groupFlows;
    },
    async loadActionSelectOptions() {
      // actionsUser
      const actionsUser = await this.$api.post('/a/base/atomClass/actionsUser', {
        atomClass: this.atomClass,
      });
      // normal
      const [groupAtom, groupBulk] = await this.loadActionSelectOptions_normal({ actionsUser });
      // flow
      const groupFlows = await this.loadActionSelectOptions_flow({ actionsUser });
      // ok
      this.actionsUser = actionsUser;
      this.actionSelectOptions = [groupAtom, groupBulk].concat(groupFlows);
    },
  },
};
