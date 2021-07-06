export default {
  methods: {
    renderGroup(c, context) {
      const { parcel, key, property, dataPath } = context;
      const value = context.getValue();
      // parcel2
      const parcel2 = {
        data: value,
        dataSrc: parcel.dataSrc[key],
        schema: parcel.schema,
        properties: property.properties,
        pathParent: dataPath + '/',
      };
      // context2
      const context2 = {
        parcel: parcel2,
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
      return c(
        'f7-list-group',
        {
          staticClass: className,
        },
        children
      );
    },
  },
};
