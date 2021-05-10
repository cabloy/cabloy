export default {
  methods: {
    renderLink(c, context) {
      const { parcel, property } = context;
      const title = this.getTitle(context, true);
      const href = this.$meta.util.combinePagePath(
        this.validate.renderModuleName,
        this.$meta.util.replaceTemplate(property.ebParams.href, parcel.data)
      );
      const props = {
        // link: '#',
        link: href,
        title,
      };
      if (property.ebParams.external !== undefined) {
        props.external = property.ebParams.external;
      }
      if (property.ebParams.target !== undefined) {
        props.target = property.ebParams.target;
      }
      return c('f7-list-item', {
        props,
      });
    },
  },
};
