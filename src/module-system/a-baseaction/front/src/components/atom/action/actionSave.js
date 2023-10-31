export default {
  methods: {
    async _onActionSave() {
      const { ctx, action } = this.$props;
      // save
      const { key, item, atomClass, isCreateDelay } = await this.base_handleActionSaveSubmit({ actionName: 'save' });
      // event: save
      if (!isCreateDelay) {
        ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, actionSource: ctx });
      }
      // toast
      this.base_handleToast();
      // return item
      return item;
    },
  },
};
