export default {
  data() {
    return {};
  },
  methods: {
    async filter_onPrepareData() {
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
        role: (this.container.options && this.container.options.role) || 0,
        roleName: (this.container.options && this.container.options.roleName) || null,
        roleNameLocale: (this.container.options && this.container.options.roleNameLocale) || null,
        atomClass: this.container.atomClass,
      };
      // formAtomClass
      const formAtomClass = this.$meta.util.getProperty(this.container, 'params.filter.formAtomClass') || {};
      // validator: tabBasic/tabGeneral
      const schemaBasic = await this.filter_loadSchemaBasic();
      const schemaGeneral = await this.filter_loadSchemaGeneral();
      // validator: formAtomClass
      const schemaSearch = await this.filter_loadSchemaSearch(this.container.atomClass);
      // ok
      return {
        form,
        formAtomClass,
        schemaBasic,
        schemaGeneral,
        schemaSearch,
        searchStatesBasic: null,
        searchStatesGeneral: null,
        searchStatesSearch: null,
      };
    },
    async filter_loadSchemaBasic() {
      const filterConfig = this.filter_getConfig();
      const configTabBasic = filterConfig.tabs.basic;
      return await this.filter_loadSchemaAndCombineSearchClauseLoadModules({
        module: configTabBasic.schema.module,
        schema: configTabBasic.schema.schema,
      });
    },
    async filter_loadSchemaGeneral() {
      const filterConfig = this.filter_getConfig();
      const configTabGeneral = filterConfig.tabs.general;
      return await this.filter_loadSchemaAndCombineSearchClauseLoadModules({
        module: configTabGeneral.schema.module,
        schema: configTabGeneral.schema.schema,
      });
    },
    async filter_loadSchemaSearch(atomClass) {
      if (!atomClass) return null;
      // validator
      const validator = await this.$api.post('/a/base/atomClass/validatorSearch', {
        atomClass: {
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
        },
      });
      // schema
      return await this.filter_loadSchemaAndCombineSearchClauseLoadModules({
        module: validator.module,
        validator: validator.validator,
        schema: null,
      });
    },
    filter_onCombineSelectParams() {
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
        // atomName、mine、stage、language、star、label、atomClass
        // category、tag
        const clause1 = this.$meta.util.combineSearchClause({
          ctx: this,
          schema: this.filter.data.schemaBasic,
          data: form,
          searchStates: this.filter.data.searchStatesBasic,
        });
        const clause2 = this.$meta.util.combineSearchClause({
          ctx: this,
          schema: this.filter.data.schemaGeneral,
          data: form,
          searchStates: this.filter.data.searchStatesGeneral,
        });
        const clause = Object.assign({}, clause1, clause2);
        // atomClass
        if (clause.atomClass) {
          params.atomClass = clause.atomClass.val;
          delete clause.atomClass;
        }
        // atomName、createdAt
        if (clause.__or__atomNameResource) {
          options.where.__or__atomNameResource = clause.__or__atomNameResource;
          delete clause.__or__atomNameResource;
        }
        if (clause.__and__createdAt) {
          options.where.__and__createdAt = clause.__and__createdAt;
          delete clause.__and__createdAt;
        }
        // mine、stage、language、star、label、atomClass
        for (const key in clause) {
          options[key] = clause[key].val;
        }
        // category、tag
        if (form.category) {
          options.category = form.category;
        }
        if (form.tag) {
          options.tag = form.tag;
        }
      }
      // formAtomClass
      const formAtomClass = this.filter.data.formAtomClass;
      if (formAtomClass) {
        const clause = this.$meta.util.combineSearchClause({
          ctx: this,
          schema: this.filter.data.schemaSearch,
          data: formAtomClass,
          searchStates: this.filter.data.searchStatesSearch,
        });
        if (clause) {
          Object.assign(options.where, clause);
          if (Object.keys(clause).length > 0) {
            options.mode = 'search';
          }
        }
      }
      // ok
      return params;
    },
  },
};
