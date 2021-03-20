export default {
  methods: {
    renderLink(c, context) {
      const { parcel, property } = context;
      const title = this.getTitle(context, true);
      const href = this.$meta.util.combinePagePath(
        this.validate.renderModuleName,
        this.$meta.util.replaceTemplate(property.ebParams.href, parcel.data)
      );
      return c('eb-list-item', {
        props: {
          link: '#',
          ebHref: href,
          title,
        },
      });
    },
  },
};
