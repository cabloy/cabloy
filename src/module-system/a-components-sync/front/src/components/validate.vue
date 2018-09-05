<script>
export default {
  name: 'eb-validate',
  render(c) {
    // slot
    if (!this.auto) return c('div', this.$slots.default);
    // schema
    if (this.auto && this.ready) {
      // custom
      if (this.custom) {
        return c('custom', {
          props: {
            data: this.data,
            readOnly: this.readOnly,
            onSave: this.onSave,
          },
        });
      }
      // auto
      return this.renderSchema(c);
    }
  },
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    auto: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    params: {
      type: Object, // module,validator,schema
    },
    onPerform: {
      type: Function,
    },
    dataPathRoot: {
      type: String,
      default: '/',
    },
    errors: {
      type: Array,
    },
    onSave: {
      type: Function,
    },
  },
  data() {
    return {
      module: null,
      schema: null,
      verrors: null,
      custom: false,
    };
  },
  computed: {
    ready() {
      return this.data && this.schema;
    },
  },
  watch: {
    params() {
      this.$nextTick(() => {
        this.fetchSchema();
      });
    },
  },
  mounted() {
    this.fetchSchema();
  },
  methods: {
    reset() {
      this.verrors = null;
    },
    perform(event, context) {
      if (this.auto && !this.ready) return null;
      return this.onPerform(event, context)
        .then(data => {
          this.reset();
          return data;
        })
        .catch(err => {
          if (err) {
            if (err.code !== 422) throw err;
            this.verrors = err.message;
          }
        });
    },
    getError(dataPath) {
      if (!this.verrors || !dataPath) return '';
      dataPath = this.adjustDataPath(dataPath);
      const error = this.verrors.find(item => {
        if (dataPath.charAt(dataPath.length - 1) === '/') return item.dataPath.indexOf(dataPath) > -1;
        return item.dataPath === dataPath;
      });
      return error ? error.message : '';
    },
    clearError(dataPath) {
      if (!this.verrors || !dataPath) return;
      dataPath = this.adjustDataPath(dataPath);
      while (true) {
        const index = this.verrors.findIndex(item => item.dataPath === dataPath);
        if (index > -1) { this.verrors.splice(index, 1); } else { break; }
      }
    },
    adjustDataPath(dataPath) {
      if (!dataPath) return dataPath;
      if (dataPath[0] !== '/') return this.dataPathRoot + dataPath;
      return dataPath;
    },
    fetchSchema() {
      if (!this.params) return;
      if (!this.params.module) this.params.module = this.$page.$module.name;
      this.$meta.module.use(this.params.module, module => {
        this.module = module;
        this.$api.post('/a/validation/validation/schema', {
          module: this.params.module,
          validator: this.params.validator,
          schema: this.params.schema,
        }).then(data => {
          this.schema = data;
          if (this.errors) this.verrors = this.errors;
          // custom
          const _componentName = this.schema.meta && this.schema.meta.custom && this.schema.meta.custom.component;
          if (_componentName) {
            const _component = module.options.components[_componentName];
            this.$meta.util.setComponentModule(_component, module);
            this.$options.components.custom = _component;
            this.custom = true;
          }
          // event
          this.$emit('schema:ready', this.schema);
        });
      });
    },
    renderSchema(c) {
      const children = this.renderProperties(c, this.data, this.schema.properties, '');
      return c('f7-list', { attrs: { form: true, noHairlinesMd: true } }, children);
    },
    renderProperties(c, data, properties, pathParent) {
      const children = [];
      for (const key in properties) {
        children.push(c('validate-item', {
          key,
          props: {
            dataKey: key,
            pathParent,
          },
        }));
      }
      return children;
    },

  },
};

</script>
