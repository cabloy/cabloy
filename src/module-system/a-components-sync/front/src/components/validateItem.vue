<script>
export default {
  name: 'eb-list-item-validate',
  render(c) {
    return this.renderItem(c);
  },
  props: {
    dataKey: {
      type: String,
    },
    pathParent: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
    },
  },
  data() {
    return {
      validate: null,
    };
  },
  created() {
    this.validate = this.getValidate();
  },
  beforeDestroy() {
    this.validate = null;
  },
  methods: {
    getValidate() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options._componentTag === 'eb-validate') break;
        parent = parent.$parent;
      }
      return parent;
    },
    getValue(data, key, property) {
      if (data[key] === undefined) return property.default;
      return data[key];
    },
    setValue(data, key, value, property) {
      let _value;
      if (property.type === 'number') {
        _value = Number(value);
      } else if (property.type === 'boolean') {
        _value = Boolean(value);
      } else {
        _value = value;
      }
      if (data[key] !== _value) {
        this.$emit('change', _value);
      }
      this.$set(data, key, _value); // always set as maybe Object
    },
    adjustDataPath(dataPath) {
      if (!dataPath) return dataPath;
      if (dataPath[0] !== '/') return this.validate.dataPathRoot + dataPath;
      return dataPath;
    },
    renderItem(c) {
      return this._renderItem(c, this.validate.data, this.validate.schema.properties, this.dataKey, this.pathParent, { options: this.options });
    },
    _renderItem(c, data, properties, key, pathParent, meta) {
      const property = properties[key];
      // panel
      if (property.ebType === 'panel') {
        return this.renderPanel(c, data, pathParent, key, property);
      }
      // group
      else if (property.ebType === 'group') {
        return this.renderGroup(c, data, pathParent, key, property);
      }
      // text
      else if (property.ebType === 'text') {
        return this.renderText(c, data, pathParent, key, property);
      }
      // toggle
      else if (property.ebType === 'toggle') {
        return this.renderToggle(c, data, pathParent, key, property);
      }
      // select
      else if (property.ebType === 'select') {
        return this.renderSelect(c, data, pathParent, key, property, meta);
      }
      return c('div', {
        domProps: {
          innerText: 'not support',
        },
      });
    },
    renderProperties(c, data, properties, pathParent) {
      const children = [];
      for (const key in properties) {
        children.push(this._renderItem(c, data, properties, key, pathParent, {}));
      }
      return children;
    },
    renderPanel(c, data, pathParent, key, property) {
      const dataPath = pathParent + key + '/';
      return c('eb-list-item-panel', {
        key,
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
                  readOnly: this.validate.readOnly || property.ebReadOnly,
                },
                callback: (code, res) => {
                  if (code) {
                    this.setValue(data, key, res.data, property);
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
      return c('f7-list-group', { key }, children);
    },
    renderText(c, data, pathParent, key, property) {
      const title = this.$text(property.ebTitle || key);
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          attrs: {
            title,
            after: data[key] ? data[key].toString() : null,
          },
        });
      }
      const placeholder = property.ebDescription ? this.$text(property.ebDescription) : title;
      let type;
      if (property.ebSecure) type = 'password';
      if (property.ebTextarea) type = 'textarea';
      else type = 'text';
      return c('f7-list-item', {
        key,
      }, [
        c('f7-label', {
          attrs: { floating: true },
          domProps: { innerText: title },
        }),
        c('eb-input', {
          attrs: {
            type,
            placeholder,
            resizable: property.ebTextarea,
            clearButton: !this.validate.readOnly && !property.ebReadOnly,
            dataPath: pathParent + key,
            value: this.getValue(data, key, property),
            disabled: this.validate.readOnly || property.ebReadOnly,
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
      return c('f7-list-item', {
        key,
      }, [
        c('span', {
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-toggle', {
          attrs: {
            dataPath: pathParent + key,
            value: this.getValue(data, key, property),
            disabled: this.validate.readOnly || property.ebReadOnly,
          },
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
    renderSelect(c, data, pathParent, key, property, meta) {
      const title = this.$text(property.ebTitle || key);
      const attrs = {
        name: key,
        dataPath: pathParent + key,
        value: this.getValue(data, key, property),
        readOnly: this.validate.readOnly || property.ebReadOnly,
      };
      if (meta.options) attrs.options = meta.options;
      if (!meta.options && property.ebOptions) attrs.options = property.ebOptions;
      if (property.ebOptionsUrl) attrs.optionsUrl = property.ebOptionsUrl;
      if (property.ebOptionsUrlParams) attrs.optionsUrlParams = property.ebOptionsUrlParams;
      if (property.ebOptionTitleKey) attrs.optionTitleKey = property.ebOptionTitleKey;
      if (property.ebOptionValueKey) attrs.optionValueKey = property.ebOptionValueKey;
      if (property.ebMultiple) attrs.multiple = property.ebMultiple;
      return c('eb-list-item', {
        key,
        staticClass: property.ebReadOnly ? 'text-color-gray' : '',
        attrs: {
          smartSelect: !this.validate.readOnly && !property.ebReadOnly,
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
<style scoped>


</style>
