export default {
  methods: {
    renderAtomItem(context) {
      const { key, property } = context;
      const title = this.getTitle(context, true);
      // value format
      let value = context.getValue();
      value = this._formatTextGeneral(property, value);
      // props
      const props = {
        title,
        link: '#',
        onPerform: event => {
          this.renderAtomItem_onPerform(event, context);
        },
      };
      if (value) {
        props.after = value;
      }
      return <eb-list-item key={key} {...{ props }}></eb-list-item>;
    },
    renderAtomItem_onPerform(event, context) {
      const { property } = context;
      // params
      const atomClass = property.ebParams.atomClass;
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // atomId: maybe from host
      const atomId = this.getAtomId(context, false);
      console.log('ssss');
    },
  },
};
