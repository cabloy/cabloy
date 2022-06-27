export default {
  data() {
    return {};
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Todos')} eb-back-link="Back"></eb-navbar>
      </eb-page>
    );
  },
};
