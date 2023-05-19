export default {
  methods: {
    renderAtomItem(context) {
      const { key, property } = context;
      const title = this.getTitle(context, true);
      // params
      const external = property.ebParams.external;
      const target = property.ebParams.target;
      // value format
      let value = context.getValue();
      value = this._formatTextGeneral(property, value);
      // not use parcel.data
      let href = this.$meta.util.replaceTemplate(property.ebParams.href, this.parcel.data);
      if (!external) {
        href = this.$meta.util.combinePagePath(this.validate.renderModuleName, href);
      }
      // props
      const props = {
        title,
        ebHref: href,
      };
      if (value) {
        props.after = value;
      }
      // target/external
      if (external === true) {
        props.link = false;
        props.externalLink = false;
        props.external = true;
        props.target = target;
      } else {
        props.link = true;
        props.externalLink = true;
        props.external = false;
        props.ebTarget = target;
      }
      return <eb-list-item key={key} {...{ props }}></eb-list-item>;
    },
  },
};
