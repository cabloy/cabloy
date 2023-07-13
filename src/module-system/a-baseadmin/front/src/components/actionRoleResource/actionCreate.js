export default {
  methods: {
    async _onActionCreate() {
      const { ctx, action } = this.$props;
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // navigate
      const url = '/a/baseadmin/resourceRight/add';
      const navigateOptions = this._onActionCreate_navigateOptions({ ctx, action, dataOptions });
      ctx.$view.navigate(url, navigateOptions);
    },
    _onActionCreate_navigateOptions({ ctx, action, dataOptions }) {
      return Object.assign({}, action.navigateOptions, {
        context: {
          params: { atomMain: dataOptions.atomMain },
        },
      });
    },
  },
};
