export default {
  data() {
    return {};
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Demo')} eb-back-link="Back"></eb-navbar>
        <f7-block-title medium></f7-block-title>
        <f7-block strong> </f7-block>
      </eb-page>
    );
  },
};
