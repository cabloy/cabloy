<script>
import validateItem from './validateItem.vue';
export default {
  meta: {
    global: true,
  },
  name: 'eb-validate',
  components: {
    validateItem,
  },
  render(c) {
    // slot
    if (!this.auto) return c('div', this.$slots.default);
    // schema
    if (this.auto && this.ready) {
      // custom
      if (this.custom) {
        return c('eb-component', {
          props: {
            module: this.custom.module,
            name: this.custom.name,
            options: {
              props: {
                data: this.data,
                readOnly: this.readOnly,
                onSave: this.onSave,
              },
              on: { submit: this.onSubmit },
            },
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
    meta: {
      type: Object,
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
      schema: null,
      verrors: null,
      custom: null,
      schemaModuleName: null,
      renderModuleName: null,
    };
  },
  computed: {
    ready() {
      return this.data && this.schema;
    },
  },
  watch: {
    params() {
      this.custom = null;
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
      if (this.meta && this.meta.schema) {
        this.schemaModuleName = this.$page.$module.name;
        this.__schemaReady(this.meta.schema, this.schemaModuleName);
        return;
      }
      if (!this.params) return;
      const moduleName = this.params.module || this.$page.$module.name;
      this.schemaModuleName = moduleName;
      this.$meta.module.use(moduleName, () => {
        this.$api.post('/a/validation/validation/schema', {
          module: moduleName,
          validator: this.params.validator,
          schema: this.params.schema,
        }).then(data => {
          this.__schemaReady(data, moduleName);
        });
      });
    },
    __schemaReady(schema, moduleMaybe) {
      const _componentName = schema.meta && schema.meta.custom && schema.meta.custom.component;
      if (!_componentName) {
        this.renderModuleName = moduleMaybe;
        this.__schemaReady2(schema);
        return;
      }
      // custom
      const moduleName = schema.meta.custom.module || moduleMaybe;
      this.renderModuleName = moduleName;
      this.$meta.module.use(moduleName, () => {
        this.custom = {
          module: moduleName,
          name: _componentName,
        };
        this.__schemaReady2(schema);
      });
    },
    __schemaReady2(schema) {
      this.schema = schema;
      if (this.errors) this.verrors = this.errors;
      // event
      this.$emit('schema:ready', this.schema);
    },
    renderSchema(c) {
      const children = this.renderProperties(c, this.data, this.schema.properties, '');
      const attrs = {
        form: true,
        noHairlinesMd: true,
        inlineLabels: !this.$config.form.floatingLabel,
      };
      return c('eb-list', {
          attrs,
          on: { submit: this.onSubmit },
        },
        children);
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
    onSubmit(event) {
      this.$emit('submit', event);
    },
  },
};

</script>
