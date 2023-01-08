export default {
  data() {
    return {};
  },
  methods: {
    async onPerformDone() {
      await this.$view.dialog.confirm();
      return true;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Demo')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::done" ref="buttonDone" propsOnPerform={this.onPerformDone}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        <f7-block-title medium></f7-block-title>
        <f7-block strong></f7-block>
      </eb-page>
    );
  },
};
