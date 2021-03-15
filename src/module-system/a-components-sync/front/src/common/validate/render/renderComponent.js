export default {
  methods: {
    renderComponent(c, context) {
      const { property } = context;
      return this._renderComponent(c, context, property.ebRender);
    },
    _renderComponent(c, context, ebRender) {
      const { data, pathParent, key, property, dataPath } = context;
      const renderProps = this.$meta.util.extend({ options: { props: {} } }, ebRender);
      renderProps.options.props.context = {
        validate: this.validate,
        validateItem: this,
        data,
        pathParent,
        key,
        schema: context.schema,
        properties: context.properties,
        property,
        dataPath,
        meta: context.meta,
        getTitle: notHint => {
          return this.getTitle(context, notHint);
        },
        getValue: () => {
          return this.getValue(data, key, property);
        },
        setValue: value => {
          this.setValue(data, key, value, property);
        },
      };
      return c('eb-list-item-component', {
        props: renderProps,
      });
    },
  },
};
