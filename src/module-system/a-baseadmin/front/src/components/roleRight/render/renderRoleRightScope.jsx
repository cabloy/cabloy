export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ready() {
      return this.atomClassBase && this.actionBaseCurrent;
    },
    atomMain() {
      const { validate } = this.context;
      return validate.host.atomMain;
    },
    isOpenAuthScope() {
      return this.atomMain && this.atomMain.roleTypeCode === 6;
    },
    enableRight() {
      if (!this.ready) return false;
      if (this.isOpenAuthScope) return false;
      return this.atomClassBase.enableRight;
    },
    enableRightMine() {
      if (!this.enableRight) return false;
      return this.atomClassBase.enableRight.mine;
    },
    enableRightScopes() {
      if (!this.enableRight) return false;
      return this.atomClassBase.enableRight.role?.scopes;
    },
    action() {
      return this.context.getValue('action');
    },
    value() {
      return this.context.getValue();
    },
    atomClassBase() {
      return this.context.getValue('__atomClassBase');
    },
    actionBaseCurrent() {
      return this.context.getValue('__actionBaseCurrent');
    },
  },
  watch: {
    action: {
      handler(newValue) {
        this.__actionChanged(newValue);
      },
      immediate: false, // true,
    },
  },
  methods: {
    __actionChanged() {
      // this.context.setValue(null);
      // await this.__loadActionSelectOptions();
    },
  },
  render() {
    if (!this.enableRight) return null;
    return (
      <div>
        <eb-list-item title={this.$text('DataScope')} group-title></eb-list-item>
        <eb-list-item title={this.$text('DataScope')} group-title></eb-list-item>
      </div>
    );
  },
};
