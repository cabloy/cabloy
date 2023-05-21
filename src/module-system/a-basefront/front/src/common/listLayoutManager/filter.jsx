export default {
  data() {
    return {};
  },
  methods: {
    async filter_onPrepareData() {
      // options
      const options = this.container.options || {};
      // state: maybe 0
      let state = options.state;
      if (state === undefined || state === null) {
        state = null;
      }
      // form
      const form = {
        atomName: null,
        mine: options.mine || 0,
        stage: options.stage || 'formal',
        state,
        language: options.language || '',
        category: options.category || 0,
        tag: options.tag || 0,
        star: options.star || 0,
        label: options.label || 0,
        role: options.role || 0,
        roleName: options.roleName || null,
        roleNameLocale: options.roleNameLocale || null,
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
        // state
        if (form.state !== undefined && form.state !== null) {
          options.where['a.atomState'] = form.state;
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
