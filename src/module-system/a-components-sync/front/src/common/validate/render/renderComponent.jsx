export default {
  methods: {
    renderComponent(context, staticClass) {
      const { property } = context;
      return this._renderComponent(context, property.ebRender, staticClass);
    },
    _renderComponent(context, ebRender, staticClass) {
      const { key } = context;
      const props = this.$meta.util.extend({ options: { props: {} } }, ebRender);
      props.options.props.context = context;
      return <eb-list-item-component key={key} staticClass={staticClass} {...{ props }}></eb-list-item-component>;
    },
  },
};
