export default {
  methods: {
    renderLink(context) {
      const { key, property } = context;
      const title = this.getTitle(context, true);
      let value = context.getValue();
      // format
      value = this._formatTextGeneral(property, value);
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
      if (value) {
        props.after = value;
      }
      if (property.ebParams.external !== undefined) {
        props.external = property.ebParams.external;
      }
      if (property.ebParams.target !== undefined) {
        props.target = property.ebParams.target;
      }
      return <f7-list-item key={key} {...{ props }}></f7-list-item>;
    },
  },
};
