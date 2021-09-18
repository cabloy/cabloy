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
      // form
      const form = {
        atomName: null,
        mine: (this.container.options && this.container.options.mine) || 0,
        stage: (this.container.options && this.container.options.stage) || 'formal',
        language: (this.container.options && this.container.options.language) || '',
        category: (this.container.options && this.container.options.category) || 0,
        tag: (this.container.options && this.container.options.tag) || 0,
        star: (this.container.options && this.container.options.star) || 0,
        label: (this.container.options && this.container.options.label) || 0,
        atomClass: this.container.atomClass,
      };
      const formAtomClass = this.$meta.util.getProperty(this.container, 'params.filter.formAtomClass') || {};
      // validator of formAtomClass
      const schemaSearch = await this.filter_loadSchemaSearch(this.container.atomClass);
      // ok
      this.filter.data = {
        form,
        formAtomClass,
        schemaSearch,
      };
    },
    async filter_loadSchemaSearch(atomClass) {
      if (!atomClass) return null;
      // module
      await this.$meta.module.use(atomClass.module);
      // validator
      const validator = await this.$api.post('/a/base/atomClass/validatorSearch', {
        atomClass: {
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
        },
      });
      // schema
      return await this.$api.post('/a/validation/validation/schema', {
        module: validator.module,
        validator: validator.validator,
        schema: null,
      });
    },
    filter_prepareSelectParams() {
      if (!this.filter.data) return null;
      // options
      const options = {
        where: {},
      };
      // params
      const params = {
        options,
      };
      // form
      const form = this.filter.data.form;
      if (form) {
        if (form.atomName) {
          const atomClass = form.atomClass ? this.getAtomClass(form.atomClass) : null;
          if (atomClass && atomClass.resource) {
            options.where.__or__atomNameResource = [{ 'a.atomName': { val: form.atomName, op: 'like' } }, { 'f.atomNameLocale': { val: form.atomName, op: 'like' } }];
          } else {
            options.where['a.atomName'] = { val: form.atomName, op: 'like' };
          }
        }
        options.mine = form.mine;
        options.stage = form.stage;

        if (form.language) {
          options.language = form.language;
        }
        if (form.category) {
          options.category = form.category;
        }
        if (form.tag) {
          options.tag = form.tag;
        }

        options.star = form.star;
        options.label = form.label;

        params.atomClass = form.atomClass;
      }
      // formAtomClass
      const formAtomClass = this.filter.data.formAtomClass;
      if (formAtomClass) {
        let hasValue = false;
        const schema = this.filter_getSchemaSearch();
        for (const key in formAtomClass) {
          const value = formAtomClass[key];
          // undefined/null/'', except 0/false
          if (value !== undefined && value !== null && value !== '') {
            const property = this.filter_getSchemaSearchProperty({ schema, key });
            const tableAlias = this.$meta.util.getProperty(property, 'ebSearch.tableAlias') || 'f';
            if (typeof value === 'string') {
              options.where[`${tableAlias}.${key}`] = { val: value, op: 'like' };
            } else {
              options.where[`${tableAlias}.${key}`] = value;
            }
            hasValue = true;
          }
        }
        if (hasValue) {
          options.mode = 'search';
        }
      }
      // ok
      return params;
    },
    filter_getSchemaSearch() {
      return this.$meta.util.getProperty(this.filter, 'data.schemaSearch');
    },
    filter_getSchemaSearchProperty({ schema, key }) {
      return this.$meta.util.getProperty(schema, `properties.${key}`);
    },
    filter_getConfig() {
      return this.$meta.util.getProperty(this.base.config, 'render.list.info.filter');
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
      if (this.container.params && this.container.params.disableFilter === true) return null;
      return <eb-link iconMaterial="search" propsOnPerform={this.filter_onPerform}></eb-link>;
    },
  },
};
