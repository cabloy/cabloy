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
        const context = {
          validate: this,
          parcel: this.parcel,
          readOnly: this.readOnly,
          onSubmit: this.onSubmit,
        };
        return c('eb-component', {
          props: {
            module: this.custom.module,
            name: this.custom.name,
            options: {
              props: {
                context,
              },
            },
          },
        });
      }
      // auto
      return this.renderSchema(c);
    }
    return c('div');
  },
  props: {
    containerMode: {
      type: String,
    },
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
  },
  data() {
    return {
      schema: null,
      verrors: null,
      custom: null,
      schemaModuleName: null,
      renderModuleName: null,
      parcel: null,
    };
  },
  computed: {
    ready() {
      return this.data && this.parcel && this.schema;
    },
  },
  watch: {
    params() {
      this.custom = null;
      this.$nextTick(() => {
        this.fetchSchema();
      });
    },
    data() {
      this.initParcel();
    },
  },
  created() {
    this.initParcel();
  },
  mounted() {
    this.fetchSchema();
  },
  methods: {
    initParcel() {
      this.parcel = {
        data: this.$meta.util.extend({}, this.data),
        dataSrc: this.data,
        pathParent: '',
      };
    },
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
            throw new Error(this.$text('Data Validation Error'));
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
        this.schemaModuleName = this.meta.schema.module || this.$page.$module.name;
        this.$meta.module.use(this.schemaModuleName, () => {
          this.__schemaReady(this.meta.schema.schema, this.schemaModuleName);
        });
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
          this.__schemaReady(data.schema, moduleName);
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
      return c('validateItem', {
        props: {
          parcel: this.parcel,
          dataKey: null,
          schema: this.schema,
          properties: this.schema.properties,
          property: null,
          meta: null,
          root: true,
        },
      });
    },
    onSubmit(event) {
      this.$emit('submit', event);
    },
  },
};

</script>
