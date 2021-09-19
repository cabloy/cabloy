export default {
  methods: {
    renderComponent(context) {
      const { property } = context;
      return this._renderComponent(context, property.ebRender);
    },
    _renderComponent(context, ebRender) {
      const { key } = context;
      const props = this.$meta.util.extend({ options: { props: {} } }, ebRender);
      props.options.props.context = context;
      return <eb-list-item-component key={key} {...{ props }}></eb-list-item-component>;
    },
  },
};
