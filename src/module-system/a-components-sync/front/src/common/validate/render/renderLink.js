export default {
  methods: {
    renderLink(c, context) {
      const { property } = context;
      const title = this.getTitle(context, true);
      // not use parcel.data
      let href = this.$meta.util.replaceTemplate(property.ebParams.href, this.parcel.data);
      if (!property.ebParams.external) {
        href = this.$meta.util.combinePagePath(this.validate.renderModuleName, href);
      }
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
