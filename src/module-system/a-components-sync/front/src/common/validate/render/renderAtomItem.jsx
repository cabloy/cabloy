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
    async renderAtomItem_onPerform(event, context) {
      const { property } = context;
      // params
      const atomClass = property.ebParams.atomClass;
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // atomId: maybe from host
      const atomId = this.getAtomId(context, false);
      // mode
      const mode = property.ebParams.mode;
      // item
      const item = {
        atomId,
        ...atomClass,
      };
      // perform action
      const actionName = mode === 'edit' ? 'write' : 'read';
      const useStoreAtomActions = await this.$store.use('a/basestore/atomActions');
      let actionBase = await useStoreAtomActions.getActionBase({ atomClass, name: actionName });
      actionBase = this.$utils.extend({ navigateOptions: { target } }, actionBase);
      return await this.$meta.util.performAction({ ctx: this, action: actionBase, item });
    },
  },
};
