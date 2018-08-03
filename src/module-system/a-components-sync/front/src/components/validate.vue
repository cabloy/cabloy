<script>
export default {
  name: 'eb-validate',
  render(c) {
    // slot
    if (!this.auto) return c('div', this.$slots.default);
    // schema
    if (this.auto && this.ready) return this.renderSchema(c);
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
  },
  data() {
    return {
      module: null,
      schema: null,
      verrors: null,
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
      if (!this.verrors) return '';
      dataPath = this.adjustDataPath(dataPath);
      const error = this.verrors.find(item => {
        if (dataPath.charAt(dataPath.length - 1) === '/') return item.dataPath.indexOf(dataPath) > -1;
        return item.dataPath === dataPath;
      });
      return error ? error.message : '';
    },
    clearError(dataPath) {
      if (!this.verrors) return;
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
    getValue(data, key, property) {
      if (data[key] === undefined) return property.default;
      return data[key];
    },
    setValue(data, key, value, property) {
      if (property.type === 'number') {
        data[key] = Number(value);
      } else if (property.type === 'boolean') {
        data[key] = Boolean(value);
      } else {
        data[key] = value;
      }
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
        const property = properties[key];
        // panel
        if (property.ebType === 'panel') {
          children.push(this.renderPanel(c, data, pathParent, key, property));
        }
        // group
        else if (property.ebType === 'group') {
          children.push(this.renderGroup(c, data, pathParent, key, property));
        }
        // text
        else if (property.ebType === 'text') {
          children.push(this.renderText(c, data, pathParent, key, property));
        }
        // toggle
        else if (property.ebType === 'toggle') {
          children.push(this.renderToggle(c, data, pathParent, key, property));
        }
        // select
        else if (property.ebType === 'select') {
          children.push(this.renderSelect(c, data, pathParent, key, property));
        }
      }
      return children;
    },
    renderPanel(c, data, pathParent, key, property) {
      const dataPath = pathParent + key + '/';
      return c('eb-list-panel', {
        attrs: {
          link: '#',
          title: this.$text(property.ebTitle || key),
          dataPath,
        },
        on: {
          click: event => {
            this.$view.navigate('/a/validation/validate', {
              target: '_self',
              context: {
                params: {
                  module: this.params.module,
                  validator: this.params.validator,
                  schema: property.$ref,
                  data: data[key],
                  dataPathRoot: this.adjustDataPath(dataPath),
                  errors: this.verrors ? this.verrors.slice(0) : null,
                  readOnly: this.readOnly,
                },
                callback: (code, res) => {
                  if (code) {
                    data[key] = res.data;
                    this.verrors = res.errors;
                  }
                },
              },
            });
          },
        },
      });
    },
    renderGroup(c, data, pathParent, key, property) {
      const children = this.renderProperties(c, data[key], property.properties, `${pathParent}${key}/`);
      const group = c('f7-list-item', {
        attrs: { groupTitle: true, title: this.$text(property.ebTitle || key) },
      });
      children.unshift(group);
      return c('f7-list-group', children);
    },
    renderText(c, data, pathParent, key, property) {
      const title = this.$text(property.ebTitle || key);
      if (this.readOnly) {
        return c('f7-list-item', {
          attrs: {
            title,
            after: data[key] ? data[key].toString() : null,
          },
        });
      }
      const placeholder = property.ebDescription ? this.$text(property.ebDescription) : title;
      let type;
      if (property.ebSecure) type = 'password';
      else type = 'text';
      return c('f7-list-item', [
        c('f7-label', {
          attrs: { floating: true },
          domProps: { innerText: title },
        }),
        c('eb-input', {
          attrs: {
            type,
            placeholder,
            clearButton: true,
            dataPath: pathParent + key,
            value: this.getValue(data, key, property),
          },
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
    renderToggle(c, data, pathParent, key, property) {
      const title = this.$text(property.ebTitle || key);
      return c('f7-list-item', [
        c('span', {
          staticClass: 'text-color-gray',
          domProps: { innerText: title },
        }),
        c('eb-toggle', {
          attrs: {
            dataPath: pathParent + key,
            value: this.getValue(data, key, property),
            disabled: this.readOnly,
          },
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
    renderSelect(c, data, pathParent, key, property) {
      const title = this.$text(property.ebTitle || key);
      const attrs = {
        name: key,
        dataPath: pathParent + key,
        value: this.getValue(data, key, property),
        readOnly: this.readOnly,
      };
      if (property.ebOptions) attrs.options = property.ebOptions;
      if (property.ebOptionsUrl) attrs.optionsUrl = property.ebOptionsUrl;
      if (property.ebOptionsUrlParams) attrs.optionsUrlParams = property.ebOptionsUrlParams;
      if (property.ebOptionTitleKey) attrs.optionTitleKey = property.ebOptionTitleKey;
      if (property.ebOptionValueKey) attrs.optionValueKey = property.ebOptionValueKey;
      if (property.ebMultiple) attrs.multiple = property.ebMultiple;
      return c('f7-list-item', {
        attrs: {
          smartSelect: !this.readOnly,
          title,
          smartSelectParams: property.ebParams || { openIn: 'page', closeOnSelect: true },
        },
      }, [
        c('eb-select', {
          attrs,
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
  },
};

</script>
