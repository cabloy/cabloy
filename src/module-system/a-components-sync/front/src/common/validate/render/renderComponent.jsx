export default {
  methods: {
    renderComponent(context) {
      const { property } = context;
      return this._renderComponent(context, property.ebRender);
    },
    _renderComponent(context, ebRender) {
      const { key } = context;
      const renderProps = this.$meta.util.extend({ options: { props: {} } }, ebRender);
      renderProps.options.props.context = context;
      return <eb-list-item-component key={key} props={this.renderProps}></eb-list-item-component>;
    },
  },
};
