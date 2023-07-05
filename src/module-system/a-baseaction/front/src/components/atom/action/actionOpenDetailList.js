export default {
  methods: {
    async _onActionOpenDetailList() {
      const { ctx, action, item } = this.$props;
      // atomMainFrom
      let atomIdMain;
      let atomMain;
      if (action.params.atomMainFrom === 'dataOptions') {
        // dataOptions
        const dataOptions = action.dataOptions || {};
        atomIdMain = dataOptions.atomIdMain;
        atomMain = dataOptions.atomMain;
      } else {
        atomIdMain = item.atomId;
        atomMain = item;
      }
      // options
      const options = {
        atomIdMain,
      };
      // params
      const params = {
        //  pageTitle: '',
      };
      // queries
      const queries = {
        module: action.params.atomClass.module,
        atomClassName: action.params.atomClass.atomClassName,
        options: JSON.stringify(options),
        params: JSON.stringify(params),
      };
      // url
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      // open
      let navigateOptions = action.navigateOptions;
      if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
        navigateOptions = { target: '_self' };
      }
      navigateOptions = Object.assign({}, navigateOptions, {
        context: {
          params: { atomMain },
        },
      });
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
