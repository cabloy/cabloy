export default {
  data() {
    return {
      filter: {
        data: null,
        tabNameCurrent: null,
      },
    };
  },
  methods: {
    async filter_prepareData() {
      this.filter.data = await this.filter_onPrepareData();
    },
    async filter_loadSchemaAndCombineSearchClauseLoadModules({ module, validator, schema }) {
      // module
      await this.$meta.module.use(module);
      // load
      const _schema = await this.$api.post('/a/validation/validation/schema', {
        module,
        validator,
        schema,
      });
      // combine
      await this.$meta.util.combineSearchClauseLoadModules({ schema: _schema });
      // ok
      return _schema;
    },
    filter_prepareSelectParams() {
      return this.filter_onCombineSelectParams();
    },
    filter_getSchemaSearch() {
      return this.$meta.util.getProperty(this.filter, 'data.schemaSearch');
    },
    filter_getSchemaSearchProperty({ schema, key }) {
      return this.$meta.util.getProperty(schema, `properties.${key}`);
    },
    filter_getConfig() {
      return this.$meta.util.getProperty(this.layout.configFull, 'info.filter');
    },
    filter_openTab(tabName) {
      this.filter.tabNameCurrent = tabName;
      this.filter_onPerform();
    },
    filter_onPerform() {
      const inPanel = this.$view.inPanel();
      const immediate = this.$meta.vueApp.layout === 'pc' && !inPanel;
      const filterConfig = this.filter_getConfig();
      const actionPath = filterConfig.actionPath;
      const navigateOptions = {
        context: {
          params: {
            layoutManager: this,
            filterConfig,
            immediate,
          },
        },
      };
      if (immediate) {
        navigateOptions.scene = 'sidebar';
        navigateOptions.sceneOptions = { side: 'right', name: 'filter', title: 'Filter' };
      } else {
        navigateOptions.target = '_self';
      }
      this.$view.navigate(`${actionPath}?t=${Date.now()}`, navigateOptions);
    },
    filter_onChanged(value) {
      this.filter.data = value;
      // reload
      this.page_onRefresh();
    },
    filter_renderAction() {
      if (this.container.params?.disableFilter === true) return null;
      return (
        <eb-link iconF7="::search" tooltip={this.$text('Filter')} propsOnPerform={this.filter_onPerform}></eb-link>
      );
    },
  },
};
