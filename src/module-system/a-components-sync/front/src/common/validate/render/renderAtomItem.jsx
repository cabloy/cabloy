export default {
  methods: {
    renderAtomItem(context) {
      const { key, property } = context;
      const title = this.getTitle(context, true);
      // params
      const atomClass = property.ebParams.atomClass;
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // value format
      let value = context.getValue();
      value = this._formatTextGeneral(property, value);
      // atomId: maybe from host
      const atomId = this.getAtomId(context, false);

      // props
      const props = {
        title,
        link: '#',
        onPerform: event => {
          console.log('ssss');
        },
      };
      if (value) {
        props.after = value;
      }
      return <eb-list-item key={key} {...{ props }}></eb-list-item>;
    },
  },
};
