export default {
  methods: {
    async loadActionSelectOptions_normal() {
      //
      const actions = this.getActionsOfAtomClass(this.atomClass);
      const actionsUser = await this.$api.post('/a/base/atomClass/actionsUser', {
        atomClass: this.atomClass,
      });
      //
      const groupAtom = { title: 'Atom Actions', options: [] };
      const groupBulk = { title: 'Bulk Actions', options: [] };
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
    async loadActionSelectOptions_flow() {},
    async loadActionSelectOptions() {
      // normal
      const [groupAtom, groupBulk] = await this.loadActionSelectOptions_normal();
      // flow
      const groupFlow = await this.loadActionSelectOptions_flow();
      // ok
      this.actionSelectOptions = [groupAtom, groupBulk, groupFlow];
    },
  },
};
