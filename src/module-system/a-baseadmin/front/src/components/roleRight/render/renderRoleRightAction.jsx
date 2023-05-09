export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      atomClass: null,
      atomClassBase: null,
      actionsBase: null,
      actionsUser: null,
      actionSelectOptions: null,
    };
  },
  computed: {
    atomMain() {
      const { validate } = this.context;
      return validate.host.atomMain;
    },
    atomClassIdTarget() {
      return this.context.getValue('atomClassIdTarget');
    },
    value() {
      return this.context.getValue();
    },
    actionCurrent() {
      if (!this.atomClass || !this.value) return null;
      // normal
      const action = this.getAction({
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
        name: this.actionName,
      });
      if (action) return action;
      // flow
      return this.actionsUser.find(item => item.actionId === parseInt(this.actionName));
    },
  },
  watch: {
    atomClassIdTarget: {
      handler(newValue) {
        this.__atomClassIdTargetChanged(newValue);
      },
      immediate: false, // true,
    },
  },
  created() {
    this.__loadActionSelectOptions();
  },
  methods: {
    async __atomClassIdTargetChanged() {
      this.context.setValue(null);
      await this.__loadActionSelectOptions();
    },
    async __loadActionSelectOptions() {
      // clear
      this.atomClassBase = null;
      this.atomClass = null;
      this.actionsBase = null;
      this.actionsUser = null;
      this.actionSelectOptions = null;
      // check
      if (!this.atomClassIdTarget) {
        return;
      }
      // atomClassBase
      this.atomClassBase = await this.$store.dispatch('a/base/getAtomClassBase', {
        atomClass: { id: this.atomClassIdTarget },
      });
      this.atomClass = {
        module: this.atomClassBase.module,
        atomClassName: this.atomClassBase.atomClassName,
      };
      // actionsBase
      this.actionsBase = await this.$store.dispatch('a/base/getActionsBase', {
        atomClass: this.atomClass,
      });
      // actionsUser
      const actionsUser = await this.$api.post('/a/base/atomClass/actionsUser', {
        atomClass: this.atomClass,
      });
      // normal
      const [groupAtom, groupBulk] = await this.__loadActionSelectOptions_normal({ actionsUser });
      // flow
      const groupFlows = await this.__loadActionSelectOptions_flow({ actionsUser });
      // ok
      this.actionsUser = actionsUser;
      this.actionSelectOptions = [groupAtom, groupBulk].concat(groupFlows);
    },
    async __loadActionSelectOptions_normal({ actionsUser }) {
      //
      const actionsBase = this.actionsBase;
      //
      const groupAtom = { title: 'Atom Actions', options: [] };
      const groupBulk = { title: 'Bulk Actions', options: [] };
      // atom/bulk
      for (const key in actionsBase) {
        const actionBase = actionsBase[key];
        if (!actionsUser.find(item => item.action === actionBase.code)) continue;
        if (actionBase.authorize === false) continue;
        const option = { title: actionBase.titleLocale, value: key };
        if (actionBase.code === 1 || !actionBase.bulk) {
          groupAtom.options.push(option);
        } else {
          groupBulk.options.push(option);
        }
      }
      return [groupAtom, groupBulk];
    },
    async __loadActionSelectOptions_flow({ actionsUser }) {
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
  },
  render() {
    if (!this.atomClassIdTarget) return null;
    const { dataPath, property, validate } = this.context;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{this.atomClassTitle}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseAtomClass}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{this.atomClassTitle}</div>
      </eb-list-item-choose>
    );
  },
};
