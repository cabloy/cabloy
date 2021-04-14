export default {
  methods: {
    renderComponent(c, context) {
      const { property } = context;
      return this._renderComponent(c, context, property.ebRender);
    },
    _renderComponent(c, context, ebRender) {
      const { key } = context;
      const renderProps = this.$meta.util.extend({ options: { props: {} } }, ebRender);
      renderProps.options.props.context = context;
      return c('eb-list-item-component', {
        key,
        props: renderProps,
      });
    },
  },
};
