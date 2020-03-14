<script>
export default {
  meta: {
    global: true,
  },
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
    meta: {
      type: Object,
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
    getMetaValue(key) {
      // 1. item
      const value = this.meta ? this.meta[key] : undefined;
      if (value !== undefined) return value;
      // 2. validate
      const validateMeta = this.validate.meta;
      return validateMeta ? validateMeta[key] : undefined;
    },
    getValue(data, key, property) {
      if (data[key] === undefined) return property.default;
      return data[key];
    },
    setValue(data, key, value, property) {
      let _value;

      if (property.ebType === 'select' && this.checkIfEmptyForSelect(value)) {
        _value = undefined; // for distinguish from 0
      } else {
        if (property.type === 'number') {
          _value = Number(value);
        } else if (property.type === 'boolean') {
          _value = Boolean(value);
        } else {
          _value = value;
        }
      }

      const _valueOld = data[key];

      this.$set(data, key, _value); // always set as maybe Object

      if (_valueOld !== _value) {
        this.$emit('change', _value);
        this.validate.$emit('validateItem:change', key, _value);
      }
    },
    checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    },
    adjustDataPath(dataPath) {
      if (!dataPath) return dataPath;
      if (dataPath[0] !== '/') return this.validate.dataPathRoot + dataPath;
      return dataPath;
    },
    getTitle(key, property) {
      const title = this.$text(property.ebTitle || key);
      // ignore panel/group/toggle
      const ebType = property.ebType;
      if (ebType === 'panel' || ebType === 'group' || ebType === 'toggle') return title;
      // only edit
      if (this.validate.readOnly || property.ebReadOnly) return title;
      // config
      const hintOptional = this.$config.validate.hint.optional;
      const hintMust = this.$config.validate.hint.must;
      // check optional
      if (hintOptional && !property.notEmpty) {
        return `${title}(${this.$text(hintOptional)})`;
      }
      // check must
      if (hintMust && property.notEmpty) {
        return `${title}(${this.$text(hintMust)})`;
      }
      // default
      return title;
    },
    renderItem(c) {
      if (!this.validate.data || !this.validate.schema) return c('div');
      return this._renderItem(c, this.validate.data, this.validate.schema.properties, this.dataKey, this.pathParent);
    },
    _renderItem(c, data, properties, key, pathParent) {
      const property = properties[key];
      // ignore if not specified
      if (!property.ebType) return null;
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
        return this.renderSelect(c, data, pathParent, key, property);
      }
      // file
      else if (property.ebType === 'file') {
        return this.renderFile(c, data, pathParent, key, property);
      }
      // file
      else if (property.ebType === 'datepicker') {
        return this.renderDatepicker(c, data, pathParent, key, property);
      }
      // not support
      return c('div', {
        domProps: {
          innerText: `not support: ${property.ebType}`,
        },
      });
    },
    renderProperties(c, data, properties, pathParent) {
      let children = [];
      for (const key in properties) {
        const item = this._renderItem(c, data, properties, key, pathParent);
        if (item) {
          if (Array.isArray(item)) {
            children = children.concat(item);
          } else {
            children.push(item);
          }
        }
      }
      return children;
    },
    renderPanel(c, data, pathParent, key, property) {
      const dataPath = pathParent + key + '/';
      return c('eb-list-item-panel', {
        key,
        attrs: {
          link: '#',
          title: this.getTitle(key, property),
          dataPath,
        },
        on: {
          click: () => {
            const params = this.validate.params;
            const verrors = this.validate.verrors;
            this.$view.navigate('/a/validation/validate', {
              target: '_self',
              context: {
                params: {
                  params: {
                    module: params.module,
                    validator: params.validator,
                    schema: property.$ref,
                  },
                  data: data[key],
                  dataPathRoot: this.adjustDataPath(dataPath),
                  errors: verrors ? verrors.slice(0) : null,
                  readOnly: this.validate.readOnly || property.ebReadOnly,
                },
                callback: (code, res) => {
                  if (code) {
                    this.setValue(data, key, res.data, property);
                    this.validate.verrors = res.errors;
                  }
                },
              },
            });
          },
        },
      });
    },
    renderGroup(c, data, pathParent, key, property) {
      // children
      const children = this.renderProperties(c, data[key], property.properties, `${pathParent}${key}/`);
      // group
      const group = c('f7-list-item', {
        key,
        attrs: {
          groupTitle: true,
          title: this.getTitle(key, property),
        },
      });
      // combine
      children.unshift(group);
      return c('div', children);
    },
    renderText(c, data, pathParent, key, property) {
      const title = this.getTitle(key, property);
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: '',
          attrs: {
            title,
            after: data[key] ? data[key].toString() : null,
          },
        });
      }
      const placeholder = property.ebDescription ? this.$text(property.ebDescription) : title;
      let type;
      if (property.ebSecure) {
        type = 'password';
      } else if (property.ebTextarea) {
        type = 'textarea';
      } else {
        type = 'text';
      }
      return c('eb-list-input', {
        key,
        attrs: {
          label: title,
          floatingLabel: true,
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
      });
    },
    renderDatepicker(c, data, pathParent, key, property) {
      const title = this.getTitle(key, property);
      // should format date
      // // the form is readOnly
      // if (this.validate.readOnly || property.ebDisabled) {
      //   return c('f7-list-item', {
      //     key,
      //     staticClass: '',
      //     attrs: {
      //       title,
      //       after: data[key] ? data[key].toString() : null,
      //     },
      //   });
      // }
      const placeholder = property.ebDescription ? this.$text(property.ebDescription) : title;
      // value
      let value = this.getValue(data, key, property);
      if (!value) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = [value];
      }
      // input
      return c('eb-list-input', {
        key,
        attrs: {
          label: title,
          floatingLabel: true,
          type: 'datepicker',
          placeholder,
          resizable: false,
          clearButton: !this.validate.readOnly && !property.ebDisabled,
          dataPath: pathParent + key,
          value,
          readonly: true, // always
          disabled: this.validate.readOnly || property.ebDisabled,
        },
        props: {
          calendarParams: property.ebParams,
        },
        on: {
          'calendar:change': values => {
            // date or array of date
            if (property.type === 'array') {
              this.setValue(data, key, values, property);
            } else {
              this.setValue(data, key, values[0] || null, property);
            }
          }
        },
      });
    },
    renderFile(c, data, pathParent, key, property) {
      const title = this.getTitle(key, property);
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
      if (property.ebSecure) {
        type = 'password';
      } else if (property.ebTextarea) {
        type = 'textarea';
      } else {
        type = 'text';
      }
      // mode
      const mode = this.getMetaValue('mode') || property.ebParams.mode;
      // atomId
      const atomId = this.getMetaValue('atomId') || property.ebParams.atomId || 0;
      // attachment
      const attachment = this.getMetaValue('attachment') || property.ebParams.attachment;
      // flag
      const flag = this.getMetaValue('flag') || property.ebParams.flag;
      // accept
      const accept = this.getMetaValue('accept') || property.ebParams.accept;
      // render
      return c('eb-list-input', {
        key,
        attrs: {
          label: title,
          floatingLabel: true,
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
          focus: event => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = upload.data('timeoutId');
            if (timeoutId) {
              window.clearTimeout(timeoutId);
              upload.data('timeoutId', 0);
            }
            upload.show();
          },
          blur: () => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = window.setTimeout(() => {
              upload.data('timeoutId', 0);
              upload.hide();
            }, 300);
            upload.data('timeoutId', timeoutId);
          },
        },
      }, [
        c('eb-button', {
          slot: 'root-end',
          staticClass: 'eb-input-file-upload',
          domProps: { innerText: this.$text('Upload') },
          props: {
            onPerform: () => {
              this.$view.navigate('/a/file/file/upload', {
                target: '_self',
                context: {
                  params: {
                    mode,
                    atomId,
                    attachment,
                    flag,
                    accept,
                  },
                  callback: (code, value) => {
                    if (code === 200) {
                      this.setValue(data, key, value.downloadUrl, property);
                    }
                  },
                },
              });
            },
          },
        }),
      ]);
    },
    renderToggle(c, data, pathParent, key, property) {
      const title = this.getTitle(key, property);
      return c('f7-list-item', {
        key,
      }, [
        c('span', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-toggle', {
          slot: 'after',
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
    renderSelect(c, data, pathParent, key, property) {
      const title = this.getTitle(key, property);
      const valueCurrent = this.getValue(data, key, property);
      const attrs = {
        name: key,
        dataPath: pathParent + key,
        value: valueCurrent,
        readOnly: this.validate.readOnly || property.ebReadOnly,
      };
      const metaOptions = this.getMetaValue('options');
      if (metaOptions) attrs.options = metaOptions;
      if (!metaOptions && property.ebOptions) attrs.options = property.ebOptions;
      if (property.ebOptionsUrl) {
        attrs.optionsUrl = property.ebOptionsUrl;
        attrs.optionsUrlParams = property.ebOptionsUrlParams;
      }
      attrs.optionsBlankAuto = property.ebOptionsBlankAuto;
      if (property.ebOptionTitleKey) attrs.optionTitleKey = property.ebOptionTitleKey;
      if (property.ebOptionValueKey) attrs.optionValueKey = property.ebOptionValueKey;
      if (property.ebMultiple) attrs.multiple = property.ebMultiple;
      // specially, not showing blank option when notEmpty and has value
      if (property.notEmpty && !this.checkIfEmptyForSelect(valueCurrent)) {
        attrs.optionsBlankAuto = false;
        if (attrs.options && attrs.options.length > 0) {
          const opt = attrs.options[0];
          if (!opt || this.checkIfEmptyForSelect(opt.value)) {
            attrs.options.shift();
          }
        }
      }
      // render
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
