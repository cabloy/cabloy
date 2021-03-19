export default {
  methods: {
    renderGroup(c, context) {
      const { data, key, property, dataPath } = context;
      // context2
      const context2 = {
        data: data[key],
        pathParent: dataPath + '/',
        schema: context.schema,
        properties: property.properties,
      };
      // children
      const children = this.renderProperties(c, context2);
      // group
      const titleHidden = property.ebParams && property.ebParams.titleHidden;
      if (!titleHidden) {
        const group = c('f7-list-item', {
          attrs: {
            groupTitle: true,
            title: this.getTitle(context),
          },
        });
        // combine
        children.unshift(group);
      }
      // group
      const className = property.ebGroupWhole ? 'eb-list-group-whole' : 'eb-list-group';
      return c('f7-list-group', {
        staticClass: className,
      }, children);
    },
  },
};
